"use client"
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface BalanceContextProps {
    children: ReactNode;
}

interface BalanceContextType {
    user_id: string;
    balance: number;
    stock: string,
    updateUserId: (newUserId: string) => void;
    updateBalance: (newBalance: number) => void;
    updateStock: (newStock: string) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<BalanceContextProps> = ({ children }) => {
    const [user_id, setUserId] = useState<string>(''); // Initial user_id value

    const [balance, setBalance] = useState<number>(-1);

    const [stock, setStock] = useState<string>('');

    const updateUserId = (newUserId: string) => {
        setUserId(newUserId);
    };

    const updateBalance = (newBalance: number) => {
        setBalance(newBalance);
    };

    const updateStock = (newStock: string) => {
        setStock(newStock);
    };

    return (
        <BalanceContext.Provider value={{ user_id, balance, stock, updateUserId, updateBalance, updateStock }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const useBalance = (): BalanceContextType => {
    const context = useContext(BalanceContext);

    if (!context) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }

    return context;
};
