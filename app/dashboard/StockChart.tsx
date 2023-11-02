// import React, { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import { format, parseISO } from 'date-fns';
// import 'chartjs-adapter-date-fns';
// import { enUS } from 'date-fns/locale';

// interface StockData {
//     open: string;
//     high: string;
//     low: string;
//     close: string;
//     volume: string;
//     [key: string]: string;
// }

// interface StockDataByTimestamp {
//     [timestamp: string]: StockData;
// }

// interface StockChartProps {
//     data: StockDataByTimestamp;
// }

// const StockChart: React.FC<StockChartProps> = ({ data }) => {
//     const chartContainerRef = useRef<HTMLDivElement>(null);
//     const chartRef = useRef<HTMLCanvasElement>(null);
//     const chartInstance = useRef<Chart | null>(null);

//     useEffect(() => {
//         if (chartInstance.current) {
//             chartInstance.current.destroy();
//         }

//         if (chartRef.current && chartContainerRef.current) {
//             const timestamps: string[] = Object.keys(data);
//             const closePrices: number[] = timestamps.map((timestamp) => parseFloat(data[timestamp]["4. close"]));
//             // const formattedTimestamps: string[] = timestamps.map((timestamp) =>
//             //     format(parseISO(timestamp), 'yyyy-MM-dd HH:mm:ss')
//             // );
//             // console.log(timestamps)
//             const formattedTimestamps: string[] = timestamps.map((timestamp) =>
//                 format(parseISO(timestamp), 'MMM dd', { locale: enUS })
//             );

//             const ctx = chartRef.current.getContext('2d');
//             if (ctx) {
//                 chartInstance.current = new Chart(ctx, {
//                     type: 'line',
//                     data: {
//                         labels: formattedTimestamps,
//                         datasets: [{
//                             label: 'Close Price USD',
//                             data: closePrices,
//                             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                             borderColor: 'rgba(75, 192, 192, 1)',
//                             borderWidth: 1
//                         }]
//                     },
//                     options: {
//                         scales: {
//                             x: {
//                                 type: 'time',
//                                 time: {
//                                     parser: 'MMM dd',
//                                     tooltipFormat: 'MMM dd',
//                                     unit: 'hour',
//                                     displayFormats: {
//                                         hour: 'MMM dd'
//                                     }
//                                 },
//                                 adapters: {
//                                     date: {
//                                         locale: enUS
//                                     }
//                                 }
//                             },
//                             y: {
//                                 beginAtZero: false
//                             }
//                         },
//                         maintainAspectRatio: false,
//                         responsive: true,
//                     }
//                 });
//             }
//         }
//     }, [data]);

//     return (
//         <div ref={chartContainerRef} className="max-w-full overflow-x-auto h-80">
//             <canvas ref={chartRef} id="myChart"></canvas>
//         </div>
//     );
// };

// export default StockChart;

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
            <canvas ref={chartRef} id="myChart"></canvas>
        </div>
    );
};

export default StockChart;
