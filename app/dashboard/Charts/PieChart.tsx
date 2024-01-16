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
                    // Your existing logic for processing data and creating the pie chart
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
