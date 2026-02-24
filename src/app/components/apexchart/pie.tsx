/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'

type Props = {
    className : string
    name ?:any
    data ?:any
}

const PieChart: React.FC<Props> = ({className , name , data}) => {
    const chartRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!chartRef.current) {
            return
        }

        const height = parseInt(getCSS(chartRef.current, 'height'))

        const chart = new ApexCharts(chartRef.current, getChartOptions(height, data))
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
        <div >

            {/* begin::Body */}
            <div className='card-body'>
                {/* begin::Chart */}
                <div ref={chartRef} id={data.apex_chart_id} style={{height: '350px'}}></div>
                {/* end::Chart */}
            </div>
            {/* end::Body */}
        </div>
    )
}

export {PieChart}

function getChartOptions(height: number , data : any): ApexOptions {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')

    const baseLightColor = getCSSVariableValue('--bs-light-success')
    const secondaryLightColor = getCSSVariableValue('--bs-light-warning')

    return {
        series: data.values,
        labels: data.labels,
        chart: {
            fontFamily: 'inherit',
            type: 'donut',
            height: 350,
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
        plotOptions: {},
        legend: {
            show: true,
        },
        dataLabels: {
            enabled: true,
        },
        fill: {
            type: 'solid',
            opacity: 1,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors:  '#000000',
                    fontSize: '12px',
                },
            },
            crosshairs: {
                position: 'front',
                stroke: {
                    color:  '#000000',
                    width: 1,
                    dashArray: 3,
                },
            },
            tooltip: {
                enabled: true,
                formatter: undefined,
                offsetY: 0,
                style: {
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors:  '#000000',
                    fontSize: '12px',
                },
            },
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
        colors: data.colors,
        grid: {
            borderColor:  '#000000',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
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
        markers: {
            colors: [baseLightColor, secondaryLightColor],
            strokeColors: [baseLightColor, secondaryLightColor],
            strokeWidth: 3,
        },
    }
}
