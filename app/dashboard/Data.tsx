"use client"
import React, { useState, useEffect } from 'react';
import StockChart from './StockChart';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
// import { useBalance } from './BalanceContext';
import { useBalance } from './BalanceProvider';


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


const today = new Date();
const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


export default function Data () {
    const supabase = createClientComponentClient<Database>()
    const { balance, updateBalance } = useBalance();


    // CHART
    const [stockData, setStockData] = useState<StockItem[]>([]);
    const [dates, setDates] = useState<string[]>([formattedToday]);

    // TICKER
    const [symbol, setSymbol] = useState<string>("")
    const [display, setDisplay] = useState<string>("")
    const [price, setPrice] = useState<number>(0)

    // PURCHASE STOCK
    const [amount,setAmount] = useState<number>(0)
    const [estimate,setEstimate] = useState<number>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numericValue = parseFloat(inputValue);

        if (inputValue === '') {
            // Handle empty input: set the state to an empty string
            setAmount(0);
            setEstimate(0.00)
        } else {
            if (!isNaN(numericValue)) {
                setAmount(numericValue);
            }

            if(price) {
                let item:number = parseFloat(event.target.value)/price
                setEstimate(parseFloat(item.toFixed(4)))
            }
        }
    };

    function getLastWeekdays(): string[] {
        const weekdays = [];
        const today = new Date();
    
        while (weekdays.length < 5) {
            today.setDate(today.getDate() - 1);
    
            // Check if the current day is a weekday (Monday to Friday)
            if (today.getDay() >= 1 && today.getDay() <= 5) {
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
                const day = String(today.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                weekdays.push(formattedDate);
            }
        }
    
        return weekdays;
    }

    const fetchStock = async () => {
        // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`);
        // const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=pz6tSzi5sS37ORgZ8LgpxxF1MM_EHNHG`);
        // const response = await fetch(`https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2019-01-02&token=${process.env.TIINGO_API_KEY}`)
        // const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
        if(symbol !== "") {
            const [to,a,b,c,from] = getLastWeekdays();
            setDates([to,a,b,c,from])
    
            const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
            axios.get(apiUrl)
            .then((response) => {
                const data = response.data;
                setStockData(data.results)
                setPrice(data.results[4]["c"])
                setDisplay(symbol.toUpperCase())
                setEstimate(0.00)
                setAmount(0)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }

    const purchaseStock = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // updateBalance(500)
        
        const { data: { session } } = await supabase.auth.getSession()
        let user_id:string | undefined = session?.user.id

        if(user_id && display && price && amount) {
            const { data } = await supabase.from('profiles')
            .select('balance')
            .eq('id', user_id);

            let balance = 0

            if (data && data.length > 0 && data[0].balance !== null) {
                balance = data[0].balance
            }

            if(balance > 0 && balance > amount) {
                const { data, error } = await supabase
                .from('stock')
                .insert([ { "symbol":display.toUpperCase(), "amount":estimate, price, user_id }, ])
                .select();
    
                if (error) {
                    console.error('Error inserting data:', error);
                } else {
                    console.log('Data inserted successfully:', data);
                }

                if(data) {
                    const { error } = await supabase
                    .from('profiles')
                    .update({ balance: balance - amount })
                    .eq('id', user_id)
                
                    if (error) {
                        console.error('Error updating balance:', error);
                    } else {
                        console.log('Balance updated successfully');
                        updateBalance(balance - amount)
                    }
                }
            } else {
                alert('not enough funds')
            }
        }
        setAmount(0)
        setEstimate(0)
    }

    return(
        
        <div className='flex flex-col md:flex-row md:w-full'>
            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow md:w-3/5'>
                <div className='flex flex-col'>
                    <div className='flex'>
                        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={4} className='uppercase rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/>
                        <button onClick={()=>fetchStock()} className='button block bg-[#B2F35F] hover:bg-[#8ec24c] text-black py-2 px-4 rounded-lg my-2 font-semibold'>Search</button>
                    </div>
                    <div>
                        {display + " " + price}
                    </div>
                    {stockData !== null && <StockChart stockData={stockData} dates={dates}/>}
                </div>
            </div>

            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow'>
                <div className='flex flex-row justify-between'>
                    <div className='font-bold underline'>
                        Buy {display}
                    </div>
                    <div className=''>
                        Sell {display}
                    </div>
                </div>
                <form onSubmit={purchaseStock}>
                    <div className='flex justify-between'>
                        <label className='my-auto'>Amount($)</label>
                        <input
                            value={amount}
                            id="amount"
                            onChange={handleInputChange}
                            type='text'
                            placeholder='$0.00'
                            className='rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/>
                        {/* <input value={amount} id="amount" onChange={handleInputChange} type='number' name="number" placeholder='$0.00' className='rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/> */}
                    </div>
                    <div className='flex justify-between'>
                        <label className='my-auto'>Est. Quantity</label>
                        <input type='number' name="number" value={estimate} className='rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto' readOnly/>
                    </div>
                    <button type='submit' className='button block disabled:bg-[#597a30] disabled:hover:bg-[#597a30] disabled:cursor-not-allowed bg-[#B2F35F] hover:bg-[#8ec24c] text-black py-2 px-4 rounded-lg my-2 font-semibold' disabled={amount === 0}>Purchase</button>
                </form>
            </div>
        </div>
        
    )
}