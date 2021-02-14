import React from "react";
import {PortfolioBook} from "../Models/PortfolioBook";
import ReactEcharts from "echarts-for-react";
import SectorPieChart from "./SectorPieChart";

const DAYS_TO_PLOT = 360;
const theme = 'dark'

const Charts = ({data}: { data: PortfolioBook }) => {

    const {historic, portfolio} = data;

    function getHistoricalPerformance() {
        return {
            xAxis: {
                show: true,
                type: 'time',
                axisLabel: {formatter: '{dd} {MMM} {yy}'}
            },
            yAxis: {
                type: 'value',
                min: Math.round(Math.min.apply(Math, historic.row.map(i => i.value).slice(-DAYS_TO_PLOT)) / 1000) * 1000
            },
            series: [{
                data: historic.row.map(i => [i.date, i.value]).slice(-DAYS_TO_PLOT),
                type: 'line',
                smooth: true,
            }],
            animationEasing: 'elasticOut',

        };
    }



    return (
        <div>
            <ReactEcharts theme={theme} option={getHistoricalPerformance()}/>
            <SectorPieChart portfolio={portfolio}/>
        </div>
    )
}

export default Charts;
