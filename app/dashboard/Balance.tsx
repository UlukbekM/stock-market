'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import type { Database } from '@/types/supabase'
import { useBalance } from './BalanceProvider';
import axios from 'axios';

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
    const { balance, updateBalance } = useBalance();
    const [id, setId] = useState<string>("")
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [value, setValue] = useState<number>(0)
    const [symbolAndPrices, setSymbolAndPrices] = useState<StockPrice[]>([]);

    const supabase = createClientComponentClient<Database>()

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (data && data.session && data.session.user) {
                setId(data.session.user.id)
            }
        }



        getData()
    }, [])

    useEffect(() => {
        if(id !== "") {
            const getData = async () => {
                let { data: profiles, error } = await supabase
                .from('profiles')
                .select('balance')
                .eq('id', id);
                if (profiles && profiles.length > 0 && profiles[0].balance !== null) {
                    updateBalance(profiles[0].balance);
                }
            }
            getData()
            const getStocks = async () => {
                let { data: stock, error } = await supabase
                .from('stock')
                .select('*')
                .eq('user_id', id);
                if (stock) {
                    setStocks(stock);
                    getPrices(stock)
                }
                // console.log(stock)
            }
            getStocks()
        }
    }, [id])

    const getPrices = (stock:StockItem[]) => {
        // console.log(stock)
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
            console.log(stockData , stock)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    return (<>
        {balance}
        {/* {stocks &&         
            stocks.map((stock, index) => (
                <p key={index} className="p-2 rounded">
                    {stock.amount + " shares of " + stock.symbol + " bought for " + stock.price}
                </p>
            ))
        } */}
    </>)
}