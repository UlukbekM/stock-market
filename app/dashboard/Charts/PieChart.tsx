import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface StockItem {
    id: string;
    symbol: string;
    amount: number | null;
    price: number | null;
    user_id: string | null;
}

interface StockPrice {
    symbol: string;
    price: number;
}

interface StockChartProps {
    stockData: StockItem[] | null;
    symbolAndPricesData: StockPrice[] | null;
}

const StockPieChart: React.FC<StockChartProps> = ({ stockData, symbolAndPricesData }) => {
    const chartContainerRef = useRef<HTMLCanvasElement | null>(null);
    let mutableChartInstance: Chart<"pie", number[], string> | null = null;

    useEffect(() => {
        if (mutableChartInstance) {
            mutableChartInstance.destroy();
        }

        if (chartContainerRef.current) {
            const ctx = chartContainerRef.current.getContext('2d');

            if (ctx) {
                if (stockData && symbolAndPricesData && stockData.length > 0 && symbolAndPricesData.length > 0) {
                    const symbols = symbolAndPricesData.map((data) => data.symbol);
                    const prices = symbolAndPricesData.map((data) => data.price * (stockData.find(item => item.symbol === data.symbol)?.amount || 1));

                    mutableChartInstance = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: symbols,
                            datasets: [{
                                data: prices,
                                backgroundColor: [
                                    'rgba(178, 243, 95, 0.7)',
                                    'rgba(84, 214, 127, 0.7)',
                                    'rgba(0, 181, 148, 0.7)',
                                    'rgba(0, 144, 148, 0.7)',
                                    'rgba(0, 107, 126, 0.7)',
                                    'rgba(47, 72, 88, 0.7)'
                                ],
                                borderColor: [
                                    'rgba(178, 243, 95, 1)',
                                    'rgba(84, 214, 127, 1)',
                                    'rgba(0, 181, 148, 1)',
                                    'rgba(0, 144, 148, 1)',
                                    'rgba(0, 107, 126, 1)',
                                    'rgba(47, 72, 88, 1)'
                                ],
                                borderWidth: 1,
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                        }
                    });
                } else {
                    // No data available, create a default whole circle dataset
                    const defaultData = [1]; // Represents a whole circle
                    const defaultColors = ['rgba(128, 128, 128, 0.7)']; // Set a color for the whole circle

                    mutableChartInstance = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['No Data'],
                            datasets: [{
                                data: defaultData,
                                backgroundColor: defaultColors,
                                borderColor: defaultColors,
                                borderWidth: 1,
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                        }
                    });
                }
            }
        }

        return () => {
            if (mutableChartInstance) {
                mutableChartInstance.destroy();
            }
        };
    }, [stockData, symbolAndPricesData]);

    return (
        <div className="max-w-full overflow-x-auto h-80">
            <canvas ref={chartContainerRef} />
        </div>
    );
};

export default StockPieChart;
