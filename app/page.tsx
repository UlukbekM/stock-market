import Link from "next/link"
// https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts
// https://dribbble.com/shots/18972760-Web-Site-for-Finance-Dashboard
import { FaGithub } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaCode } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa6";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FaArrowsRotate } from "react-icons/fa6";


export default function Index() {

    return (
        <div className="">
            <div className="text-white p-2 flex lg:justify-between items-center">
                <div className="m-auto text-center basis-2/3 lg:basis-1/3">
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
                        <div className="md:input">https://virtualstockmarket.vercel.app/dashboard</div>
                    </div>
                    <div className="flex justify-center bg-base-200">
                        <img src="https://i.imgur.com/zEBj1Dp.png" alt="" className="w-full"/>
                    </div>
                </div>
            </div>

            <div className="flex bg-white flex-col md:flex-row">
                <div className="basis-1/2 text-black p-10 text-lg flex place-items-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>
                <div className="basis-1/2 p-10">
                    <img src="https://i.imgur.com/JjdI2zW.png" className=" rounded-lg"/>
                </div>
            </div>

            <div className="bg-background flex flex-col mt-10">
                <div className="text-center my-5 font-bold tracking-wider text-white">
                    <h1 className="text-4xl mx-4">Practice Trading Without The Risk</h1>
                </div>
                <div className="flex flex-col md:flex-row m-5 md:m-0 md:mx-10 md:my-5">
                    <div className="flex flex-col basis-1/3 mb-4 lg:mb-0 mx-2 p-4 rounded-lg border-2 border-[#495152]">
                        <div className="my-2 flex font-bold justify-between">
                            <h1 className="text-xl text-white">Start with a virtual $10,000 to start paper trading</h1>
                            <FaMoneyBill1Wave className="text-2xl text-primary my-auto"/>
                        </div>
                        <div className="my-2 text-gray-400 text-md">
                            No deposit needed. Practice trading stocks with virtual money to sharpen your knowledge of how the stock market works and how to use an online brokerage.
                        </div>
                    </div>

                    <div className="flex flex-col basis-1/3 mb-4 lg:mb-0 mx-2 p-4 rounded-lg border-2 border-[#495152]">
                        <div className="my-2 flex font-bold justify-between">
                            <h1 className="text-xl text-white">Search Stocks</h1>
                            <FaChartLine className="text-2xl text-primary my-auto"/>
                        </div>
                        <div className="my-2 text-gray-400 text-md">
                            On the Virtual Stock Market, users can effortlessly search for and purchase stocks, simplifying the investing process. 
                            As they make purchases, users can gradually build their portfolios, diversifying their investments to align with their financial objectives.
                        </div>
                    </div>

                    <div className="flex flex-col basis-1/3 mb-4 lg:mb-0 mx-2 p-4 rounded-lg border-2 border-[#495152]">
                        <div className="my-2 flex font-bold justify-between">
                            <h1 className="text-xl text-white">Reset your account at any time</h1>
                            <FaArrowsRotate className="text-2xl text-primary my-auto"/>
                        </div>
                        <div className="my-2 text-gray-400 text-md">
                            Restart your virtual trading journey at any time with just a click. 
                            Reset your portfolio effortlessly to refine your strategies and explore new investment approaches in a risk-free environment.
                        </div>
                    </div>
                </div>

                <div className="flex justify-center my-5">
                    <div className="bg-white p-5 rounded-lg text-black w-1/2 flex flex-col items-center">
                        <h1 className="text-3xl font-bold my-3">Practice Trading Without The Risk</h1>
                        <p className="m-3 text-md">Simulated trading can help all levels of traders to practice their trading skills and strategies.</p>
                        <Link href={"register"} className="flex m-5 w-1/2 group">
                            <button className="btn w-full btn-primary font-semibold">Open an account
                                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                    <FaArrowRight className="text-lg"/>
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* <div className="bg-white flex text-black flex-col lg:flex-row h-[450px]">
                <div className="flex flex-col basis-1/2 justify-center m-10">
                    <h1 className="text-3xl font-bold my-2">
                        Start with a virtual $1,000 to start paper trading
                    </h1>
                    <p className="text-xl my-2">
                        No deposit needed. Practice trading stocks with virtual money to sharpen your knowledge of how the stock market works and how to use an online brokerage.
                    </p>
                </div>
                <div className="basis-1/2 flex w-auto justify-center">
                    <img src="https://cdn.dribbble.com/users/3016594/screenshots/18885113/media/2602e40302131bb47cace91ff0c0ec81.jpg" alt="chart-image" className=""/>
                </div>
            </div>

            <div className="bg-secondary text-white flex flex-col lg:flex-row h-[450px]">
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

            <div className="bg-secondary text-white flex flex-col lg:flex-row h-[450px]">
                <div className="flex flex-col basis-1/2 justify-center m-10">
                    <h1 className="text-3xl font-bold my-2">Reset your account at any time</h1>
                    <p className="text-xl my-2">
                        Restart your virtual trading journey at any time with just a click. 
                        Reset your portfolio effortlessly to refine your strategies and explore new investment approaches in a risk-free environment.
                    </p>
                </div>
                <div className="basis-1/2 flex w-auto justify-center m-10">
                    <img src="https://i.imgur.com/COHOabH.jpeg" alt="search-stocks" className="w-auto rounded-md " />
                </div>
            </div>

            <div className="bg-white text-black flex justify-center h-[450px]">
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
            </div> */}



            <footer className="footer footer-center p-10 bg-background text-base-content rounded">
                <nav className="grid grid-flow-col gap-4">
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav> 
                <nav>
                    <div className="grid grid-flow-col gap-4">
                        <Link href={"https://github.com/UlukbekM"} rel="noopener noreferrer" target="_blank" className="hover:text-primary">
                            <FaGithub className="text-2xl"/>
                        </Link>
                        <Link href={"https://www.linkedin.com/in/ulukbekm/"} rel="noopener noreferrer" target="_blank" className="hover:text-primary">
                            <FaLinkedin className="text-2xl"/>
                        </Link>
                        <Link href={"https://www.ulukbekmambetov.com/"} rel="noopener noreferrer" target="_blank" className="hover:text-primary">
                            <FaCode className="text-2xl"/>
                        </Link>
                    </div>
                </nav> 
                <aside>
                    <p>Made with Next.js, TypeScript, Tailwind CSS, Supabase by Ulukbek Mambetov</p>
                </aside>
            </footer>


        </div>
    )
}
