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
import { FaChartPie } from "react-icons/fa6";
import { motion } from "framer-motion"
import FramerImage from "./framerimage";


export default function Index() {

    return (
        <div className="bg-background">
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
                <FramerImage/>
            </div>

            <div className="flex bg-white flex-col md:flex-row">
                <div className="basis-1/2 text-black p-10 flex place-items-center flex-col justify-center">
                    <h1 className="text-4xl my-4 font-bold tracking-wider  text-center">Perfect Your Trading</h1>
                    <p className="text-2xl text-justify">
                        Simulated trading, often referred to as paper trading, enables individuals to trade using virtual funds, allowing for the practice of buying and selling securities without any financial risk. 
                        It closely mimics real trading conditions, providing a safe environment to hone trading skills.
                    </p>
                </div>
                <div className="basis-1/2 p-10 flex items-center">
                    <img src="https://i.imgur.com/JjdI2zW.png" className=" rounded-lg"/>
                </div>
            </div>
            

            <div className="bg-background flex flex-col">
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
                    <div className="bg-[#e6e6e6] p-5 rounded-lg text-black lg:w-1/2 flex flex-col items-center text-center">
                        <h1 className="text-3xl font-bold my-3">Start sharpening your trading skillss</h1>
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



            {/* <footer className="footer footer-center p-10 bg-background text-base-content rounded">
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
                    <p>Made with Next.js, TypeScript, Tailwind CSS, and Supabase by Ulukbek Mambetov</p>
                </aside>
            </footer> */}

            <footer className="footer p-10 bg-background text-base-content">
            <aside className="my-auto">
                {/* <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current"><path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path></svg> */}
                <FaChartPie className="text-5xl"/>
                <p>Made with Next.js, TypeScript, Tailwind CSS, and Supabase by Ulukbek Mambetov</p>
            </aside> 
            <nav className="my-auto">
                <h6 className="footer-title">Links</h6> 
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
            </footer>


        </div>
    )
}
