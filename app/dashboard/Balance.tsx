"use client"
import { useBalance } from './BalanceProvider';

export default function Value () {
    const { balance } = useBalance();

    return(<>
        {balance}
    </>)
}