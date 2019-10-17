import * as React from 'react'
import { Tabs ,Pagination} from 'antd';
const { TabPane } = Tabs;
import {connect} from "react-redux";
import {format, getDay, parseISO} from "date-fns";
import groupBy from 'lodash/groupBy'
import HistoryItem from '../HistoryItem'
import './TomatoHistory.scss'
interface PropsIF {
    tomatoes:any[],
    finishedTomato:any[]
}

interface StateIF {
    activeKey:string
    weekDict:any
    dateArr:string[]
}

class TomatoHistory extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            activeKey:'finished',
            dateArr:[],
            weekDict:{
                '1':'周一',
                '2':'周二',
                '3':'周三',
                '4':'周四',
                '5':'周五',
                '6':'周六',
                '0':'周日'
            }
        }
    }

    componentDidMount() {
        this.setState(()=>{
            const list = this.dates().slice(0,3)
            return {dateArr:list}
        })
    }

    dates=()=>{
        return Object.keys(this.dailyFinishTomato).sort((a,b)=>Date.parse(b) - Date.parse(a))
    }

    switchTab = (key:string)=>{
        this.setState({activeKey:key})
    }

    get abortedTomato(){
        return this.props.tomatoes.filter(t=>t.aborted).slice(0,20)
    }

    get dailyFinishTomato(){
        if(this.props.finishedTomato.length >0){
            return groupBy(this.props.finishedTomato,(t)=>{
                const stdHour = 60*60*1000
                const stdSec = 60*1000
                const range = Date.parse(t.ended_at)- Date.parse(t.created_at)
                const  hours = Math.floor(range/stdHour)
                const minutes =   Math.floor((range%stdHour)/stdSec)
                t.total_cost = {hours,minutes}
                return format(parseISO(t.ended_at), 'yyyy-MM-dd')
            })
        }else{
            return {}
        }
    }
    //计算显示当天共花的时间
    get costTimes(){
        return this.dates().reduce((init:any,d)=>{
            if(init[d] === undefined){
                let totalTimes = {
                    hours:0,
                    minutes:0
                }
                this.dailyFinishTomato[d].forEach(t=>{
                    totalTimes.hours += t.total_cost.hours
                    totalTimes.minutes += t.total_cost.minutes
                })
                if(totalTimes.minutes >= 60){
                    totalTimes.hours += Math.floor(totalTimes.minutes/60)
                    totalTimes.minutes = totalTimes.minutes%60
                }
                init[d] = totalTimes
            }
            return init
        },{})
    }

    pageChange = (p:number)=> {
        const list = this.dates().slice(p * 3 - 3, p * 3)
        this.setState({dateArr: list})
    }

    render() {
        console.log(this.abortedTomato)
        const {activeKey,dateArr,weekDict} = this.state
        const list = dateArr.map(d=>{
            return (
                <div className="daily-tomato" key={d}>
                    <div className="date">
                        <div className="title">
                            <span>{format(parseISO(d),'MM月dd日')}</span>
                            <span className="weekday">{weekDict[getDay(new Date(d))]}</span>
                        </div>
                        <div className="desc">
                            <span className="tomato-count">完成了{this.dailyFinishTomato[d].length}个番茄</span>
                            <span className="tomato-hours">
                                {
                                    this.costTimes[d].hours > 0 ?
                                        `总计${this.costTimes[d].hours}小时${this.costTimes[d].minutes}分钟`:
                                        `总计${this.costTimes[d].minutes}`
                                }
                            </span>
                        </div>
                    </div>
                    <div className="items-list">
                        {
                            this.dailyFinishTomato[d].map(t=>{
                                return <HistoryItem key={t.id} render="finishedTomatoItem" {...t}/>
                            })
                        }
                    </div>
                </div>
            );
        })

        return (
            <div className="tomato-statistics-wrapper">
                <Tabs onChange={this.switchTab} type="card" activeKey={activeKey}>
                    <TabPane tab="完成的番茄" key="finished">
                        {list}
                        <Pagination defaultCurrent={1} total={this.dates().length} pageSize={3}
                                    onChange={this.pageChange} showTotal={() => `总计 ${this.props.finishedTomato.length} 个番茄`}
                        />
                    </TabPane>
                    <TabPane tab="打断记录" key="aborted">
                        <div className="items-list">
                            {
                                this.abortedTomato.map(t=>{
                                    return <HistoryItem render="deletedTomatoItem" key={t.id} {...t}/>
                                })
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
const mapStateToProps = (state:any,ownProps:object) => {
    return {
        tomatoes:state.tomatoes,
        ...ownProps
    }
}
export default connect(mapStateToProps)(TomatoHistory)