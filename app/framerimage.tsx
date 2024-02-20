"use client"
import { motion } from "framer-motion"


export default function FramerImage() {
    return (
        <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0}}
        className="mockup-browser border bg-base-300 w-full md:w-5/6 rounded-b-none shadow-lg"
        >
            <div className="mockup-browser-toolbar">
                <div className="md:input">https://virtualstockmarket.vercel.app/dashboard</div>
            </div>
            <div className="flex justify-center bg-base-200">
                <img src="https://i.imgur.com/zEBj1Dp.png" alt="" className="w-full"/>
            </div>
        </motion.div>
    )
}
