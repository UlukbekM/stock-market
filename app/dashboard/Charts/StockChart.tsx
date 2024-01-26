import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface StockAPI {
    date: string;
    close: number;
}

interface StockChartProps {
    stockData: StockAPI[] | null;
    dates: string[];
}

const StockChart: React.FC<StockChartProps> = ({ stockData, dates }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    function convertToFormattedDates(dates: string[]): string[] {
        return dates.map((dateString) => {
            if(dateString.length > 10) {
                const dateObject = new Date(dateString);
                return format(dateObject, 'HH:mm', { locale: enUS });
            } else {
                const dateObject = new Date(`${dateString}T12:00:00`);
                return format(dateObject, 'MMM dd', { locale: enUS });
            }
        });
    }

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current && chartContainerRef.current && stockData) {
            const closePrices: number[] = stockData.map((item: StockAPI) => item.close);

            const formattedDates = convertToFormattedDates(dates);

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: formattedDates,
                        datasets: [{
                            label: 'Close Price USD',
                            data: closePrices,
                            backgroundColor: 'rgba(178, 243, 95, 0.2)',
                            borderColor: 'rgba(178, 243, 95, 1)',
                            borderWidth: 1,
                            fill: {
                                target: 'origin',
                                below: 'rgba(178, 243, 95, 0.2)'
                            }
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category',
                                labels: formattedDates,
                                title: {
                                    display: true,
                                    text: 'Date',
                                    color: 'rgba(179, 179, 179, 1)',
                                    font: {
                                        size: 18
                                    }
                                },
                                ticks: {
                                    color: 'rgba(179, 179, 179, 1)'
                                },
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'Price ($)',
                                    color: 'rgba(179, 179, 179, 1)',
                                    font: {
                                        size: 18
                                    }
                                },
                                ticks: {
                                    color: 'rgba(179, 179, 179, 1)'
                                },
                            }
                        },
                        plugins: {
                            legend: {
                                display: false, // Set to false to hide the legend
                            },
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                    }
                });
            }
        }
    }, [stockData, dates]);

    return (
        <div ref={chartContainerRef} className="max-w-full overflow-x-auto h-80 my-2">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default StockChart;
