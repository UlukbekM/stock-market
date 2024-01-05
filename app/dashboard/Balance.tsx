"use client"
// import { useBalance } from './BalanceProvider';
import type { RootState } from '../GlobalRedux/store';
import {useSelector } from 'react-redux/es/exports';
// import { useDispatch, useSelector } from 'react-redux/es/exports';
// import { increment, decrement, incrementByAmount } from '../GlobalRedux/Features/counter/counterSlice';

export default function Value () {
    // const { balance } = useBalance();
    const balance = useSelector((state:RootState) => state.counter.balance)
    // const dispatch = useDispatch()

    return(<>
        {/* <button className='px-2 border rounded-lg my-auto mx-2' onClick={()=>dispatch(increment())}>Increment</button>
        <button className='px-2 border rounded-lg my-auto mx-2'  onClick={()=>dispatch(decrement())}>Decrement</button>
        <button className='px-2 border rounded-lg my-auto mx-2'  onClick={()=>dispatch(incrementByAmount(2))}>Increment by 2</button> */}
        {balance}
    </>)
}