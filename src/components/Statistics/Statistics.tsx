import * as React from 'react'
import {connect} from "react-redux";
import {format, parseISO} from "date-fns";
import groupBy from 'lodash/groupBy'
import Polygon from './Polygon'
import TodoHistory from './TodoHistory/TodoHistory'
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

    get dailyTodos(){
        if(this.finishedTodo.length > 0){
            return groupBy(this.finishedTodo,(t)=>{
                return format(parseISO(t.updated_at), 'yyyy-MM-dd')
            })
        }else{
            return {}
        }
    }

    get points(){
        const dates = Object.keys(this.dailyTodos).sort((a,b)=>Date.parse(a) - Date.parse(b))
        if(dates.length ===0 ) return undefined
        const firstDay = dates[0]
        const lastDay = dates[dates.length-1]
        const range = Date.parse(lastDay) - Date.parse(firstDay)
        let lastY = 0
        //累计的任务数量
        let todoCounts = 0
        const pointArr =  dates.map((d)=>{
            const dailyTodoArr = this.dailyTodos[d]
            todoCounts += dailyTodoArr.length
            let x = (Date.parse(d) - Date.parse(firstDay)) /range * 319
            x = isNaN(x) ? 0 : x
            const y = (1 - (todoCounts/this.finishedTodo.length))*60
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

    whichToRender = ()=>{
        switch (this.state.activeTab) {
            case 'todo':
                return <TodoHistory finishedTodo={this.finishedTodo}/>
            case 'tomatoes':
                return ''
            case 'statistics':
                return ''
            default:
                return ''
        }
    }

    activeTabFn = (name:string)=>{
        const {activeTab} = this.state
        if(name === activeTab) return this.setState({activeTab:''})
        this.setState({activeTab:name})
    }

    render() {
        console.log(this.finishedTodo)
        const {activeTab} = this.state
        return (
            <main className="statistics-wrapper">
                <ul className="tab-nav">
                    <li className={activeTab === "statistics"?'tab-item active':'tab-item'} onClick={()=>{this.activeTabFn('statistics')}}>
                        <div className="details">
                            <span className="title">统计</span>
                            <span className="desc">累计完成任务</span>
                            <span className="count">{this.finishedTomato.length}</span>
                        </div>
                        <Polygon/>
                    </li>
                    <li className={activeTab === "tomatoes"?'tab-item active':'tab-item'} onClick={()=>{this.activeTabFn('tomatoes')}}>
                        <div className="details">
                            <span className="title">番茄历史</span>
                            <span className="desc">累计完成番茄</span>
                            <span className="count">{this.finishedTomato.length}</span>
                        </div>
                        <Polygon/>
                    </li>
                    <li className={activeTab === "todo"?'tab-item active':'tab-item'} onClick={()=>{this.activeTabFn('todo')}}>
                        <div className="details">
                            <span className="title">任务历史</span>
                            <span className="desc">累计完成任务</span>
                            <span className="count">{this.finishedTodo.length}</span>
                        </div>
                        <Polygon p_points={this.points}/>
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