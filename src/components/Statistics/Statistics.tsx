import * as React from 'react'
import {connect} from "react-redux";
import {format, parseISO} from "date-fns";
import groupBy from 'lodash/groupBy'
import Polygon from './Polygon'
import Rect from './Rect'
import TodoHistory from './TodoHistory/TodoHistory'
import TomatoHistory from './TomatoHistory/TomatoHistory'
import MonthStatistics from './MonthStatistics/MonthStatistics'
import './Statistics.scss'
interface PropsIF {
    todos:any[],
    tomatoes:any[]
}

interface StateIF {
    activeTab:string
}

class Statistics extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            activeTab :'',
        }
    }

    get monthDailyTomato() {
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const firstDayMS = +new Date(year, month, 1)
        return this.finishedTomato.filter(t => {
            return +new Date(t.started_at) > firstDayMS
        })
    }

    get dailyTodos(){
        if(this.finishedTodo.length > 0){
            return groupBy(this.finishedTodo,(t)=>{
                return format(parseISO(t.completed_at), 'yyyy-MM-dd')
            })
        }else{
            return {}
        }
    }

    get dailyTomatos(){
        if(this.finishedTomato.length >0){
            return groupBy(this.finishedTomato,(t)=>{
                 return format(parseISO(t.ended_at), 'yyyy-MM-dd')
            })
        }else{
            return {}
        }
    }

    getPoints = (objType:any,finishArr:any[])=>{
        const dates = Object.keys(objType).sort((a,b)=>Date.parse(a) - Date.parse(b))
        if(dates.length ===0 ) return undefined
        const firstDay = dates[0]
        const lastDay = dates[dates.length-1]
        const range = Date.parse(lastDay) - Date.parse(firstDay)
        let lastY = 0
        //累计的任务数量
        let todoCounts = 0
        const pointArr =  dates.map((d)=>{
            const dailyTodoArr = objType[d]
            todoCounts += dailyTodoArr.length
            let x = (Date.parse(d) - Date.parse(firstDay)) /range * 319
            x = isNaN(x) ? 0 : x
            const y = (1 - (todoCounts/finishArr.length))*60
            lastY  = y
            return `${x},${y}`
        })
        if(pointArr.length>0){
            return ['0,60',...pointArr,`319,${lastY}`,'319,60'].join(' ')
        }else{
            return '0,60 319,60'
        }
    }

    get finishedTodo(){
        return this.props.todos.filter(t=>t.completed &&!t.deleted &&t.completed_at !== null)
    }

    get finishedTomato(){
        return this.props.tomatoes.filter(t=>t.description &&t.ended_at && !t.aborted)

    }

    get weeklyTomato(){
        // @ts-ignore
        let arr:any[] = []
         this.getWeekDay(format(new Date(),'yyyy-MM-dd')).forEach(d=>{
            if(this.dailyTomatos[d]){
                arr.push(this.dailyTomatos[d])
            }else{
                arr.push('undefined')
            }
        })
        return arr
    }

    whichToRender = ()=>{
        switch (this.state.activeTab) {
            case 'todo':
                return <TodoHistory finishedTodo={this.finishedTodo}/>
            case 'tomatoes':
                return <TomatoHistory finishedTomato={this.finishedTomato} />
            case 'statistics':
                return <MonthStatistics
                    finishedTodo={this.finishedTodo} finishedTomato={this.finishedTomato}/>
            default:
                return ''
        }
    }

     getWeekDay = (dateString:string)=>{//得到一个日期，计算出这个日期所在周的7天的日期
        let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;

        if (dateString.match(dateStringReg)) {
            let presentDate = new Date(dateString),
                today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7;
            return Array.from(new Array(7), function(val, index) {
                return formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000));
            });

        } else {
            throw new Error('dateString should be like "yyyy-mm-dd" or "yyyy/mm/dd"');
        }

        function formatDate(date:Date) {
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        }
    }

    activeTabFn = (name:string)=>{
        const {activeTab} = this.state
        if(name === activeTab) return this.setState({activeTab:''})
        this.setState({activeTab:name})
    }

    render() {
        const todoPoint = this.getPoints(this.dailyTodos,this.finishedTodo)
        const tomatoPoint = this.getPoints(this.dailyTomatos,this.finishedTomato)
        const {activeTab} = this.state
        return (
            <main className="statistics-wrapper">
                <ul className="tab-nav">
                    <li className={activeTab === "statistics"?'tab-item active':'tab-item'} onClick={()=>{this.activeTabFn('statistics')}}>
                        <div className="details">
                            <span className="title">统计</span>
                            <span className="desc">{new Date().getMonth()+1}月累计完成</span>
                            <span className="count">{this.monthDailyTomato.length}</span>
                        </div>
                        <Rect weeklyTomato={this.weeklyTomato}/>
                    </li>
                    <li className={activeTab === "tomatoes"?'tab-item active':'tab-item'} onClick={()=>{this.activeTabFn('tomatoes')}}>
                        <div className="details">
                            <span className="title">番茄历史</span>
                            <span className="desc">累计完成番茄</span>
                            <span className="count">{this.finishedTomato.length}</span>
                        </div>
                        <Polygon svgType="polygon" p_points={tomatoPoint}/>
                    </li>
                    <li className={activeTab === "todo"?'tab-item active':'tab-item'} onClick={()=>{this.activeTabFn('todo')}}>
                        <div className="details">
                            <span className="title">任务历史</span>
                            <span className="desc">累计完成任务</span>
                            <span className="count">{this.finishedTodo.length}</span>
                        </div>
                        <Polygon p_points={todoPoint} svgType="polygon"/>
                    </li>
                </ul>
                    {
                        activeTab !== ''? this.whichToRender() : ''
                    }
            </main>
        );
    }
}
const mapStateToProps = (state:any,ownProps:object) => {
    return {
        todos:state.todos,
        tomatoes:state.tomatoes,
        ...ownProps
    }
}
export default connect(mapStateToProps)(Statistics)