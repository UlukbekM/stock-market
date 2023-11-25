
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface StockItem {
    v: number; // volume
    vw: number; // volume-weighted average price
    o: number; // open price
    c: number; // close price
    h: number; // high price
    // Add other properties if necessary
}

interface StockChartProps {
    stockData: StockItem[] | null;
    dates: string[];
}

const StockChart: React.FC<StockChartProps> = ({stockData, dates }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current && chartContainerRef.current && stockData) {
            // const closePrices: number[] = stockData.map((dataPoint) => dataPoint.c);
            const closePrices: number[] = stockData.map((item: StockItem) => item.c);
            const reversedDates = [...dates].reverse();

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Close Price USD',
                            data: closePrices,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category', // Using category scale for dates
                                labels: reversedDates,
                            },
                            y: {
                                beginAtZero: false
                            }
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                    }
                });
            }
        }
    }, [stockData, dates]);

    return (
        <div ref={chartContainerRef} className="max-w-full overflow-x-auto h-80">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default StockChart;
