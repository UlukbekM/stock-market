"use client"
import { useState } from "react"
import Link from "next/link"
import { FaBars } from "react-icons/fa6";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";

export default function MobileHeader () {
    let [sideNav, setSideNav] = useState(false)

    const onToggleNav = () => {
        setSideNav((status) => {
            if (status) {
                document.body.style.overflow = 'auto'
            } else {
                document.body.style.overflow = 'hidden'
            }
            return !status
            })
    }

    const SignOut = () => {
        console.log('clicked')
        const signoutForm = document?.getElementById("signout") as HTMLFormElement | null;
        if (signoutForm) {
            signoutForm.submit();
        }
    }

    return(
    // <div className="md:hidden">
    //     <div className="fixed top-0 left-0 w-full z-50 bg-secondary">
    //         <div className="flex w-full flex-row px-2 my-4">
    //             <div className='font-bold text-2xl text-center w-full'>
    //                 Virtual Stock Market
    //             </div>
    //             <button className="h-8 w-8 text-xl" onClick={onToggleNav}>
    //                 <FaBars className="m-auto" />
    //             </button>
    //         </div>
    //     </div>

    //     <div className={`fixed top-0 left-0 z-10 h-full w-full transform opacity-95 duration-300 ease-in-out bg-secondary translate-x-0 ${
    //         sideNav ? 'translate-x-0' : 'translate-x-full'
    //     }`}>

    //         <nav className="fixed flex flex-col h-full w-full mt-16">
    //         <div className="px-12 py-4">
                // <Link href="/dashboard" className="text-2xl font-bold tracking-widest flex">
                // <FaChartColumn className='my-auto mx-3' />Dashboard
                // </Link>
    //         </div>

    //         <div className="">
    //             <div className="px-12 py-4">
                // <Link href="/settings" className="text-2xl font-bold tracking-widest flex">
                //     <FaGear className='my-auto mx-3' />Settings
                // </Link>
    //             </div>

                // <form action="/auth/signout" method="post" className='px-12 py-4'>
                // <button className="flex button text-2xl font-bold tracking-widest" type="submit">
                //     <FaArrowRightFromBracket className='my-auto mx-3' /> Sign out
                // </button>
                // </form>
    //         </div>
    //         </nav>
    //     </div>
    // </div>

    <div className="drawer fixed top-0 left-0 w-full z-50 bg-secondary lg:hidden flex">

        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content my-auto w-auto mx-4">
            <label htmlFor="my-drawer" className="drawer-button text-xl my-auto">
                <FaBars className="m-auto" />
            </label>
        </div> 
        <div className="flex w-full flex-row my-4">
            <div className='font-bold text-2xl text-center w-full'>
                Virtual Stock Market
            </div>
            {/* <button className="h-8 w-8 text-xl" onClick={onToggleNav}>
                <FaBars className="m-auto" />
            </button> */}
        </div>


        <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <li>
                    <Link href="/dashboard" className="text-2xl font-bold tracking-widest flex">
                        <FaChartColumn className='my-auto mx-3' />Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/settings" className="text-2xl font-bold tracking-widest flex">
                        <FaGear className='my-auto mx-3' />Settings
                    </Link>
                </li>
                <li>
                    <form action="/auth/signout" method="post" className='text-2xl font-bold tracking-widest flex' onClick={SignOut} id="signout">
                        {/* <button className="text-2xl font-bold tracking-widest flex" type="submit"> */}
                            <FaArrowRightFromBracket className='my-auto mx-3' /> Sign out
                        {/* </button> */}
                    </form>
                </li>
            </ul>
        </div>
    </div>

    )
}