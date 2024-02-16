"use client"
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from '../GlobalRedux/store';
import { useEffect, useState } from 'react';

export default function TransactionAlert() {
    const transaction = useSelector((state: RootState) => state.counter.transaction);
    const [alert, setAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (transaction !== "") {
            setMessage(transaction);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
        }
    }, [transaction]);

    return (
        <div className="fixed bottom-0 left-0 right-0 mx-2 my-2 md:w-auto md:right-auto">
            {alert && (
                <div role="alert" className="alert alert-success bg-primary p-3 rounded w-full flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base ml-2">{message}</span>
                </div>
            )}
        </div>
    );
}
