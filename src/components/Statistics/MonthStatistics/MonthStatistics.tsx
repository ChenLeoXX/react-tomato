import {Tabs, Tooltip} from 'antd'
import {format} from "date-fns";
import groupBy from 'lodash/groupBy'
import * as React from 'react'
import './MonthStatistics.scss'

const {TabPane} = Tabs;

interface PropsIF {
    finishedTodo: any[]
    finishedTomato: any[]
    year?: number,
    month?: number
}

interface StateIF {
    activeKey: string,
    daysArr: string[]
    pathPoint:string[]
}

export default class MonthStatistics extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            daysArr: [],
            pathPoint:[],
            activeKey: 'tomato'
        }
    }

    componentDidMount() {
        this.getMonthOfDays(this.props.year, this.props.month)
    }

    get monthDailyTomato() {
        const year = this.props.year || new Date().getFullYear()
        const month = this.props.month || new Date().getMonth()
        const firstDayMS = +new Date(year, month, 1)
        return this.props.finishedTomato.filter(t => {
            return +new Date(t.started_at) > firstDayMS
        })
    }

    get prevMonthTomato(){
        const year = this.props.year || new Date().getFullYear()
        const month = this.props.month  || new Date().getMonth()
        const firstDayMS = +new Date(year, month+1, 1)
        return this.props.finishedTomato.filter(t => {
            return +new Date(t.started_at) > firstDayMS
        })
    }

    //获取月份的完成番茄
    get monthTomatoObj(){
        return groupBy(this.monthDailyTomato,(t)=>{
            return format(new Date(t.ended_at),'yyyy-MM-dd')
        })
    }
    //获取一个月每天的日期,方便数据遍历
    getMonthOfDays = (year: number = new Date().getFullYear(), month: number = new Date().getMonth()) => {
        //下一个月的第0天 相当于上个月的最后一天,所以这里+1
        const days = new Date(year, month + 1, 0).getDate()
        let i = 1
        let arr = []
        while (i <= days) {
            arr.push(format(new Date(year, month, i), 'yyyy-MM-dd'))
            i++
        }
        this.setState({daysArr: arr})
    }

    get gap() {
        //X轴间距
        return 892 / this.state.daysArr.length
    }

    get pathPoint(){
        const circleX = this.gap / 2
        const pathPoint:string[] = []
        const monthCountTomato = this.monthDailyTomato.length
        this.state.daysArr.forEach((d,i)=>{
            let x = (this.gap * i) + circleX
            if(this.monthTomatoObj[d]){
                let y = (1 - this.monthTomatoObj[d].length / monthCountTomato) *170
                pathPoint.push(`${x},${y}`)
            }else{
                pathPoint.push(`${x},170`)
            }
        })
        return pathPoint.join(' ')
    }

    //计算圆圈的Y轴占比高度 同时计算Path路径
    calcCircleY = (item:string)=>{
        const monthCountTomato = this.monthDailyTomato.length
        if(this.monthTomatoObj[item]){
            return (1 - this.monthTomatoObj[item].length / monthCountTomato) *170
        }else{
            return 170
        }
    }
    
    switchTab = (key: string) => {
        this.setState({activeKey: key})
    }

    render() {
        const {activeKey, daysArr} = this.state
        const txtX = this.gap / 2 - 5
        const circleX = this.gap / 2
        const monthIncrease =  ((this.monthDailyTomato.length/daysArr.length) - (this.prevMonthTomato.length/daysArr.length)).toFixed(2)
        return (
            <div className="month-statistics-wrapper">
                <Tabs onChange={this.switchTab} type="card" activeKey={activeKey}>
                    <TabPane tab="番茄统计" key="tomato">
                        <div className="month-statistics-inner">
                            <div className="month-metrics">
                                <div className="month-counts">
                                    <strong>{this.monthDailyTomato.length}</strong>
                                    总数
                                </div>
                                <div className="daily-average">
                                    <strong>{(this.monthDailyTomato.length/daysArr.length).toFixed(2)}</strong>
                                    日平均数
                                </div>
                                <div className="month-increase">
                                    {
                                        parseFloat(monthIncrease) > 0 ? <strong className="rise">+{monthIncrease}</strong>
                                            :<strong className="decline">-{monthIncrease}</strong>
                                    }
                                    <span>月增长量</span>
                                </div>
                            </div>
                            <div className="month-charts">
                                <svg width="100%" height="200px">
                                    <rect x="0" y="0" width="100%" height="170"/>
                                    <path d={`M${this.pathPoint}`}/>
                                    {
                                        daysArr.map((item, i) => {
                                            return (
                                                <g key={i}>
                                                    <text x={(this.gap * i) + txtX} y="200">{i + 1}</text>
                                                    <Tooltip trigger="hover"
                                                             title={this.monthTomatoObj[item] ? this.monthTomatoObj[item].length : 0}
                                                             overlayClassName="daily-tips">
                                                        <circle r="5" cx={(this.gap * i) + circleX}
                                                                cy={this.calcCircleY(item)}/>
                                                    </Tooltip>
                                                </g>
                                            )
                                        })
                                    }
                                </svg>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="任务统计" key="todo">
                        任务统计
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}