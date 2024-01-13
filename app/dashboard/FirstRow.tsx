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
    const [imageUrl, setImageUrl] = useState<string>("")

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(user) {
            getStocks(user.id)
            getImage(user.id)
        }
    }

    const getStocks = async (user_id:string) => {
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

    const getImage = async (id:string) => {
        const { data, error } = await supabase.storage.from('profile').list(id + '/', {
            limit: 10,
            offset: 0, 
            sortBy: {
                column: 'name', order: 'asc'
            }
        })

        if(data) {
            if(data[0].name === ".emptyFolderPlaceholder") {
                setImageUrl(data[1].name)
            } else{
                setImageUrl(data[0].name)
            }
        } else {
            console.log(error)
        }
    }

    const removeDuplicates = (arr: Array<{ date: string; value: number }>): Array<{ date: string; value: number }> => {
        const uniqueDates: Set<string> = new Set();
        return arr.filter(item => {
            const isDuplicate = uniqueDates.has(item.date);
            uniqueDates.add(item.date);
            return !isDuplicate;
        });
    };

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
                <div className='flex'>
                    {imageUrl ? 
                    <div className="avatar">
                        <div className="w-14 rounded-full ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={`https://yiunghnvgmuatnrhjxla.supabase.co/storage/v1/object/public/profile/fccdde01-93e6-49af-b73a-ac5ee63c4610/${imageUrl}`} />
                        </div>
                    </div>
                    :
                    <div className="avatar placeholder">
                        <div className="bg-primary text-neutral-content rounded-full w-14 ring-primary ring-offset-base-100 ring-offset-2">
                            <span className="text-3xl">D</span>
                        </div>
                    </div> 
                    }
                    <div className='my-auto mx-3'>
                        email
                    </div>
                    {/* {session?.user.email} */}
                </div>

                <div>
                    Available Balance:
                    <div className='font-bold text-3xl'>
                        ${balance.toFixed(2)}
                    </div>
                </div>

                <div>
                </div>
            </div>
        </div>
    )
}