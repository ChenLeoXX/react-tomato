import { Tabs ,Pagination,Empty} from 'antd';
const { TabPane } = Tabs;
import {connect} from "react-redux";
import {format, parseISO,getDay} from "date-fns";
import groupBy from 'lodash/groupBy'
import * as React from 'react'
import './TodoHistory.scss'
import HistoryItem from '../HistoryItem'
interface PropsIF {
    todos:any[]
    finishedTodo:any[]
}

interface StateIF {
    activeKey:string
    weekDict:any
    dateArr:string[]
}

class TodoHistory extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            activeKey:'finish',
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

    switchTab = (key:string)=>{
        this.setState({activeKey:key})
    }

    dates=()=>{
        return Object.keys(this.dailyFinishTodo).sort((a,b)=>Date.parse(b) - Date.parse(a))
    }

    get dailyFinishTodo(){
        return groupBy(this.props.finishedTodo,(t)=>{
            return format(parseISO(t.completed_at), 'yyyy-MM-dd')
        })
    }

    get deletedTodo(){
        return this.props.todos.filter(t=>t.deleted).slice(0,20)
    }

    pageChange = (p:number)=>{
        const list = this.dates().slice(p*3-3,p*3)
        this.setState({dateArr:list})
    }

    render() {
        const {dateArr,activeKey,weekDict} = this.state

        const list = dateArr.map(d=>{
            return (
                <div className="daily-todo" key={d}>
                    <div className="date">
                        <div className="title">
                            <span>{format(parseISO(d),'MM月dd日')}</span>
                            <span className="weekday">{weekDict[getDay(new Date(d))]}</span>
                        </div>
                        <div className="desc">
                            完成了{this.dailyFinishTodo[d].length}个任务
                        </div>
                    </div>
                    <div className="items-list">
                        {
                            this.dailyFinishTodo[d].map((t:any)=>{
                                return (
                                    <HistoryItem render="finishedTodoItem" key={t.id} {...t}/>
                                )
                            })
                        }
                    </div>
                </div>
            );
        })

        return (
        <div className="history-statistics-wrapper">
            <Tabs onChange={this.switchTab} type="card" activeKey={activeKey}>
            <TabPane tab="已完成的任务" key='finish'>
                {list}
                {
                    this.props.finishedTodo.length === 0 ?  <Empty/>:null
                }
                <Pagination defaultCurrent={1} total={this.dates().length} pageSize={3}
                            onChange={(p)=>this.pageChange(p)} showTotal={() => `总计 ${this.props.finishedTodo.length} 个任务`}/>
            </TabPane>
            <TabPane tab="已删除的任务" key="delete">
                <div className="items-list">
                    {
                        this.deletedTodo.map(t=>{
                            return <HistoryItem render="deletedTodoItem"  key={t.id} {...t}/>
                        })
                    }
                    {

                        this.deletedTodo.length === 0 ?  <Empty/>:null

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
        todos:state.todos,
        ...ownProps
    }
}
export default connect(mapStateToProps)(TodoHistory)