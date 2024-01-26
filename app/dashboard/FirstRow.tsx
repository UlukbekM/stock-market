"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import checkAndRemoveSavedDate from './TimeCheck';
import PortfolioChart from './Charts/PortfolioChart';

import { useDispatch, useSelector } from 'react-redux/es/exports';
import type { RootState } from '../GlobalRedux/store';
import { setBalance, setNewValue, setStock, setUserId } from '../GlobalRedux/Features/counter/counterSlice';

interface userValue {
    date: string,
    value: number
}

export default function FirstRow () {
    const supabase = createClientComponentClient<Database>()
    const user_id = useSelector((state:RootState) => state.counter.user_id)
    const value = useSelector((state:RootState) => state.counter.value)
    const balance = useSelector((state:RootState) => state.counter.balance)
    const newValue = useSelector((state:RootState) => state.counter.newValue)
    const [userValues,setUserValues] = useState<userValue[]>([])
    const [imageUrl, setImageUrl] = useState<string>("")
    const [username, setUsername] = useState<string>("user")
    const dispatch = useDispatch()

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        console.log('added value')
        if(user_id && newValue) {
            getStocks(user_id)
            dispatch(setNewValue(false))
        }
    }, [newValue])

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if(user) {
            // console.log(user)
            dispatch(setUserId(user.id))
            getStocks(user.id)
            getImage(user.id)
            getUsername(user.id)
        }
    }

    const getUsername = async (id:string) => {
            const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id);
            // console.log(data)
            if(data && data[0].username) {
                setUsername(data[0].username)
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
        const { data, error } = await supabase.storage.from('profile').list(id + '/');

        if(data) {
            // console.log(data)
            if(data[0].name === ".emptyFolderPlaceholder") {
                if(data[1]) {
                    setImageUrl(data[1].name)
                }
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
            <div className="rounded-lg bg-[#202C2D] flex flex-col p-5 m-2 lg:max-w-1/2 mt-16 lg:mt-2 basis-4/5 md:w-full">
                <div className='font-bold'>
                    <h1 className=''>
                        User value:
                    </h1>
                    <div className='flex'>
                        <h1 className='text-3xl'>
                            $
                        </h1>
                        <h1 className='text-3xl tracking-wider'>
                            {value}
                        </h1>
                    </div>
                </div>

                <div>
                    {userValues && <PortfolioChart stockData={userValues}/>}
                </div>
            </div>

            <div className='p-5 rounded-lg bg-[#202C2D] m-2 basis-1/5 md:mt-16 lg:mt-2 flex justify-center flex-col items-center max-w-40'>
                <div className='flex w-full my-3 flex-col items-center'>
                    {imageUrl ? 
                        <div className="avatar basis-1/4 my-3">
                            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE+imageUrl} />
                            </div>
                        </div>
                        :
                        <div className="avatar placeholder basis-1/4 my-3">
                            <div className="bg-primary text-neutral-content rounded-full w-20 ring ring-primary ring-offset-base-100 ring-offset-2">
                                <span className="text-3xl">{username[0]}</span>
                            </div>
                        </div> 
                    }
                    {/* <div className="divider">OR</div> */}
                    <div className='m-3 text-xl divider'>
                        {username}
                    </div>
                    {/* {session?.user.email} */}
                </div>


                <div className='flex items-center flex-col'>
                    Available Balance:
                    <div className='font-bold text-3xl tracking-wider'>
                        ${balance.toFixed(2)}
                    </div>
                </div>

                <div>
                </div>
            </div>
        </div>
    )
}