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
                                'rgba(243, 95, 178, 0.7)',
                                'rgba(178, 243, 95, 0.7)',
                                'rgba(95, 178, 243, 0.7)',
                                'rgba(255, 215, 0, 0.7)'
                                // 'rgba(104, 243, 95, 0.7)',
                                // 'rgba(243, 234, 95, 0.7)',
                                // 'rgba(198, 246, 136, 0.7)',
                                // 'rgba(70, 119, 9, 0.7)',
                                // 'rgba(255,255,255,0.7)'
                            ],
                            borderColor: [
                                'rgba(243, 95, 178, 1)',
                                'rgba(178, 243, 95, 1)',
                                'rgba(95, 178, 243, 1)',
                                'rgba(255, 215, 0, 1)'
                                // 'rgba(104, 243, 95, 1)',
                                // 'rgba(243, 234, 95, 1)',
                                // 'rgba(198, 246, 136, 1)',
                                // 'rgba(70, 119, 9, 1)',
                                // 'rgba(255,255,255,1)'
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
