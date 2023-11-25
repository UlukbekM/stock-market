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

        if (chartContainerRef.current && stockData && symbolAndPricesData) {
            const aggregatedData: Map<string, number> = new Map();

            stockData.forEach(item => {
                const stockPriceInfo = symbolAndPricesData.find(data => data.symbol === item.symbol);
                if (stockPriceInfo && item.amount !== null && stockPriceInfo.price !== null) {
                    const stockValue = item.amount * stockPriceInfo.price;
                    if (aggregatedData.has(item.symbol)) {
                        aggregatedData.set(item.symbol, aggregatedData.get(item.symbol)! + stockValue);
                    } else {
                        aggregatedData.set(item.symbol, stockValue);
                    }
                }
            });

            const labels: string[] = Array.from(aggregatedData.keys());
            const data: number[] = Array.from(aggregatedData.values());

            const ctx = chartContainerRef.current.getContext('2d');
            if (ctx) {
                mutableChartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels,
                        datasets: [{
                            data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                            ],
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
        )
};

export default StockPieChart;
