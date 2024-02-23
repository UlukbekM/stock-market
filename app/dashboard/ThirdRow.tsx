"use client"
import React, { useState, useEffect } from 'react';
import StockChart from './Charts/StockChart';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { FaCircleInfo } from "react-icons/fa6";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../GlobalRedux/store';
import { setBalance, setStock, setTransaction } from '../GlobalRedux/Features/counter/counterSlice';
import { setFips } from 'crypto';


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
    const dispatch = useDispatch()

    // CHART
    const [stockData, setStockData] = useState<StockAPI[]>([]);
    const [dates, setDates] = useState<string[]>([]);

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

    //RANGE
    const [range, setRange] = useState<string>("1D")
    const [start,setStart] = useState<string>("")
    const [end,setEnd] = useState<string>("")

    
    useEffect(() => {
        get1D()
        // console.log('test')
        dispatch(setStock(""))
    }, [])

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

    const fetchStock = async (stock?: string) => {
        let holder = symbol
        if(stock) {
            holder = stock
        }

        // console.log(display,holder)

        if (holder !== "" && start && end) {
            let apiurl = `https://financialmodelingprep.com/api/v3/historical-price-full/${holder.toUpperCase()}?from=${start}&to=${end}&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`

            if(range === "1D") {
                apiurl = `https://financialmodelingprep.com/api/v3/historical-chart/15min/${holder.toUpperCase()}?from=${start}&to=${end}&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`
            }

            axios.get(apiurl)
            .then((response) => {
                const data = response.data;
                // console.log(data)
                if(data.length !== 0) {
                    let newData
    
                    if(range === "1D") {
                        newData = data.slice().reverse()
                    } else {
                        newData = data.historical.slice().reverse();
                    }
    
                    const dates = newData.map((item:StockAPI) => item.date)
                    setDates(dates)
    
                    setStockData(newData)
                    if(price && range === "1D" && display === holder) {
                        setPriceDate(dates[dates.length-1])
                    } else if(range === "1D" && display !== holder) {
                        axios.get(`https://financialmodelingprep.com/api/v3/quote-order/${holder.toUpperCase()}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`).then((response) => {
                            let temp = response.data
                            // console.log(temp)
                            const myDate = new Date(temp[0].timestamp * 1000);
                            setPriceDate(myDate.toDateString())
                            // console.log(myDate.toDateString())
                            setPrice(temp[0].price)
                        })
                    } else {
                        setPrice(newData[newData.length-1]["close"])
                        setPriceDate(dates[dates.length-1])
                    }
                    setDisplay(holder.toUpperCase())
    
                    setShares(0.00)
                    setDollars(0)
                } else {
                    alert("Ticker could not be found")
                }
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

                if(data) {
                    const { error } = await supabase
                    .from('profiles')
                    .update({ balance: balance - dollars })
                    .eq('id', user_id)
                
                    if (!error) {
                        dispatch(setBalance(balance - dollars));
                        let message = ""
                        if(shares === 1) message = " share of "
                        else message = " shares of "
                        dispatch(setTransaction("Purchased " + shares + message + display.toUpperCase() + " for $" + dollars))
                    }
                }
            } else {
                dispatch(setTransaction("Not enough funds to purchase stocks"))
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
                
                            // if (error) {
                            //     console.error('Error deleting stock:', error.message);
                            // } else {
                            //     console.log('deleted share: ' + transaction.id)
                            // }
                            
                            data.pop()
                            sharesToSell -= transaction.amount;
                        } else {
                        // UPDATE STOCK AMOUNT ON SUPABASE BASED ON TRANSACTION.ID
                            // console.log('updating share')
                            const updatedAmount = transaction.amount - sharesToSell;

                            const { data, error } = await supabase
                            .from('stock')
                            .update({ amount: updatedAmount })
                            .eq('id', transaction.id)
                            .select()
                
                            // if(data) {
                            //     console.log('updated share: ' + transaction.id)
                            // }
                
                            // if (error) {
                            //     console.error('Error updating stock:', error.message);
                            // }
                
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

    const changeRange = (item:string) => {
        // console.log(item)
        if(item !== range) {
            setRange(item)
            if(item === "1D") get1D()
            else if(item === "5D") get5D()
            else if(item === "1M") get1M()
            else if(item === "6M") get6M()
            else if(item === "YTD") getYTD()
            else if(item === "1Y") get1Y()
            else if(item === "5Y") get5Y()
        }
    }

    const get1D = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
    
        let date = year + "-" + month + "-" + day
        setStart(date)
        setEnd(date)
    }

    const get5D = () => {
        const today = new Date();
        let daysToSubtract = 4;
    
        while (daysToSubtract > 0) {
            today.setDate(today.getDate() - 1);
    
            // Skip weekends
            if (today.getDay() !== 0 && today.getDay() !== 6) {
                daysToSubtract--;
            }
        }
    
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
    
        let date = year + "-" + month + "-" + day
        setStart(date)
    }

    const get1M = () => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
    
        const year = oneMonthAgo.getFullYear();
        const month = String(oneMonthAgo.getMonth() + 1).padStart(2, '0');
        const day = String(oneMonthAgo.getDate()).padStart(2, '0');
    
        let date = year + "-" + month + "-" + day
        setStart(date)
    }

    const get6M = () => {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
    
        const year = sixMonthsAgo.getFullYear();
        const month = String(sixMonthsAgo.getMonth() + 1).padStart(2, '0');
        const day = String(sixMonthsAgo.getDate()).padStart(2, '0');
    
        let date = year + "-" + month + "-" + day
        setStart(date)
    }

    const getYTD = () => {
        const today = new Date();
        const year = today.getFullYear();
        
        // Set the date to January 1st of the current year
        const firstDateOfYear = new Date(year, 0, 1);
    
        const yearFirstDate = new Date(firstDateOfYear);
        const yearFirstDateYear = yearFirstDate.getFullYear();
        const month = String(yearFirstDate.getMonth() + 1).padStart(2, '0');
        const day = String(yearFirstDate.getDate()).padStart(2, '0');
    
        let date = yearFirstDateYear + "-" + month + "-" + day
        setStart(date)
    }

    const get1Y = () => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
    
        const year = oneYearAgo.getFullYear();
        const month = String(oneYearAgo.getMonth() + 1).padStart(2, '0');
        const day = String(oneYearAgo.getDate()).padStart(2, '0');
    
        let date = year + "-" + month + "-" + day
        setStart(date)
    }

    const get5Y = () => {
        const today = new Date();
        const fiveYearsAgo = new Date(today);
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    
        const year = fiveYearsAgo.getFullYear();
        const month = String(fiveYearsAgo.getMonth() + 1).padStart(2, '0');
        const day = String(fiveYearsAgo.getDate()).padStart(2, '0');
    
        let date = year + "-" + month + "-" + day
        setStart(date)
    }

    useEffect(() => {
        if(stock !== "" && stock !== symbol) {
            setSymbol(stock)
            fetchStock(stock)
        } else if (stock === "") {
            setStockData([])
            setDisplay("")
            setSymbol("")
            setDates([])
        }
    }, [stock])

    useEffect(() => {
        if(symbol) {
            fetchStock(symbol)
        }
    }, [start])

    return(
        <div className='flex flex-col md:flex-row md:w-full'>
            <div className='rounded-lg bg-secondary flex p-5 flex-col m-2 flex-grow md:w-3/5'>
                <div className='flex flex-col'>
                    <div className='flex sm:flex-row flex-col'>
                        <div className='md:basis-2/8 flex my-3'>
                            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={4} className=' uppercase rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/>
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
                                        <div className="tooltip mx-3 my-auto tooltip-left lg:tooltip-top" data-tip={`Price based on closing price on ${priceDate}`}>
                                            <FaCircleInfo/>
                                        </div>
                                    </div>
                            </div>
                        }
                    </div>
                    <div className="join mx-2 w-full flex flex-wrap">
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "1D" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("1D")}>
                            1D
                        </button>
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "5D" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("5D")}>
                            5D
                        </button>
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "1M" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("1M")}>
                            1M
                        </button>
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "6M" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("6M")}>
                            6M
                        </button>
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "YTD" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("YTD")}>
                            YTD
                        </button>
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "1Y" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("1Y")}>
                            1Y
                        </button>
                        <button
                            className={`my-2 mx-3 border-b-2 px-2 ${range === "5Y" ? "border-accent text-accent" : "border-secondary"}`}
                            onClick={() => changeRange("5Y")}>
                            5Y
                        </button>
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
                            <select className="select max-w-xs"defaultValue={"Order"}>
                                <option value={"Order"}>{buysell ? "Sell Order" : "Buy Order"}</option>
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