'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import type { Database } from '@/types/supabase'
import { useBalance } from './BalanceProvider';
import axios from 'axios';
import StockPieChart from './PieChart';

interface StockItem {
    id: string;
    symbol: string;
    amount: number | null;
    price: number | null;
    user_id: string | null;
}

interface StockPrice {
    symbol: string;
    price: number;
}

export default function Balance() {
    const { balance, updateBalance, updateStock, stock, updateUserId } = useBalance();
    const [id, setId] = useState<string>("")
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [value, setValue] = useState<number>(0)
    const [symbolAndPrices, setSymbolAndPrices] = useState<StockPrice[]>([])
    const [selectedRow, setSelectedRow] = useState<string | null>(null);

    const supabase = createClientComponentClient<Database>()

    useEffect(() => {
        const getId = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (data && data.session && data.session.user) {
                setId(data.session.user.id)
                // getBalance(data.session.user.id)
                const userBalance = await getBalance(data.session.user.id)
                getStocks(data.session.user.id, userBalance)
                updateUserId(data.session.user.id)
            }
        }
        getId()
    }, [])

    const updateDataIfNewDay = () => {
        const storedDate = localStorage.getItem('lastUpdated');
        const currentDate = new Date().toLocaleDateString();

        if (storedDate !== currentDate) {
          // Update data as it's a new day
            localStorage.setItem('lastUpdated', currentDate);
            getPrices(stocks)
            // fetchDataAndStore();
        }
    };


    const getStocks = async (user_id:string, balance?: number) => {
        let { data: stock, error } = await supabase
        .from('stock')
        .select('*')
        .eq('user_id', user_id);
        if (stock) {
            setStocks(stock);
            getPrices(stock, balance, user_id)
        }
    }

    const getBalance = async (user_id?:string) => {
        let { data: profiles, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user_id? user_id : id);
        if (profiles && profiles.length > 0 && profiles[0].balance !== null) {
            updateBalance(profiles[0].balance);
            return(profiles[0].balance)
        }
    }

    const getPrices = (stock:StockItem[], balance?:number, user_id?:string) => {
        if(stocks) {

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
                // console.log(stockData)
                setSymbolAndPrices(stockData);
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
        setValue(parseFloat(value.toFixed(2)))
        recordValue(parseFloat(value.toFixed(2)), balance, user_id)
    }

    // function waitUntilNotBlank(variable: string): Promise<void> {
    //     return new Promise<void>(resolve => {
    //         const check = () => {
    //             if (variable !== "") {
    //                 resolve();
    //             } else {
    //                 setTimeout(check, 1000); // You can adjust the timeout if needed
    //             }
    //         };
    
    //         check();
    //     });
    // }

    // const recordValue = async (value:number, balance?:number, user_id?:string) => {

    //     if(user_id && balance) {
    //         let { data: val, error } = await supabase
    //         .from('User Value')
    //         .select('*')
    //         .eq('user_id', user_id);
    //         const today = new Date();
    //         const todayFormatted = today.toISOString().split('T')[0];


    //         if(val && val.some(item => item.date.split('T')[0] === todayFormatted)) {
    //             console.log('recorded value today!')
    //         } else {
    //             console.log('didnt record value today!')

    //             let total = value + balance
    //             if(total >= 0) {
    //                 const { data, error } = await supabase
    //                 .from('User Value')
    //                 .insert([ { "value":total, user_id }, ])
    //                 .select();
    //             }
    //         }
    //     }
    // }

    const recordValue = async (value: number, balance?: number, user_id?: string) => {
        if (user_id && balance !== undefined) {
            const today = new Date();
            const todayFormatted = today.toISOString().split('T')[0];
    
            let { data: val, error } = await supabase
                .from('User Value')
                .select('*')
                .eq('user_id', user_id)
                .eq('date', todayFormatted);
            // console.log(val)
    
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
                }
            }
        }
    };
    




    const uniqueSymbols: string[] = Array.from(new Set(stocks.map(item => item.symbol)));

    const handleRowClick = (symbol:string) => {
        // console.log(`Row with symbol ${symbol} clicked.`);
        updateStock(symbol)
    };

    useEffect(() => {
        if(stock !== "") {
            setSelectedRow(stock)
            console.log('changed stock to: ' + stock)
        }
    }, [stock])

    return (
        <div className='flex flex-col'>
            <div className='font-bold text-3xl'>
                ${value}
            </div>

            <div className='flex flex-col md:flex-row'>
                <div className='my-auto flex-grow'>
                    <table className='table-auto'>
                        <thead>
                            <tr>
                                <th className='sm:px-1 md:px-4 py-2'>Symbol</th>
                                <th className='sm:px-1 md:px-4 py-2'>Shares</th>
                                <th className='sm:px-1 md:px-4 py-2'>Purchase Price</th>
                                <th className='sm:px-1 md:px-4 py-2'>Current Share Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueSymbols.map(symbol => {
                                const stockItem = stocks.find(item => item.symbol === symbol);
                                const stockPriceInfo = symbolAndPrices.find(data => data.symbol === symbol);
                                const purchasePrice = stockItem?.price || 0;
                                const currentPrice = stockPriceInfo?.price || 0;
                                const amount = stockItem?.amount || 0;

                                const isSelected = selectedRow === symbol;

                                return (
                                    <tr
                                        key={symbol}
                                        className={isSelected ? 'bg-[#b3f35f] text-black' : 'hover:bg-[#b3f35f] hover:bg-opacity-70 hover:cursor-pointer'}
                                        onClick={() => {
                                            setSelectedRow(symbol);
                                            handleRowClick(symbol);
                                        }}
                                    >
                                        <td className='sm:px-1 md:px-4 py-2'>{symbol}</td>
                                        <td className='sm:px-1 md:px-4 py-2'>{amount}</td>
                                        <td className='sm:px-1 md:px-4 py-2'>${purchasePrice.toFixed(2)}</td>
                                        <td className='sm:px-1 md:px-4 py-2'>${currentPrice.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='flex-grow'>
                    {stocks !== null && <StockPieChart stockData={stocks} symbolAndPricesData={symbolAndPrices} />}
                </div>
            </div>
        </div>
    )
}