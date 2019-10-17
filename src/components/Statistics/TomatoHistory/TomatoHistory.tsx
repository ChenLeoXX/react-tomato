import * as React from 'react'
import {Tabs, Pagination, Button, Tooltip, Form, DatePicker, Input, message} from 'antd';
const { TabPane } = Tabs;
import {connect} from "react-redux";
import {format, getDay, parseISO} from "date-fns";
import moment from 'moment';
import api from '../../../config/axios'
import locale from "antd/lib/date-picker/locale/zh_CN";
import groupBy from 'lodash/groupBy'
import HistoryItem from '../HistoryItem'
import {addTomato} from "../../../redux/actions/tomatoAction";
import './TomatoHistory.scss'
interface PropsIF {
    tomatoes:any[]
    addTomato:(payload:any)=>void
    finishedTomato:any[]
}

interface StateIF {
    activeKey:string
    weekDict:any
    dateArr:string[]
    manualTomatoVisible:boolean
    startOfTomato:string
    endOfTomato:string
    manualDes:string
}

class TomatoHistory extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            activeKey:'finished',
            dateArr:[],
            manualTomatoVisible:false,
            startOfTomato:'',
            endOfTomato:'',
            manualDes:'',
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
        return this.props.tomatoes.filter(t=>t.aborted).slice(0,15)
    }

    get dailyFinishTomato(){
        if(this.props.finishedTomato.length >0){
            return groupBy(this.props.finishedTomato,(t)=>{
                const stdHour = 60*60*1000
                const stdSec = 60*1000
                const range = Date.parse(t.ended_at)- Date.parse(t.started_at)
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

    addManualTomato = async ()=>{
        try {
            const {data:{resource},status}  = await api.post('tomatoes',{
                started_at:new Date(this.state.startOfTomato).toISOString(),
                ended_at:new Date(this.state.endOfTomato).toISOString(),
                manually_created:true,
                description:this.state.manualDes
            })
            if(status === 200){
                this.props.addTomato(resource)
                this.setState({manualTomatoVisible:false,manualDes:""})
            }
        }catch(e){
            throw new Error(e)
        }
    }

    dateChange = (type:string,dateStr:string)=>{
        if(type === 'st'){
            this.setState({startOfTomato:dateStr})
        }else{
            this.setState({endOfTomato:dateStr})
        }
    }

    current = (current:moment.Moment)=>{
        return current&&current >moment().endOf('day')
    }

    pageChange = (p:number)=> {
        const list = this.dates().slice(p * 3 - 3, p * 3)
        this.setState({dateArr: list})
    }

    submitManual = ()=>{
        const ST_TIMESTAMP = Date.parse(this.state.startOfTomato)
        const END_TIMESTAMP = Date.parse(this.state.endOfTomato)
        if(END_TIMESTAMP <= ST_TIMESTAMP){
            message.error('结束时间不能小于开始时间')
        }else if(this.state.manualDes === ''){
            message.info('描述不能为空')
        }else{
            this.addManualTomato()
        }
    }

    get manualTomatoForm(){
        return (
            <div className="patch-tomato-wrapper">
                <Form>
                    <Form.Item label="开始时间" labelCol={{span:2}} wrapperCol={{span:6}}>
                        <DatePicker allowClear disabledDate={this.current} locale={locale}
                                    format="YYYY-MM-DD HH:mm" onChange={(m,str)=>this.dateChange('st',str)}
                                    showTime={{ defaultValue: moment('00:00','HH:mm'),format:'HH:mm' }}/>
                    </Form.Item>
                    <Form.Item label="结束时间" labelCol={{span:2}} wrapperCol={{span:6}}>
                        <DatePicker allowClear disabledDate={this.current} locale={locale}
                                    format="YYYY-MM-DD HH:mm" onChange={(m,str)=>this.dateChange('end',str)}
                                    showTime={{ defaultValue: moment('00:00','HH:mm'),format:'HH:mm'  }}/>
                    </Form.Item>
                    <Form.Item label={"描述"} labelCol={{span:2}} wrapperCol={{span:6}}>
                        <Input value={this.state.manualDes} onChange={(e)=>{this.setState({manualDes:e.target.value})}}/>
                    </Form.Item>
                    <Form.Item labelCol={{span:2}}>
                        <Button type={"primary"} style={{marginRight:'16px'}} onClick={this.submitManual} >提交</Button>
                        <Button onClick={()=>{this.setState({manualTomatoVisible:false})}}>取消</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }


    render() {
        const {activeKey,dateArr,weekDict,manualTomatoVisible} = this.state
        let patchTomato = null
        if(activeKey === 'finished'){
            patchTomato =(
                <Tooltip placement="top" title="补计番茄">
                    <Button icon="plus" style={{marginRight:'16px'}}
                            onClick={()=>{this.setState({manualTomatoVisible:!this.state.manualTomatoVisible})}}/>
                </Tooltip>);
        }
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
                                        `总计${this.costTimes[d].minutes}分钟`
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
                <Tabs onChange={this.switchTab} type="card" activeKey={activeKey} tabBarExtraContent={patchTomato}>
                    <TabPane tab="完成的番茄" key="finished">
                        {
                            manualTomatoVisible ? this.manualTomatoForm :null
                        }
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

const mapDispatchToProps = {
    addTomato
}

const mapStateToProps = (state:any,ownProps:object) => {
    return {
        tomatoes:state.tomatoes,
        ...ownProps
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(TomatoHistory)