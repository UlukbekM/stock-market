import Link from "next/link"
// https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts
// https://dribbble.com/shots/18972760-Web-Site-for-Finance-Dashboard
import { FaGithub } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";


export default function Index() {

    return (
        <div className="">
            <div className="text-white p-2 flex lg:justify-between items-center">
                <div className="m-auto text-center basis-1/3">
                    <h1 className="text-2xl font-bold">Virtual Stock Market</h1>
                </div>
                <div className="basis-1/3 hidden lg:block">
                </div>
                <div className="m-auto flex basis-1/3 justify-center">
                    <Link href={"register"} className="py-2 px-4 mx-2 hover:bg-gray-900 rounded-lg font-medium">Register</Link>
                    <Link href={"login"}  className="py-2 px-4 mx-2 hover:bg-gray-900 rounded-lg font-medium" data-modal-target="defaultModal" data-modal-toggle="defaultModal" type="button">Login</Link>
                </div>
            </div>

            <div className="flex flex-col text-center my-5 justify-center items-center">
                <h1 className="text-5xl font-bold my-2 tracking-wide text-white">Stock Market Simulator</h1>
                <h1 className="text-3xl font-bold my-2 text-primary">Trade stocks with virtual currency</h1>
                <Link href={"register"} className=" my-8 lg:w-1/6 group">
                    <button className="btn w-full btn-primary font-semibold">Open an account
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        <FaArrowRight className="text-lg"/>
                    </span>
                    </button>
                </Link>
            </div>

            <div className="flex justify-center w-full">
                <div className="mockup-browser border bg-base-300 w-full md:w-5/6 rounded-b-none shadow-lg">
                    <div className="mockup-browser-toolbar">
                        <div className="md:input">https://VIRTUALSTOCKMARKET.com</div>
                    </div>
                    <div className="flex justify-center bg-base-200">
                        <img src="https://i.imgur.com/V5k9XxQ.png" alt="" className="w-full"/>
                    </div>
                </div>
            </div>

            <div className="bg-white flex text-black flex-col lg:flex-row">
                <div className="flex flex-col basis-1/2 justify-center m-10">
                    <h1 className="text-3xl font-bold my-2">
                        Start with a virtual $1,000 to start paper trading
                    </h1>
                    <p className="text-xl my-2">
                        No deposit needed. Practice trading stocks with virtual money to sharpen your knowledge of how the stock market works and how to use an online brokerage.
                    </p>
                </div>
                <div className="basis-1/2 flex w-auto justify-center">
                    <img src="https://cdn.dribbble.com/users/3016594/screenshots/18885113/media/2602e40302131bb47cace91ff0c0ec81.jpg" alt="chart-image" className="w-3/4"/>
                </div>
            </div>

            <div className="bg-secondary text-white flex flex-col lg:flex-row">
                <div className="flex flex-col basis-1/2 justify-center m-10">
                    <h1 className="text-3xl font-bold my-2">Search Stocks</h1>
                    <p className="text-xl my-2">
                        On the Virtual Stock Market, users can effortlessly search for and purchase stocks, simplifying the investing process. 
                        As they make purchases, users can gradually build their portfolios, diversifying their investments to align with their financial objectives.
                    </p>
                </div>
                <div className="basis-1/2 flex w-auto justify-center m-10">
                    <img src="https://i.imgur.com/1dCtHE1.png" alt="search-stocks" className="w-full " />
                </div>
            </div>

            <div className="bg-secondary text-white flex flex-col lg:flex-row">
                <div className="flex flex-col basis-1/2 justify-center m-10">
                    <h1 className="text-3xl font-bold my-2">Reset your account at any time</h1>
                    <p className="text-xl my-2">
                        Restart your virtual trading journey at any time with just a click. 
                        Reset your portfolio effortlessly to refine your strategies and explore new investment approaches in a risk-free environment.
                    </p>
                </div>
                <div className="basis-1/2 flex w-auto justify-center m-10">
                    <img src="https://i.imgur.com/1dCtHE1.png" alt="search-stocks" className="w-full " />
                </div>
            </div>

            <div className="bg-white text-black flex justify-center">
                <div className="flex basis-1/2 justify-center m-10 flex-col items-center text-center">
                    <h1 className="text-3xl font-bold my-2">Practice Trading Without The Risk</h1>
                    <p>Simulated trading can help all levels of traders to practice their trading skills and strategies.</p>
                    <Link href={"register"} className=" my-8 lg:w-1/2 group">
                        <button className="btn w-full btn-primary font-semibold">Open an account
                            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                <FaArrowRight className="text-lg"/>
                            </span>
                        </button>
                    </Link>
                </div>
            </div>


            {/* <footer className="footer p-10 bg-background text-white">
                <aside>
                    <FaChartLine className="text-5xl"/>
                    <p>Made with Next.js, TypeScript, Tailwind CSS, Supabase</p>
                </aside> 
                <nav>
                    <h6 className="footer-title">Social</h6> 
                    <div className="grid grid-flow-col gap-4">
                    <FaGithub className="text-2xl"/>
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
                    </div>
                </nav>
            </footer> */}
            <footer className="footer footer-center p-10 bg-background text-base-content rounded">
                <nav className="grid grid-flow-col gap-4">
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav> 
                <nav>
                    <div className="grid grid-flow-col gap-4">
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
                    <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
                    </div>
                </nav> 
                <aside>
                    <p>Copyright © 2024 - All right reserved by ACME Industries Ltd</p>
                </aside>
            </footer>


        </div>
    )
}
