import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the date-fns adapter
import { format } from 'date-fns';

interface ChartData {
    date: string;
    value: number;
}

interface StockChartProps {
    stockData: ChartData[] | null;
}

const StockChart: React.FC<StockChartProps> = ({ stockData }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current && chartContainerRef.current && stockData) {
            const dates = stockData.map((data) => format(new Date(data.date), 'MMM dd'));
            const values = stockData.map((data) => data.value);

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [
                            {
                                label: 'Portfolio Value',
                                data: values,
                                backgroundColor: 'rgba(178, 243, 95, 0.2)',
                                borderColor: 'rgba(178, 243, 95, 1)',
                                borderWidth: 1,
                                fill: {
                                    target: 'origin',
                                    below: 'rgba(178, 243, 95, 0.2)',
                                },
                                
                            },
                        ],
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category',
                                labels: dates,
                                title: {
                                    display: true,
                                    text: 'Date',
                                    color: 'rgba(179, 179, 179, 1)',
                                    font: {
                                        size: 18
                                    }
                                },
                                ticks: {
                                    color: 'rgba(179, 179, 179, 1)',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Portfolio Value ($)',
                                    color: 'rgba(179, 179, 179, 1)',
                                    font: {
                                        size: 18
                                    }
                                },
                                ticks: {
                                    color: 'rgba(179, 179, 179, 1)',
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: false, // Set to false to hide the legend
                            },
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                    },
                });
            }
        }
    }, [stockData]);

    return (
        <div ref={chartContainerRef} className="max-w-full overflow-x-auto h-80">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default StockChart;
