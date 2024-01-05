import ThirdRow from './ThirdRow'
import SecondRow from './SecondRow'
import FirstRow from './FirstRow'
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";

export default async function Dashboard() {
    return(
    <div className="flex bg-[#1B2627] w-full text-white h-full">
        <div className='hidden lg:flex flex-col p-3 justify-between h-screen sticky top-0'>
            <div>
                <div className='pb-5 font-bold text-2xl'>
                    Virtual Stock Market
                </div>
                <div className='text-xl px-4 py-2 flex cursor-pointer hover:bg-gray-200 hover:bg-opacity-20 rounded-xl'>
                    <FaChartColumn className='my-auto mx-3'/>Dashboard
                </div>
            </div>

            <div className='my-3 text-xl text-[#B2B6B6] font-semibold'>
                <div className='flex py-2 px-4 cursor-pointer hover:bg-gray-200 hover:bg-opacity-20 rounded-xl'>
                    <FaGear className='my-auto mx-3'/>Settings
                </div>
                <form action="/auth/signout" method="post" className=''>
                    <button className="flex py-2 px-4 button w-full hover:bg-gray-200 hover:bg-opacity-20 rounded-xl" type="submit">
                        <FaArrowRightFromBracket className='my-auto mx-3'/> Sign out
                    </button>
                </form>
            </div>
        </div>

        <div className='flex-1 p-3 flex flex-col'>
            <FirstRow/>
            <SecondRow/>
            <ThirdRow/>
        </div>
    </div>
)
}
