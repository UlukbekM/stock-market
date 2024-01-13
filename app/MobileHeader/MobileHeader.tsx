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

    return(
    <div className="md:hidden">
        <div className="fixed top-0 left-0 w-full z-50 bg-secondary">
            <div className="flex w-full flex-row px-2 my-4">
            <button className="h-8 w-8 text-xl" onClick={onToggleNav}>
                <FaBars className="m-auto" />
            </button>

            <div className='font-bold text-2xl text-center w-full'>
                Virtual Stock Market
            </div>
            </div>
        </div>

        <div className={`fixed top-0 left-0 z-50 h-full w-full transform opacity-95 duration-300 ease-in-out bg-secondary translate-x-0 ${
            sideNav ? 'translate-x-0' : '-translate-x-full'
        }`}>
            <div className="flex w-full flex-row px-2 my-4">
            <button className="h-8 w-8 text-xl" onClick={onToggleNav}>
                <FaBars className="m-auto" />
            </button>

            <div className='font-bold text-2xl text-center w-full'>
                Virtual Stock Market
            </div>
            </div>

            <nav className="fixed flex flex-col h-full w-full">
            <div className="px-12 py-4">
                <Link href="/dashboard" className="text-2xl font-bold tracking-widest flex" onClick={onToggleNav}>
                <FaChartColumn className='my-auto mx-3' />Dashboard
                </Link>
            </div>

            <div className="">
                <div className="px-12 py-4">
                <Link href="/settings" className="text-2xl font-bold tracking-widest flex" onClick={onToggleNav}>
                    <FaGear className='my-auto mx-3' />Settings
                </Link>
                </div>

                <form action="/auth/signout" method="post" className='px-12 py-4'>
                <button className="flex button text-2xl font-bold tracking-widest" type="submit" onClick={onToggleNav}>
                    <FaArrowRightFromBracket className='my-auto mx-3' /> Sign out
                </button>
                </form>
            </div>
            </nav>
        </div>
    </div>

    )
}