// import { useState }  from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import Balance from './Balance'
import Data from './Data'
import { BalanceProvider } from './BalanceProvider'
import axios from 'axios'

export default async function dashboard() {

    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    // https://www.alphavantage.co/ STOCK API
    // 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo'
    // https://site.financialmodelingprep.com/developer/docs

    return(
        <BalanceProvider>
        <div className="flex bg-[#1B2627] w-screen h-screen text-white">
            <div className='hidden lg:flex flex-col p-3 '>
                <div className='pb-5 font-bold text-2xl'>
                    Virtual Stock Market
                </div>
                <div className='text-xl w-full py-3'>
                    Dashboard
                </div>
            </div>

            <div className='flex-1 p-3 flex flex-col'>
                <div className='flex flex-col md:flex-row'>
                    <div className='rounded-lg bg-[#202C2D] flex p-5 flex-col m-2 flex-grow'>
                        <div className='flex'>
                            Value:
                        </div>
                        <div className='font-bold text-2xl'>
                            $<Balance/>
                        </div>
                        <div>
                            {/* cjhart */}
                        </div>
                    </div>

                    <div className='p-5 rounded-lg bg-[#202C2D] m-2 flex-grow'>
                        <div>
                            {session?.user.email}
                        </div>

                        <div>
                            Total Balance:
                            <div className='font-bold text-2xl'>
                                $<Balance/>
                            </div>
                        </div>

                        <div>
                            <form action="/auth/signout" method="post">
                                <button className="button block bg-[#B2F35F] hover:bg-[#8ec24c] text-black py-2 px-4 rounded-lg my-2 font-semibold" type="submit">
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <Data/>
            </div>
        </div>
    </BalanceProvider>
    )
}