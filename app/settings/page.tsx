import Link from "next/link";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
import MobileHeader from '../MobileHeader/MobileHeader';

export default async function Dashboard() {

    return(
    <div className="flex flex-row bg-[#1B2627] w-full text-white h-full">
        <MobileHeader/>
        <div className='hidden lg:flex flex-col p-2 justify-between h-screen sticky top-0'>
            <div>
                <div className='pb-5 font-bold text-2xl'>
                    Virtual Stock Market
                </div>
                
                <Link href={"dashboard"}>
                    <div className='text-xl px-4 py-2 flex cursor-pointer hover:bg-gray-200 hover:bg-opacity-20 rounded-xl'>
                        <FaChartColumn className='my-auto mx-3'/>Dashboard
                    </div>
                </Link>
            </div>

            <div className='my-3 text-xl text-[#B2B6B6] font-semibold'>
                <div className='flex py-2 px-4 cursor-pointer bg-gray-200 bg-opacity-20 rounded-xl my-1'>
                    <FaGear className='my-auto mx-3'/>Settings
                </div>

                <form action="/auth/signout" method="post" className='my-1'>
                    <button className="flex py-2 px-4 button w-full hover:bg-red-500 hover:bg-opacity-20 rounded-xl" type="submit">
                        <FaArrowRightFromBracket className='my-auto mx-3'/> Sign out
                    </button>
                </form>
            </div>
        </div>


        <div className='flex-1 p-3 flex flex-col bg-secondary  mt-16 md:mt-2'>
            <div>
                hello
            </div>
            <div>
                hello
            </div>
        </div>
    </div>
)
}
