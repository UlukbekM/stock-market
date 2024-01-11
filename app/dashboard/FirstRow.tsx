"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import checkAndRemoveSavedDate from './TimeCheck';
import PortfolioChart from './Charts/PortfolioChart';

import { useDispatch, useSelector } from 'react-redux/es/exports';
import type { RootState } from '../GlobalRedux/store';
import { setBalance, setStock } from '../GlobalRedux/Features/counter/counterSlice';

interface userValue {
    date: string,
    value: number
}

export default function FirstRow () {
    const supabase = createClientComponentClient<Database>()
    const user_id = useSelector((state:RootState) => state.counter.user_id)
    const value = useSelector((state:RootState) => state.counter.value)
    const balance = useSelector((state:RootState) => state.counter.balance)
    const [userValues,setUserValues] = useState<userValue[]>([])

    const removeDuplicates = (arr: Array<{ date: string; value: number }>): Array<{ date: string; value: number }> => {
        const uniqueDates: Set<string> = new Set();
        return arr.filter(item => {
            const isDuplicate = uniqueDates.has(item.date);
            uniqueDates.add(item.date);
            return !isDuplicate;
        });
    };

    const getStocks = async () => {
        if(user_id) {
            const { data, error } = await supabase
            .from('User Value')
            .select('date, value')
            .eq('user_id', user_id);
    
            if (error) {
                console.error('Error fetching data:', error.message);
                return null;
            }
            const deduplicatedData = removeDuplicates(data);
            setUserValues(deduplicatedData)
        }
    }

    useEffect(() => {
        if(user_id) {
            getStocks()
        }
    }, [user_id])

    return(
        <div className='flex flex-col md:flex-row'>
            <div className="rounded-lg bg-[#202C2D] flex flex-col p-5 m-2 flex-grow max-w-1/2 mt-16 md:mt-2">
                <div className='font-bold'>
                    <h1 className=''>
                        User value:
                    </h1>
                    <div className='flex'>
                        <h1 className='text-3xl'>
                            $
                        </h1>
                        <h1 className='text-3xl '>
                            {value}
                        </h1>
                    </div>
                </div>

                <div>
                    {userValues && <PortfolioChart stockData={userValues}/>}
                </div>
            </div>

            <div className='p-5 rounded-lg bg-[#202C2D] m-2 flex-grow'>
                <div>
                    {/* {session?.user.email} */}email
                </div>

                <div>
                    Available Balance:
                    <div className='font-bold text-2xl'>
                        ${balance.toFixed(2)}
                    </div>
                </div>

                <div>
                </div>
            </div>
        </div>
    )
}