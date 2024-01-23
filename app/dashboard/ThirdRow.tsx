"use client"
import React, { useState, useEffect } from 'react';
import StockChart from './Charts/StockChart';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { FaCircleInfo } from "react-icons/fa6";

import { useDispatch, useSelector } from 'react-redux/es/exports';
import type { RootState } from '../GlobalRedux/store';
import { setBalance, setStock, setTransaction } from '../GlobalRedux/Features/counter/counterSlice';


interface StockItem {
    c: number;  // Close price
    h: number;  // High price
    l: number;  // Low price
    n: number;  // Number of shares traded
    o: number;  // Open price
    t: number;  // Timestamp (in milliseconds since Unix epoch)
    v: number;  // Volume of shares traded
    vw: number; // Volume weighted average price
}

interface StockAPI {
    date: string;
    close: number;
}


export default function ThirdRow () {
    const supabase = createClientComponentClient<Database>()
    const balance = useSelector((state:RootState) => state.counter.balance)
    const user_id = useSelector((state:RootState) => state.counter.user_id)
    const stock = useSelector((state:RootState) => state.counter.stock)
    const value = useSelector((state:RootState) => state.counter.value)
    const dispatch = useDispatch()


    // CHART
    const [stockData, setStockData] = useState<StockAPI[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [tempDates, setTempDates] = useState<string[]>([]);

    // TICKER
    const [symbol, setSymbol] = useState<string>("")
    const [display, setDisplay] = useState<string>("")
    const [price, setPrice] = useState<number>(0)
    const [priceDate,setPriceDate] = useState<string>("tooltip")

    // PURCHASE STOCK
    const [dollars,setDollars] = useState<number>(0)
    const [shares,setShares] = useState<number>(0)
    const [buysell, setBuySell] = useState<boolean>(false)
    const [selectedValue, setSelectedValue] = useState<string>('Dollars');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        setDollars(0)
        setShares(0)
    };

    const handleButtonClick = (num:number) => {
        if(num === 0) {
            setBuySell(false)
        } else {
            setBuySell(true)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numericValue = parseFloat(inputValue);

        if (inputValue === '') {
            setDollars(0);
            setShares(0.00)
        } else {
            if (!isNaN(numericValue)) {
                if(selectedValue === "Dollars") {
                    setDollars(numericValue);
                } else {
                    setShares(numericValue);
                }
            }
            if(price) {
                if(selectedValue === "Dollars") {
                    let item:number = parseFloat(event.target.value)/price
                    setShares(parseFloat(item.toFixed(4)))
                } else {
                    let item:number = price * numericValue
                    setDollars(parseFloat(item.toFixed(4)))
                }
            }
        }
    };

    function getLastWeekdays(): string[] {
        const weekdays = [];
        const today = new Date();
    
        // Include today's date
        const todayFormatted = formatDate(today);
        weekdays.push(todayFormatted);
    
        while (weekdays.length < 5) {
            today.setDate(today.getDate() - 1);
    
            // Check if the current day is a weekday (Monday to Friday)
            if (today.getDay() >= 1 && today.getDay() <= 5) {
                const formattedDate = formatDate(today);
                weekdays.push(formattedDate);
            }
        }
    
        return weekdays;
    }
    
    function formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const fetchStock = async (stock?: string) => {
        let holder = symbol
        if(stock) {
            holder = stock
        }

        const [to,a,b,c,from] = getLastWeekdays();
        
        if (holder !== "") {
            const apiurl = `https://financialmodelingprep.com/api/v3/historical-price-full/${holder.toUpperCase()}?from=${from}&to=${to}&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`

            axios.get(apiurl)
            .then((response) => {
                const data = response.data;
                const newData = data.historical.slice().reverse();

                const dates = newData.map((item:StockAPI) => item.date)
                setDates(dates)
                setPriceDate(dates[dates.length-1])

                setStockData(newData)
                setPrice(newData[newData.length-1]["close"])
                setDisplay(holder.toUpperCase())

                setShares(0.00)
                setDollars(0)
            })
        }
        dispatch(setStock(stock? stock: symbol.toUpperCase()))
    }

    const BuyOrSell = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!buysell) {
            purchaseStock()
        } else {
            sellStock()
        }
    }

    const purchaseStock = async () => {
        if(user_id && display && price && dollars) {
            if(balance >= 0 && balance >= dollars) {
                const { data, error } = await supabase
                .from('stock')
                .insert([ { "symbol":display.toUpperCase(), "amount":shares, price, user_id }, ])
                .select();
    
                if (error) {
                    console.error('Error inserting data:', error);
                } else {
                    console.log('Data inserted successfully:', data);
                }

                if(data) {
                    const { error } = await supabase
                    .from('profiles')
                    .update({ balance: balance - dollars })
                    .eq('id', user_id)
                
                    if (error) {
                        console.error('Error updating balance:', error);
                    } else {
                        console.log('Balance updated successfully');
                        dispatch(setBalance(balance - dollars));
                        let message = ""
                        if(shares === 1) message = " share of "
                        else message = " shares of "
                        dispatch(setTransaction("Purchased " + shares + message + display.toUpperCase() + " for $" + dollars))
                    }
                }
            } else {
                alert('not enough funds')
            }
        } else {
            console.log('error buying stock')
        }
        setDollars(0)
        setShares(0)
    }

    const sellStock = async () => {
        if(user_id) {
            let { data, error } = await supabase
            .from('stock')
            .select('*')
            .eq('user_id', user_id)
            .eq('symbol', stock);

            if (data) {
                data.sort((a, b) => b.amount - a.amount);

                let total = data.reduce((sum, transaction) => sum + transaction.amount, 0);

                let sharesToSell = shares;
                if (sharesToSell > total) {
                    alert("Not enough shares");
                    return;
                }
                    while (sharesToSell > 0 && data.length > 0) {
                        const transaction = data[data.length - 1];
                        // console.log(transaction)
                
                        if (transaction.amount <= sharesToSell) {
                        // DELETE STOCK FROM SUPABASE BASED ON TRANSACTION.ID
                            const { error } = await supabase
                            .from('stock')
                            .delete()
                            .eq('id', transaction.id)
                
                            if (error) {
                                console.error('Error deleting stock:', error.message);
                            } else {
                                console.log('deleted share: ' + transaction.id)
                            }
                            
                            data.pop()
                            sharesToSell -= transaction.amount;
                        } else {
                        // UPDATE STOCK AMOUNT ON SUPABASE BASED ON TRANSACTION.ID
                            console.log('updating share')
                            const updatedAmount = transaction.amount - sharesToSell;

                            const { data, error } = await supabase
                            .from('stock')
                            .update({ amount: updatedAmount })
                            .eq('id', transaction.id)
                            .select()
                
                            if(data) {
                                console.log('updated share: ' + transaction.id)
                            }
                
                            if (error) {
                                console.error('Error updating stock:', error.message);
                            }
                
                            sharesToSell = 0;
                        }
                    }

                if(sharesToSell === 0) {
                    let newBalance = balance + dollars
            
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .update({ balance: newBalance })
                        .eq('id', user_id);
            
                    if (profileError) {
                        console.error('Error updating balance:', profileError.message);
                    } else {
                        console.log('Balance updated successfully:', profileData);
                        dispatch(setBalance(balance+dollars))
                        let message = ""
                        if(shares === 1) message = " share of "
                        else message = " shares of "
                        dispatch(setTransaction("Sold " + shares + message + display.toUpperCase() + " for $" + dollars))
                    }
                }
            } else {
                return
            }
        }
    }

    useEffect(() => {
        if(stock !== "" && stock !== symbol) {
            setSymbol(stock)
            fetchStock(stock)
        }
    }, [stock])

    return(
        <div className='flex flex-col md:flex-row md:w-full'>
            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow md:w-3/5'>
                <div className='flex flex-col'>
                    <div className='flex sm:flex-row flex-col'>
                        {/* <button onClick={() => fetchStock()}>test</button> */}
                        <div className='md:basis-2/8 flex my-3'>
                            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={4} className=' uppercase rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/>
                            {/* <button onClick={()=>fetchStock()} className=' button block bg-[#B2F35F] hover:bg-[#8ec24c] text-black py-2 px-4 rounded-md my-2 font-semibold'>Search</button> */}
                            <button onClick={()=>fetchStock()} className="btn btn-primary my-auto">Search</button>
                        </div>
                        {display && 
                            <div className='md:basis-6/8 m-auto flex w-full justify-center my-3'>
                                    <div className='my-auto flex md:mx-3'>
                                        <p className='my-auto'>STOCK: </p>
                                        <p className='text-xl md:text-3xl font-bold px-3'>{display}</p>
                                    </div>
                                    <div className='my-auto flex md:mx-3'>
                                        <p className='my-auto'>PRICE: </p>
                                        <p className='text-xl md:text-3xl font-bold px-3'>{price}</p>
                                        <p className='my-auto'>USD</p>
                                        <div className="tooltip mx-3 my-auto" data-tip={`Price based on closing price on ${priceDate}`}>
                                            <FaCircleInfo/>
                                        </div>
                                    </div>
                            </div>
                        }
                    </div>
                    <div>
                        {stockData !== null && <StockChart stockData={stockData} dates={dates}/>}
                    </div>
                </div>
            </div>

            <div className='flex flex-col m-2 flex-grow'>
                <div className='w-full'>
                    <button className={`btn w-1/2 bg-test rounded-b-none rounded-tr-none rounded-tl-lg no-animation ${!buysell ? "btn-primary" : ""}`} onClick={()=>handleButtonClick(0)}>{'Buy ' + display}</button>
                    <button className={`btn w-1/2 rounded-b-none rounded-tl-none rounded-tr-lg no-animation ${buysell ? "btn-primary" : ""}`} onClick={()=>handleButtonClick(1)}>{'Sell ' + display}</button>
                </div>

                <div className='rounded-br-lg rounded-bl-lg bg-[#202C2D] flex-grow'>
                    <form onSubmit={BuyOrSell} className='flex justify-center flex-col p-5 items-center'>
                        <div className='flex justify-between w-full py-3'>
                            <label className='my-auto'>Order Type</label>
                            {/* <input type="text" placeholder={`${buysell ? "Sell Order" : "Buy Order"}`} className="input input-bordered max-w-xs" disabled /> */}
                            <select className="select max-w-xs"defaultValue={"Order"}>
                                <option value={"Order"}>{buysell ? "Sell Order" : "Buy Order"}</option>
                                {/* <option disabled>Shares</option> */}
                            </select>
                        </div>

                        <div className='flex justify-between w-full py-3'>
                            <label className='my-auto'>{buysell ? "Sell In" : "Buy In"}</label>
                            <select className="select max-w-xs" value={selectedValue} onChange={handleChange}>
                                <option value="Dollars">Dollars</option>
                                <option value="Shares">Shares</option>
                            </select>
                        </div>
                        
                        <div className='flex justify-between w-full py-3'>
                            <label className='my-auto'>Amount($)</label>
                            <input type="text" placeholder="Type here" className="input input-bordered max-w-xs" value={dollars} onChange={handleInputChange} disabled={selectedValue === "Shares"}/>
                        </div>

                        <div className='flex justify-between w-full py-3'>
                            <label className='my-auto'>Quantity</label>
                            <input type="text" placeholder="You can't touch this" className="input input-bordered max-w-xs" value={shares} onChange={handleInputChange}  disabled={selectedValue === "Dollars"} />
                        </div>
                        <button className="btn btn-primary py-3 w-24" disabled={dollars === 0 || display === ""}>{buysell ? "Sell":"Purchase" }</button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}