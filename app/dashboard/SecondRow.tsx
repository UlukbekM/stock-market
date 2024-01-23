'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import type { Database } from '@/types/supabase'
// import { useBalance } from './BalanceProvider';
import axios from 'axios';
import StockPieChart from './Charts/PieChart';
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";

import { useDispatch, useSelector } from 'react-redux/es/exports';
import type { RootState } from '../GlobalRedux/store';
import { setBalance, setStock, setUserId, setValue, setTransaction } from '../GlobalRedux/Features/counter/counterSlice';

interface StockItem {
    id: string;
    symbol: string;
    amount: number | null;
    price: number | null;
    user_id: string | null;
    real_price?: number | null;
}

interface StockPrice {
    symbol: string;
    price: number;
}

export default function SecondRow() {
    const user_id = useSelector((state:RootState) => state.counter.user_id)
    const balance = useSelector((state:RootState) => state.counter.balance)
    const stock = useSelector((state:RootState) => state.counter.stock)
    const value = useSelector((state:RootState) => state.counter.value)
    const transaction = useSelector((state:RootState) => state.counter.transaction)
    const dispatch = useDispatch()

    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [newStocks,setNewStocks] = useState<StockItem[]>([])
    const [symbolAndPrices, setSymbolAndPrices] = useState<StockPrice[]>([])
    const [selectedRow, setSelectedRow] = useState<string | null>(null);

    const [sort,setSort] = useState<string>("symbol")

    const supabase = createClientComponentClient<Database>()

    const calculateAveragePrice = (items: { amount: number; price: number }[]): number => {
        const totalValue = items.reduce((sum, item) => sum + item.amount * item.price, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
        if (totalAmount === 0) {
            return 0; // Avoid division by zero
        }
    
        return totalValue / totalAmount;
    };

    const combineStockItems = (data: StockItem[],stockData:StockPrice[]) => {
        const combinedData: { [key: string]: { amount: number; price: number; real_price: number } } = {};

    
        data.forEach((item) => {
            const { symbol, amount, price } = item;
            if(amount && price && symbol) {
                if(combinedData[symbol]) {
                    let temp = [{amount: combinedData[symbol].amount,price: combinedData[symbol].price}, {amount: amount, price: price}]
                    const averagePrice = calculateAveragePrice(temp)
                    combinedData[symbol].amount += amount
                    combinedData[symbol].price = averagePrice
                } else{
                    const stockPriceInfo = stockData.find(data => data.symbol === item.symbol)
                    let real_price = 0
                    if(stockPriceInfo) {
                        real_price = stockPriceInfo.price
                    }
                    combinedData[symbol] = {
                        amount: amount,
                        price: price,
                        // real_price: 0
                        real_price: real_price
                    }
                }
            }
        });
    
        const result: StockItem[] = Object.entries(combinedData).map(([symbol, data]) => ({
            id: "",
            user_id: "",
            symbol,
            amount: data.amount,
            price: data.price,
            real_price: data.real_price
        }));
        
        result.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setNewStocks(result)
    };

    useEffect(() => {
        const getId = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (data && data.session && data.session.user) {
                // setId(data.session.user.id)
                dispatch(setUserId(data.session.user.id));

                const userBalance = await getBalance(data.session.user.id)
                dispatch(setBalance(userBalance));

                getStocks(data.session.user.id, userBalance)
            }
        }
        getId()
    }, [])

    const getBalance = async (id:string) => {
        let { data: profiles, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', id);
        if (profiles && profiles.length > 0 && profiles[0].balance !== null) {
            // console.log(profiles[0].balance)
            dispatch(setBalance(profiles[0].balance))
            return(profiles[0].balance)
        }
        return -1
    }

    const getStocks = async (id:string, balance: number) => {
        let { data: stock, error } = await supabase
        .from('stock')
        .select('*')
        .eq('user_id', id);
        if (stock && stock?.length>0) {
            setStocks(stock);
            // console.log(stock)
            getPrices(stock, balance, id)
        } else {
            // console.log('no stocks')

            setSymbolAndPrices([
                {
                "symbol": "No stocks",
                "price": 1
                },
            ]);
            setStocks([
                {
                "id": "",
                "symbol": "EMPTY",
                "amount": 1,
                "price": 1,
                "user_id": ""
                },
            ]);
            recordValue(0,balance,id)
        }
    }

    const getPrices = (stock:StockItem[], balance?:number, user_id?:string) => {
        if(stock) {
            const uniqueSymbols: Set<string> = new Set();
            stock.forEach(item => {
                uniqueSymbols.add(item.symbol);
            });

            let symbols = Array.from(uniqueSymbols).join(',')
            const apiUrl = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`

            axios.get(apiUrl)
            .then((response) => {
                const stockData: StockPrice[] = response.data.map((item: any) => ({
                    symbol: item.symbol,
                    price: Number(item.price),
                }));
                setSymbolAndPrices(stockData);
                // console.log(stockData)
                combineStockItems(stock, stockData)
                calculateValue(stockData,stock,balance,user_id)
                // localStorage.setItem('apiData', JSON.stringify(stockData));          /////////////SAVE   STOCK PRICES////////////
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }

    const calculateValue = (stockData:StockPrice[],stock:StockItem[],balance?:number, user_id?:string) => {
        let value = 0

        stock.forEach((stockItem) => {
            const { symbol, amount } = stockItem;
    
            if (amount !== null && amount !== undefined) {
                const stockPriceInfo = stockData.find((data) => data.symbol === symbol);
    
                if (stockPriceInfo) {
                    const { price: currentPrice } = stockPriceInfo;
                    const stockValue = currentPrice * amount;
                    value += stockValue;
                }
            }
        });
        dispatch(setValue(parseFloat(value.toFixed(2))))
        recordValue(parseFloat(value.toFixed(2)), balance, user_id)
    }

    function iterateLocalStorage() {
        const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
    
            if (key && key === key.toUpperCase()) {
                const value = localStorage.getItem(key);
    
                try {
                    const data = JSON.parse(value || '');
                    const currentTime = new Date(data.currentTime).getTime();
                    const currentTimestamp = new Date().getTime();
    
                    if (currentTimestamp - currentTime >= twentyFourHoursInMilliseconds) {
                        // More than a day has passed, remove the entry from localStorage
                        localStorage.removeItem(key);
                        console.log(`Removed entry with key ${key} from localStorage.`);
                    }
                } catch (error) {
                    console.error(`Error processing entry with key ${key}:`, error);
                }
            }
        }
    }

    const recordValue = async (value: number, balance?: number, user_id?: string) => {
        // SAVE IN LOCALSTORAGE LAST UPDATED TIME
        const storedDate = localStorage.getItem('savedDate');

        if (storedDate) {
            const savedTimestamp = new Date(storedDate).getTime();
            const currentTimestamp = new Date().getTime();
            const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
            if (currentTimestamp - savedTimestamp >= twentyFourHoursInMilliseconds) {
                // More than a day has passed, remove the date, run your function, and save a new date
                localStorage.removeItem('savedDate');
                iterateLocalStorage()
                // Call your function here
                recordValue(value,balance,user_id);
            }
        } else if(user_id && balance !== undefined) {
            // No date saved, run your function and save the current date
            // Call your function here
            const today = new Date();
            const todayFormatted = today.toISOString().split('T')[0];
    
            let { data: val, error } = await supabase
                .from('User Value')
                .select('*')
                .eq('user_id', user_id)
                .eq('date', todayFormatted);
    
            if (val && val.length > 0) {
                console.log('Value for today already recorded!');
            } else {
                console.log('Recording value for today!');

                let total = value + balance;

                if (total >= 0) {
                    const { data, error } = await supabase
                        .from('User Value')
                        .insert([{ "value": total, user_id, date: todayFormatted }])
                        .select();
                        if(data) return
                    // console.log(data)
                }
            }

            const currentDate = new Date();
            localStorage.setItem('savedDate', currentDate.toISOString());
        } else {
            alert("error purchasing stock")
        }
    };   

    const handleRowClick = (symbol:string) => {
        dispatch(setStock(symbol))
        setSelectedRow(symbol)
    };

    const sortTable = (sortOrder: '1' | '2' | '3' | '4') => {
        const sortedData = [...newStocks];
        
        switch (sortOrder) {
            case '1':
                if(sort === "symbol") {
                    sortedData.sort((a, b) => b.symbol.localeCompare(a.symbol));
                    setSort("symbol2")
                } else {
                    sortedData.sort((a, b) => a.symbol.localeCompare(b.symbol));
                    setSort("symbol")
                }
                break;
            case '2':
                if(sort === "shares") {
                    sortedData.sort((a, b) => (a.amount || 0) - (b.amount || 0));
                    setSort("shares2")
                } else {
                    sortedData.sort((a, b) => (b.amount || 0) - (a.amount || 0));
                    setSort("shares")
                }
                break;
            case '3':
                if(sort === "price") {
                    sortedData.sort((a, b) => (a.price || 0) - (b.price || 0));
                    setSort("price2")
                } else {
                    sortedData.sort((a, b) => (b.price || 0) - (a.price || 0));
                    setSort("price")
                }
                break;
            case '4':
                if(sort === "real_price") {
                    sortedData.sort((a, b) => (a.real_price || 0) - (b.real_price || 0));
                    setSort("real_price2")
                } else {
                    sortedData.sort((a, b) => (b.real_price || 0) - (a.real_price || 0));
                    setSort("real_price")
                }
                break;
            default:
                break;
        }

        setNewStocks(sortedData)
    };

    useEffect(() => {
        if(stock !== "") {
            // console.log('changed selected to:' + stock)
            setSelectedRow(stock)
        }
    }, [stock])

    useEffect(() => {
        if(transaction !== "") {
            // console.log('transaction has been made')
            if(user_id) {
                getStocks(user_id, balance)
            }
            dispatch(setTransaction(""))
        }
    }, [transaction])

    function testAlert () {
        dispatch(setTransaction("test"))
    }

    return (
        <div className='flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap'>
            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow basis-2/3'>
                <div className='font-bold'>
                    <h1 className='text-3xl'>
                        Stocks
                    </h1>
                </div>

                <div className="w-full max-h-80 h-full">
                    <table className="table overflow-auto ">
                        <thead className='sticky top-0 z-8 bg-[#202C2D]'>
                            <tr className='h-auto'>
                                <th className='hidden md:block'></th>
                                <th className='px-1 basis-1/4'>
                                    <div className='flex flex-row cursor-pointer' onClick={()=> sortTable('1')}>
                                        <p className='text-[#b2f35f] md:text-lg'>Symbol </p> 
                                        {sort === "symbol" && <FaChevronDown className='my-auto mx-1'/>} 
                                        {sort === "symbol2" && <FaChevronUp className='my-auto mx-1'/>}
                                        {sort !== "symbol" && sort !== "symbol2" && <FaChevronUp className='my-auto mx-1 opacity-0'/>}
                                    </div>
                                </th>
                                <th className='px-1 basis-1/4'>
                                    <div className='flex flex-row cursor-pointer' onClick={()=> sortTable('2')}>
                                        <p className='text-[#b2f35f] md:text-lg'>Shares </p>
                                        {sort === "shares" && <FaChevronDown className='my-auto mx-1'/>} 
                                        {sort === "shares2" && <FaChevronUp className='my-auto mx-1'/>}
                                        {sort !== "shares" && sort !== "shares2" && <FaChevronUp className='my-auto mx-1 opacity-0'/>}
                                    </div>
                                </th>
                                <th className='px-1 basis-1/4'>
                                    <div className='flex cursor-pointer' onClick={() => sortTable('3')}>
                                        <div className='flex flex-col md:flex-row'>
                                            <p className='text-[#b2f35f] md:text-lg text-wrap'>Average </p>
                                            <p className='text-[#b2f35f] md:text-lg text-wrap'>Price</p>
                                        </div>
                                        {sort === 'price' && <FaChevronDown className='my-auto mx-1' />}
                                        {sort === 'price2' && <FaChevronUp className='my-auto mx-1' />}
                                        {sort !== 'price' && sort !== 'price2' && <FaChevronUp className='my-auto mx-1 opacity-0' />}
                                    </div>
                                </th>
                                <th className='px-1 basis-1/4'>
                                    <div className='flex cursor-pointer' onClick={()=> sortTable('4')}>
                                        <div className='flex flex-col md:flex-row'>
                                            <p className='text-[#b2f35f] md:text-lg text-wrap'>Current </p>
                                            <p className='text-[#b2f35f] md:text-lg text-wrap'> Price</p>
                                        </div>
                                        {sort === "real_price" && <FaChevronDown className='my-auto mx-1'/>} 
                                        {sort === "real_price2" && <FaChevronUp className='my-auto mx-1'/>}
                                        {sort !== "real_price" && sort !== "real_price2" && <FaChevronUp className='my-auto mx-1 opacity-0'/>}
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className='overflow-y-auto'>
                            {newStocks.map((item, index) => {
                                return (
                                    <tr key={index} onClick={() => handleRowClick(item.symbol)}
                                        className={`cursor-pointer ${selectedRow === item.symbol ? 'bg-[#B2F35F] text-black' : ''} ${selectedRow !== item.symbol ? 'hover:bg-[#b3f35fb2]' : ""}`}>
                                        <th className='hidden md:block'>{index + 1}</th>
                                        <td className='px-1'>{item.symbol}</td>
                                        <td className='px-1'>{item.amount}</td>
                                        <td className='px-1'>${item.price?.toFixed(2)}</td>
                                        <td className='px-1'>${item.real_price?.toFixed(2)}</td>
                                    </tr>)
                            })}
                        </tbody>
                    

                    </table>
                </div>
            
            </div>

            <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow basis-1/3'>
                <div className='font-bold'>
                    <h1 className='text-3xl'>
                        Portfolio
                    </h1>
                </div>
                
                {stocks !== null && <StockPieChart stockData={stocks} symbolAndPricesData={symbolAndPrices} />}
            </div>
        </div>


    )
}