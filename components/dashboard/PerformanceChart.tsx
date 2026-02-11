"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PerformanceChart() {
    const chartOptions: ApexOptions = {
        chart: {
            height: 280,
            type: 'area',
            fontFamily: 'var(--font-outfit), sans-serif',
            toolbar: { show: false },
            zoom: { enabled: false },
            background: 'transparent'
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#6366f1', '#ec4899'], // Brand Primary and Accent
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            type: 'datetime',
            categories: ["2025-01-01", "2025-01-08", "2025-01-15", "2025-01-22", "2025-01-29", "2025-02-05", "2025-02-12"],
            labels: {
                style: { colors: '#64748b' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: '#64748b' },
                formatter: (value) => { return value + "%" }
            }
        },
        grid: {
            borderColor: 'rgba(255,255,255,0.3)',
            strokeDashArray: 5,
            xaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: 'light',
            x: { format: 'dd MMM yyyy' },
            style: {
                fontSize: '12px',
                fontFamily: 'var(--font-outfit), sans-serif',
            },
            cssClass: 'apexcharts-tooltip-custom'
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -20,
            markers: { size: 6 },
            itemMargin: { horizontal: 10 }
        }
    };

    const chartSeries = [{
        name: 'Alpha 趨勢策略',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'Beta 市場中性',
        data: [11, 32, 45, 32, 34, 52, 41]
    }];

    return (
        <div className="w-full h-80">
            <Chart options={chartOptions} series={chartSeries} type="area" height={280} />
        </div>
    );
}
