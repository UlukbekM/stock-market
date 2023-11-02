'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import type { Database } from '@/types/supabase'

interface ApiStockItem {
    id: string;
    symbol: string;
    amount: number;
    price: number;
    user_id: string;
}

interface ApiStockResponse {
    [index: number]: ApiStockItem;
}

export default function Balance() {
    const [id, setId] = useState<string>("")
    const [balance, setBalance] = useState<number>(0)
    const [stocks, setStocks] = useState<ApiStockResponse[] | null>(null);
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

    // useEffect(() => {
    //     if(id !== "") {
    //         const getData = async () => {
    //             let { data: profiles, error } = await supabase
    //             .from('profiles')
    //             .select('balance')
    //             .eq('id', id);
    //             if (profiles && profiles.length > 0 && profiles[0].balance !== null) {
    //                 setBalance(profiles[0].balance);
    //             }
    //         }
    //         getData()
    //         const getStocks = async () => {
    //             let { data: stock, error } = await supabase
    //             .from('stock')
    //             .select('*')
    //             .eq('user_id', id);
    //             setStocks(stock)
    //         }
    //         getStocks()
    //     }
    // }, [id])

    return (<>
        {balance}
    </>)
}