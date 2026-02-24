/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'

type Props = {
    className ?: string
    name ?:any
    data ?:any
    horizontal ?: boolean
}

const BarChart: React.FC<Props> = ({className , name , data , horizontal}) => {
    const chartRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!chartRef.current) {
            return
        }

        const height = parseInt(getCSS(chartRef.current, 'height'))

        const chart = new ApexCharts(chartRef.current, getChartOptions(height,data,horizontal))
        if (chart) {
            chart.render()
        }

        return () => {
            if (chart) {
                chart.destroy()
            }
        }
    }, [chartRef])

    return (
        <div className="">


            {/* begin::Body */}
            <div className='card-body'>
                {/* begin::Chart */}
                <div ref={chartRef} id={data.apex_chart_id} style={{height: '350px'}} />
                {/* end::Chart */}
            </div>
            {/* end::Body */}
        </div>
    )
}

export {BarChart}

function getChartOptions(height: number, data: any, horizontal: undefined | boolean): ApexCharts.ApexOptions {


    return {
        series: [
            {
                name: data?.title,
                data: data?.values,

            },

        ],
        chart: {
            fontFamily: 'inherit',
            type: 'bar',
            height: height,
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                },

            },
        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: horizontal ? horizontal : false,
                columnWidth: '60%',
                borderRadius: 5,
            },
        },
        legend: {
            show: true,
        },
        dataLabels: {
            enabled: true,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: data?.labels,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: '#000000',
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#000000',
                    fontSize: '12px',
                },
            },
        },
        fill: {
            opacity: 1,
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
        },
        tooltip: {
            style: {
                fontSize: '12px',
            },
            y: {
                formatter: function (val) {
                    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                },
            },
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],

        title: {
            text: data?.title,
            align: 'center'
        },
        colors: data?.colors,
        grid: {
            borderColor: '#000000',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
    }
}
