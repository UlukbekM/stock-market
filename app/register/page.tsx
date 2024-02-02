"use client"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa6";

export default function login() {
    return(
        <div className="flex justify-center items-center min-h-screen w-screen">
            <div className="flex drop-shadow-2xl">
                <div className="bg-white p-8 rounded-l border border-gray-300 shadow-md w-screen h-screen lg:h-auto lg:w-1/4 text-black lg:basis-1/2 justify-center flex flex-col">
                    <Link href={"/"} className=" hover:text-gray-600 focus:outline-none my-6 flex">
                        <FaArrowLeft className="my-auto mx-2"/> Back
                    </Link>
                    <h2 className="text-3xl font-semibold mb-8">Sign Up</h2>
                    <form action="/auth/sign-up" method="post">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" id="email" name="email"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-[#B2F35F]"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input type="password" id="password" name="password"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-[#B2F35F]"
                                required />
                        </div>
                        <button type="submit"
                            className="w-full bg-[#B2F35F] font-semibold text-black p-2 rounded hover:bg-[#B2F35F] focus:outline-none focus:ring focus:border-[#B2F35F]">
                            Sign Up
                        </button>
                    </form>
                    {/* {registered && (
                        <div className="">
                        Please check your email for verification instructions.
                        </div>

                        ~~~~~~~~~~~~add check email~~~~~~~~~~

                    )} */}
                    <p className="text-sm font-light text-black pt-4 text-center ">
                        Already have an account?
                        <Link href="login" className="font-medium text-primary-600 hover:underline dark:text-primary-500 mx-1">Log In</Link>
                    </p>
                </div>
                <div className="w-auto basis-1/2 hidden lg:block">
                    <img src="https://cdn.dribbble.com/userupload/5955855/file/original-88f688574d8bf89c226175d365ebee4b.jpeg?resize=752x944" alt="" className="w-auto rounded-r"/>
                </div>
            </div>
        </div>
    )
}