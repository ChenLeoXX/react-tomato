import { Tabs ,Pagination} from 'antd';
const { TabPane } = Tabs;
import {connect} from "react-redux";
import {format, parseISO,getDay} from "date-fns";
import groupBy from 'lodash/groupBy'
import * as React from 'react'
import './TodoHistory.scss'
import HistoryItem from './HistoryItem'
interface PropsIF {
    todos:any[]
    finishedTodo:any[]
}

interface StateIF {
    activeKey:string
    weekDict:any
    deleteList:any[]
    dateArr:string[]
}

class TodoHistory extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            activeKey:'finish',
            dateArr:[],
            deleteList:[],
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

    pageChange = (p:number,type:string)=>{
        if(type=== 'finish'){
            const list = this.dates().slice(p*3-3,p*3)
            this.setState({dateArr:list})
        }else{
            this.deletedTodo.slice(p*10-10,p*10)
        }
    }

    render() {
        const {dateArr,activeKey,weekDict} = this.state

        const list = dateArr.map(d=>{
            return (
                <div className="daily-todo" key={d}>
                    <div className="date">
                        <div className="title">
                            <span>{d}</span>
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
                                    <HistoryItem render="finishItem" key={t.id} {...t}/>
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
                <Pagination defaultCurrent={1} total={this.dates().length} pageSize={3}
                            onChange={(p)=>this.pageChange(p,'finish')} showTotal={() => `总计 ${this.props.finishedTodo.length} 个任务`}
                />
            </TabPane>
            <TabPane tab="已删除的任务" key="delete">
                <div className="items-list">
                    {
                        this.deletedTodo.map(t=>{
                            return <HistoryItem render="deletedItem"  key={t.id} {...t}/>
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
        todos:state.todos,
        ...ownProps
    }
}
export default connect(mapStateToProps)(TodoHistory)