import {DatePicker, Tabs, Tooltip} from 'antd'
import {format, getDaysInMonth} from "date-fns";
import groupBy from 'lodash/groupBy'
import moment, {Moment} from 'moment';
import 'moment/locale/zh-cn';
import * as React from 'react'
import './MonthStatistics.scss'

const {MonthPicker} = DatePicker
moment.locale('zh-cn');
const {TabPane} = Tabs;

interface PropsIF {
    finishedTodo: any[]
    finishedTomato: any[]
}

interface StateIF {
    activeKey: string
    pathPoint: string[]
    year: number
    month: number
}

export default class MonthStatistics extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            pathPoint: [],
            activeKey: 'tomato',
            year: new Date().getFullYear(),
            month: new Date().getMonth()
        }
    }


    get monthDailyTomato() {
        const year = this.state.year
        const month = this.state.month
        const lastDay = getDaysInMonth(new Date(year, month))
        const firstDayMS = +new Date(year, month, 1)
        const lastDayMs = +new Date(year, month, lastDay)
        return this.props.finishedTomato.filter(t => {
            return lastDayMs > +new Date(t.started_at) && +new Date(t.started_at) > firstDayMS
        })
    }

    get prevMonthTomato() {
        const year = this.state.year
        const month = this.state.month - 1
        const lastDay = getDaysInMonth(new Date(year, month))
        const firstDayMS = +new Date(year, month, 1)
        const lastDayMs = +new Date(year, month, lastDay)
        return this.props.finishedTomato.filter(t => {
            return lastDayMs > +new Date(t.started_at) && +new Date(t.started_at) > firstDayMS
        })
    }

    get monthTodoObj() {
        return groupBy(this.monthDailyTodo, (t) => {
            return format(new Date(t.completed_at), 'yyyy-MM-dd')
        })
    }

    get monthDailyTodo() {
        const year = this.state.year
        const month = this.state.month
        const lastDay = getDaysInMonth(new Date(year, month))
        const firstDayMS = +new Date(year, month, 1)
        const lastDayMs = +new Date(year, month, lastDay)
        return this.props.finishedTodo.filter(t => {
            return lastDayMs > +new Date(t.completed_at) && +new Date(t.completed_at) > firstDayMS
        })
    }

    get prevMonthTodo() {
        const year = this.state.year
        const month = this.state.month - 1
        const lastDay = getDaysInMonth(new Date(year, month))
        const firstDayMS = +new Date(year, month, 1)
        const lastDayMs = +new Date(year, month, lastDay)
        return this.props.finishedTodo.filter(t => {
            return lastDayMs > +new Date(t.created_at) && +new Date(t.created_at) > firstDayMS
        })
    }

    //获取月份的完成番茄
    get monthTomatoObj() {
        return groupBy(this.monthDailyTomato, (t) => {
            return format(new Date(t.ended_at), 'yyyy-MM-dd')
        })
    }

    //获取一个月每天的日期,方便数据遍历
    get getMonthOfDays() {
        //下一个月的第0天 相当于上个月的最后一天,所以这里+1
        const days = new Date(this.state.year, this.state.month + 1, 0).getDate()
        let i = 1
        let arr = []
        while (i <= days) {
            arr.push(format(new Date(this.state.year, this.state.month, i), 'yyyy-MM-dd'))
            i++
        }
        return arr
    }

    get gap() {
        //X轴间距
        return 892 / this.getMonthOfDays.length
    }

    get pathPoint_TODO() {
        const circleX = this.gap / 2
        const pathPoint: string[] = []
        const monthCountTodo = this.monthDailyTodo.length
        this.getMonthOfDays.forEach((d, i) => {
            let x = (this.gap * i) + circleX
            if (this.monthTodoObj[d]) {
                let y = (1 - this.monthTodoObj[d].length / monthCountTodo) * 170
                pathPoint.push(`${x},${y}`)
            } else {
                pathPoint.push(`${x},170`)
            }
        })
        return pathPoint.join(' ')
    }

    get pathPoint() {
        const circleX = this.gap / 2
        const pathPoint: string[] = []
        const monthCountTomato = this.monthDailyTomato.length
        this.getMonthOfDays.forEach((d, i) => {
            let x = (this.gap * i) + circleX
            if (this.monthTomatoObj[d]) {
                let y = (1 - this.monthTomatoObj[d].length / monthCountTomato) * 170
                pathPoint.push(`${x},${y}`)
            } else {
                pathPoint.push(`${x},170`)
            }
        })
        return pathPoint.join(' ')
    }

    //计算圆圈的Y轴占比高度 同时计算Path路径
    calcCircleY = (item: string) => {
        const monthCountTomato = this.monthDailyTomato.length
        if (this.monthTomatoObj[item]) {
            return (1 - this.monthTomatoObj[item].length / monthCountTomato) * 170
        } else {
            return 170
        }
    }

    calcCircleY_TODO = (item: string) => {
        const monthCountTodo = this.monthDailyTodo.length
        if (this.monthTodoObj[item]) {
            return (1 - this.monthTodoObj[item].length / monthCountTodo) * 170
        } else {
            return 170
        }
    }

    disabledDate = (current: Moment) => {
        return current > moment().endOf('month');
    }

    switchTab = (key: string) => {
        this.setState({activeKey: key})
    }

    selectDate = (m: Moment, dateStr: string) => {
        const newDate = new Date(dateStr)
        this.setState({year: newDate.getFullYear(), month: newDate.getMonth()})
    }

    render() {
        const {activeKey} = this.state
        const txtX = this.gap / 2 - 5
        const circleX = this.gap / 2
        const tomatoAverage = (this.monthDailyTomato.length / this.getMonthOfDays.length).toFixed(2)
        const todoAverage = (this.monthDailyTodo.length / this.getMonthOfDays.length).toFixed(2)
        const tomatoMonthIncrease = ((this.monthDailyTomato.length / this.getMonthOfDays.length) - (this.prevMonthTomato.length / this.getMonthOfDays.length)).toFixed(2)
        const todoMonthIncrease = ((this.monthDailyTodo.length / this.getMonthOfDays.length) - (this.prevMonthTodo.length / this.getMonthOfDays.length)).toFixed(2)
        return (
            <div className="month-statistics-wrapper">
                <Tabs onChange={this.switchTab} type="card" activeKey={activeKey}>
                    <TabPane tab="番茄统计" key="tomato">
                        <div className="month-action">
                            <MonthPicker defaultValue={moment(new Date(), 'yyyy-MM')} onChange={this.selectDate}
                                         disabledDate={this.disabledDate} placeholder="选择月份" allowClear={false}/>
                        </div>
                        <div className="month-statistics-inner">
                            <div className="month-metrics">
                                <div className="month-counts">
                                    <strong>{this.monthDailyTomato.length}</strong>
                                    总数
                                </div>
                                <div className="daily-average">
                                    <strong>{tomatoAverage}</strong>
                                    日平均数
                                </div>
                                <div className="month-increase">
                                    {
                                        parseFloat(tomatoMonthIncrease) > 0 ?
                                            <strong className="rise">+{tomatoMonthIncrease}</strong>
                                            : <strong className="decline">-{tomatoMonthIncrease}</strong>
                                    }
                                    <span>月增长量</span>
                                </div>
                            </div>
                            <div className="month-charts">
                                <svg width="100%" height="200px">
                                    <rect x="0" y="0" width="100%" height="170"/>
                                    <path d={`M${this.pathPoint}`}/>
                                    {
                                        this.getMonthOfDays.map((item, i) => {
                                            return (
                                                <g key={i}>
                                                    <text x={(this.gap * i) + txtX} y="200">{i + 1}</text>
                                                    <Tooltip trigger="hover"
                                                             title={()=>{return this.monthTomatoObj[item] ? this.monthTomatoObj[item].length : 0}}
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
                        <div className="month-action">
                            <MonthPicker defaultValue={moment(new Date(), 'yyyy-MM')} onChange={this.selectDate}
                                         disabledDate={this.disabledDate} placeholder="选择月份" allowClear={false}/>
                        </div>
                        <div className="month-statistics-inner">
                            <div className="month-metrics">
                                <div className="month-counts">
                                    <strong>{this.monthDailyTodo.length}</strong>
                                    总数
                                </div>
                                <div className="daily-average">
                                    <strong>{todoAverage}</strong>
                                    日平均数
                                </div>
                                <div className="month-increase">
                                    {
                                        parseFloat(todoMonthIncrease) > 0 ?
                                            <strong className="rise">+{todoMonthIncrease}</strong>
                                            : <strong className="decline">-{todoMonthIncrease}</strong>
                                    }
                                    <span>月增长量</span>
                                </div>
                            </div>
                            <div className="month-charts">
                                <svg width="100%" height="200px">
                                    <rect x="0" y="0" width="100%" height="170"/>
                                    <path d={`M${this.pathPoint_TODO}`}/>
                                    {
                                        this.getMonthOfDays.map((item, i) => {
                                            return (
                                                <g key={i}>
                                                    <text x={(this.gap * i) + txtX} y="200">{i + 1}</text>
                                                    <Tooltip trigger="hover"
                                                             title={()=>{return this.monthTodoObj[item] ? this.monthTodoObj[item].length : 0}}
                                                             overlayClassName="daily-tips">
                                                        <circle r="5" cx={(this.gap * i) + circleX}
                                                                cy={this.calcCircleY_TODO(item)}/>
                                                    </Tooltip>
                                                </g>
                                            )
                                        })
                                    }
                                </svg>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}