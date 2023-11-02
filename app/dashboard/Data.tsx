"use client"
import React, { useEffect, useState } from 'react';
import StockChart from './StockChart';
// import BuyStock from './BuyStock';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
import { Database } from '@/types/supabase';
import axios from 'axios';


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

interface StockData {
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    [key: string]: string; // Index signature to allow dynamic property names
}

interface StockDataByTimestamp {
    [timestamp: string]: StockData;
}

const emptyStockData: StockData = {
    open: "",
    high: "",
    low: "",
    close: "",
    volume: ""
};

const today = new Date();
const formattedToday = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;


export default function Data () {
    const [stockData, setStockData] = useState<StockItem[]>([]);
    const [dates, setDates] = useState<string[]>([formattedToday]);


    // const [timeSeriesData, setTimeSeriesData] = useState<StockDataByTimestamp | null>(emptyStockDataByTimestamp);
    const [symbol, setSymbol] = useState<string>("")
    const [display, setDisplay] = useState<string>("")
    const [price, setPrice] = useState<string>("")

    const [amount,setAmount] = useState<string>("")

    const [range,setRange] = useState<number>(0)

    const changeRange = (value: number) => {
        setRange(value);
        console.log(value)
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

    const fetchDataFromApi = async () => {
        if(symbol !== "") {
            try {
                // const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`);
                // const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=pz6tSzi5sS37ORgZ8LgpxxF1MM_EHNHG`);
                // const response = await fetch(`https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2019-01-02&token=${process.env.TIINGO_API_KEY}`)

                // const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
                const [to, from] = getLastWeekdays();

                const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol.toUpperCase()}/range/1/day/${from}/${to}?adjusted=true&sort=desc&limit=120&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
                axios.get(apiUrl)
                .then((response) => {
                    const data = response.data;
                    console.log(data.results);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
                // const jsonData = await response.json();
                // console.log(jsonData)
    
    
                // if (!response.ok) {
                // throw new Error('Network response was not ok');
                // }
    
                // const jsonData: { 'Time Series (Daily)': StockDataByTimestamp } = await response.json();
                // if("Error Message" in jsonData) {
                //     alert("Invalid symbol")
                // } else {
                //     const { 'Time Series (Daily)': timeSeries } = jsonData;
                //     setTimeSeriesData(timeSeries);
                //     console.log(jsonData)
    
                //     const dates = Object.keys(timeSeries);
                //     const firstDate = dates[0];
                //     const firstItem = timeSeries[firstDate];
                    
                //     const roundedClose = parseFloat(firstItem["4. close"]).toFixed(2);
    
                //     setDisplay(symbol.toUpperCase())
                //     setPrice(roundedClose)
    
                //     console.log(firstItem["4. close"])
    
                // }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchStock = async () => {
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
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }

    // useEffect(() => {
    //     console.log(stockData,dates)
    // }, [stockData, dates]);

    const purchaseStock = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("buy stock: " + symbol, "this many stocks: " + amount, "for this price each: " + price)
        setAmount("")
        
        // const { data, error } = await supabase.from('stock').insert([
        // { symbol: symbol, other_column: 'otherValue' },
        // ])
        // .select()

    }

    return(
        
        <div className='flex flex-col md:flex-row md:w-full'>
            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow md:w-3/5'>
                <div className='flex flex-col'>
                    {/* <div className="btn-group flex">
                        <button
                            className={`${
                            range === 0 ? 'bg-blue-700' : 'bg-blue-200'
                            } hover:bg-blue-700 text-black font-bold py-2 px-4 rounded `}
                            onClick={() => changeRange(0)}
                        >
                            Button 0
                        </button>
                        <button
                            className={`${
                            range === 1 ? 'bg-green-700' : 'bg-green-200'
                            } hover:bg-green-700 text-black font-bold py-2 px-4 rounded`}
                            onClick={() => changeRange(1)}
                        >
                            Button 1
                        </button>
                        <button
                            className={`${
                            range === 2 ? 'bg-yellow-700' : 'bg-yellow-200'
                            } hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded`}
                            onClick={() => changeRange(2)}
                        >
                            Button 2
                        </button>
                    </div> */}
                    <div className='flex'>
                        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} maxLength={4} className='uppercase rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/>
                        <button onClick={()=>fetchStock()} className='button block bg-[#B2F35F] hover:bg-[#8ec24c] text-black py-2 px-4 rounded-lg my-2 font-semibold'>Search</button>
                    </div>
                    <div>
                        {display + " " + price}
                    </div>
                    {/* {stockData !== null && <StockChart stockData={[stockData]} dates={dates}/>} */}
                    {stockData !== null && <StockChart stockData={stockData} dates={dates}/>}
                    {/* <Chart/> */}
                </div>
            </div>
            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow'>
                <div className='flex flex-row justify-between'>
                    <div className=''>
                        Buy {display}
                    </div>
                    <div className=''>
                        Sell {display}
                    </div>
                </div>
                <form onSubmit={purchaseStock}>
                {/* <form action="/auth/purchase" method="post"> */}
                    <div className='flex justify-between'>
                        <label className='my-auto'>Amount($)</label>
                        <input value={amount} id="amount" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)} type='number' name="number" placeholder='$0.00' className='rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto'/>
                    </div>
                    <div className='flex justify-between'>
                        <label className='my-auto'>Est. Quantity</label>
                        <input type='number' name="number" placeholder='0.00' className='rounded-lg mx-4 my-2 bg-[#1b2627] text-[#748384] p-2 w-auto' readOnly/>
                    </div>
                    <button type='submit' className='button block bg-[#B2F35F] hover:bg-[#8ec24c] text-black py-2 px-4 rounded-lg my-2 font-semibold'>Purchase</button>
                </form>
            </div>
        </div>
        
    )
}