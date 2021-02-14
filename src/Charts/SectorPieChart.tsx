import ReactEcharts from "echarts-for-react";
import React from "react";
import PortfolioSheet, {PositionType} from "../Models/PortfolioSheet";
import {nextColor, resetColors} from "../utils/Colors";

var _ = require('lodash');


const SectorPieChart = ({portfolio}: { portfolio: PortfolioSheet }) =>{
    let g1 = (_.groupBy(portfolio.positions, 'supersector'))

    _.forOwn(g1, (value: Array<PositionType>, key: string) => {
        g1[key] = _.groupBy(value, 'sector')
    });

    resetColors()
    let tranform = (data:any, color:number|undefined = undefined) =>{
        if(_.isArray(data)){
            return data.map((row:any)=>{
                let c = nextColor(color);
                return {
                    name: row.name,
                    value: row.value,
                    itemStyle: {
                        color: "#" + c.toString(16)
                    }
                }
            })
        }else {
            const result: any = [];
            _.forOwn(data, (value: Array<PositionType>, key: string) => {
                let c = nextColor(color);
                result.push({
                    name: key,
                    itemStyle: {
                        color: "#" + c.toString(16)
                    },
                    children: tranform(value, c)
                });
            })

            return result;
        }
    }
    const data3 = tranform(g1);

    const option = {
        series: {
            type: 'sunburst',

            data: data3,
            radius: [0, '95%'],
            sort: null,

            emphasis: {
                focus: 'ancestor'
            },

            levels: [{}, {
                r0: '15%',
                r: '35%',
                itemStyle: {
                    borderWidth: 2
                },
                label: {
                    rotate: 'tangential'
                }
            }, {
                r0: '35%',
                r: '70%',
                label: {
                    align: 'right'
                }
            }, {
                r0: '70%',
                r: '72%',
                label: {
                    position: 'outside',
                    padding: 3,
                    silent: false
                },
                itemStyle: {
                    borderWidth: 3
                }
            }]
        }
    };


    return (<ReactEcharts style={{height: '100vh'}} option={option}/>)
}

export default SectorPieChart;