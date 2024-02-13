"use client"
import Link from "next/link"
import { FaArrowLeft, FaExclamation } from "react-icons/fa6";
import { useSearchParams } from 'next/navigation'
import { useEffect } from "react";
import { FaCircleExclamation } from "react-icons/fa6";

// https://www.youtube.com/watch?v=-7K6DRWfEGM
// https://supabase.com/docs/guides/auth/auth-helpers/nextjs
// https://supabase.com/docs/guides/auth/auth-helpers/nextjs?utm_source=youtube&utm_medium=social&utm_campaign=nextjs-supabase&language=ts

export default function register() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error')

    return(
        <div className="flex justify-center items-center min-h-screen w-screen">
            <div className="flex drop-shadow-2xl">
                {/* <div className="bg-white p-8 rounded-l border border-gray-300 shadow-md w-screen min-h-screen lg:min-h-full lg:h-auto lg:w-1/4 text-black lg:basis-1/2 justify-center flex flex-col"> */}
                <div className="bg-white p-8 rounded-l border border-gray-300 shadow-md w-screen min-h-screen lg:min-h-full lg:h-auto lg:w-80 text-black lg:basis-1/2 justify-center flex flex-col">
                    <Link href={"/"} className=" hover:text-gray-600 focus:outline-none my-6 flex">
                        <FaArrowLeft className="my-auto mx-2"/> Back
                    </Link>
                    <h2 className="text-3xl font-semibold mb-8">Login</h2>
                    <form action="/auth/login" method="post">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" id="email" name="email"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input type="password" id="password" name="password"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                required />
                        </div>
                        {error && (
                            <div className={`my-2 text-red-500 flex`}>
                                <FaCircleExclamation className="my-auto mr-2"/>
                                <p> An error occurred: {error}</p>
                            </div>
                        )}
                        <button type="submit"
                            className="w-full bg-[#B2F35F] font-semibold text-black p-2 rounded hover:bg-[#B2F35F] focus:outline-none focus:ring focus:border-blue-300">
                            Login
                        </button>
                    </form>
                    <p className="text-sm font-light text-black pt-4 text-center">
                        Don't have an account? <Link href="register" className="font-medium text-primary-600 hover:underline dark:text-primary-500 mx-1">Sign Up</Link>
                    </p>
                </div>
                <div className="basis-1/2 hidden lg:block">
                    <img src="https://cdn.dribbble.com/userupload/5955855/file/original-88f688574d8bf89c226175d365ebee4b.jpeg?resize=752x944" alt="" className=" rounded-r"/>
                </div>
            </div>
        </div>
        
    )
}