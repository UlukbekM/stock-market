"use client"

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
    value: number,
    user_id: string | null;
    balance: number;
    stock: string;
    ownStock: boolean;
    transaction: string;
    email: string;
    newValue: boolean;
}

const initialState: CounterState = {
    value: 0,
    user_id: null,
    balance: 0,
    stock: "",
    ownStock: false,
    transaction: "",
    email: "",
    newValue: false
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {state.value += 1},
        decrement: (state) => {state.value -= 1},
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
        setValue: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
        setUserId: (state, action: PayloadAction<string | null>) => {
            state.user_id = action.payload;
        },
        setBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload;
        },
        setStock: (state, action: PayloadAction<string>) => {
            state.stock = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setOwnStock: (state, action: PayloadAction<boolean>) => {
            state.ownStock = action.payload;
        },
        setTransaction: (state, action: PayloadAction<string>) => {
            state.transaction = action.payload;
        },
        setNewValue: (state, action: PayloadAction<boolean>) => {
            state.newValue = action.payload;
        },
    }
})



export const {increment, decrement, incrementByAmount,setUserId,setBalance,setStock,setValue,setOwnStock,setTransaction,setEmail,setNewValue} = counterSlice.actions
export default counterSlice.reducer