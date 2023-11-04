"use client"
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface BalanceContextProps {
    children: ReactNode;
}

interface BalanceContextType {
    balance: number;
    updateBalance: (newBalance: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<BalanceContextProps> = ({ children }) => {
    const [balance, setBalance] = useState<number>(0);

    const updateBalance = (newBalance: number) => {
        setBalance(newBalance);
    };

    return (
        <BalanceContext.Provider value={{ balance, updateBalance }}>
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
