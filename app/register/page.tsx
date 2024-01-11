"use client"
import Link from "next/link"

export default function login() {
    return(
        <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-green-300 via-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded border border-gray-300 shadow-md lg:w-1/4 text-black">
                <Link href={"/"} className=" hover:text-gray-600 focus:outline-none my-6">
                    Back
                </Link>
                <h2 className="text-3xl font-semibold mb-8">Sign Up</h2>
                <form action="/auth/sign-up" method="post">
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
                    <button type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                        Sign Up
                    </button>
                </form>
                {/* {registered && (
                    <div className="">
                    Please check your email for verification instructions.
                    </div>

                    ~~~~~~~~~~~~add check email~~~~~~~~~~

                )} */}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 pt-4 text-center">
                    Already have an account? <Link href="login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log In</Link>
                </p>
            </div>
        </div>
    )
}