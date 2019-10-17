import {message,Input} from "antd";
import {format, parseISO} from "date-fns";
import * as React from 'react'
import {connect} from "react-redux";
import api from '../../config/axios'
import {updateItem} from "../../redux/actions/todoAction";
import {updateTomato} from "../../redux/actions/tomatoAction";

interface PropsIF {
    manually_created:boolean
    description:string
    completed_at:string
    updated_at:string
    created_at:string
    ended_at:string
    id:number
    render:string
    updateTomato:(payload:any)=>{}
    updateItem:(payload:any)=>{}
}

interface StateIF {
    isTomatoEdit:boolean
    desc:string
}

class HistoryItem extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state= {
            isTomatoEdit:false,
            desc:this.props.description
        }
    }

    updateTomato = async (params:any,type:string)=>{
        try {
            const {data:{resource},status} = await api.put(`tomatoes/${this.props.id}`,params)
            if(status === 200){
                this.props.updateTomato(resource)
                if(type==='update'){
                    this.setState({isTomatoEdit:false})
                }
            }
        }catch(e){
            message.error(e)
        }
    }

    updateTodo = async (params:any)=>{
        try {
            const {data:{resource},status} = await api.put(`todos/${this.props.id}`,params)
            if(status === 200){
                this.props.updateItem(resource)
            }
        }catch(e){
            message.error(e)
        }
    }

    submitEdit = (e:React.KeyboardEvent)=>{
        if(e.keyCode===13){
            this.updateTomato({description:this.state.desc},'update')
        }
    }

    whichToRender = ()=>{
        switch (this.props.render) {
            case 'finishedTodoItem':
                return  (
                    <div className="history-item">
                        <div className="content">
                            <div className="times">
                                <span className="time">{format(parseISO(this.props.completed_at),'H:mm')}</span>
                                <span className="desc">{this.props.description}</span>
                            </div>
                        </div>
                        <div className="action-wrapper">
                            <span className="reset" onClick={()=>{this.updateTodo({completed:false})}}>恢复</span>
                            <span className="delete" onClick={()=>{this.updateTodo({deleted:true,completed:false})}}>删除</span>
                        </div>
                    </div>
                );
            case 'deletedTodoItem':
                return (
                    <div className="history-item">
                        <div className="content">
                            <div className="times">
                                <span className="time">{format(parseISO(this.props.updated_at),'yyyy年MM月dd日')}</span>
                                <span className="desc">{this.props.description}</span>
                            </div>
                        </div>
                        <div className="action-wrapper">
                            <span className="reset" onClick={()=>{this.updateTodo({deleted:false,completed:false})}}>恢复</span>
                        </div>
                    </div>
                );
            case 'finishedTomatoItem':
                return (
                    <div className="history-item">
                        <div className="content">
                            <div className="times">
                                <span className="time tomato-item">
                                    {format(parseISO(this.props.created_at),'H:mm')}
                                    -
                                    {format(parseISO(this.props.ended_at),'H:mm')}
                                </span>
                            </div>
                                {
                                    this.state.isTomatoEdit ?
                                    <Input value={this.state.desc}
                                           onKeyUp={(e)=>{this.submitEdit(e)}}
                                           onChange={(e)=>{this.setState({desc:e.target.value})}} />
                                    : (<span className="desc">{this.props.description}</span>)
                                }
                                {
                                    this.props.manually_created && !this.state.isTomatoEdit? (<span className="patched">(补)</span>):null
                                }
                        </div>
                        {
                            this.state.isTomatoEdit ?
                                <div className="action-wrapper">
                                    <span className="reset" onClick={()=>{this.updateTomato({description:this.state.desc},'update')}}>提交</span>
                                    <span className="delete" onClick={()=>{this.setState({isTomatoEdit:false})}}>取消</span>
                                </div>
                             :
                                <div className="action-wrapper">
                                    <span className="reset" onClick={()=>{this.setState({isTomatoEdit:true})}}>编辑</span>
                                    <span className="delete" onClick={()=>{this.updateTomato({aborted:true},'delete')}}>删除</span>
                                </div>

                        }

                    </div>
                )
            case 'deletedTomatoItem':
                return (
                    <div className="history-item">
                        <div className="content">
                            <div className="times delete-tomato">
                                <span className="day-time">{format(parseISO(this.props.updated_at),'yyyy年MM月dd日')}</span>
                                <span className="time tomato-item">
                                    {format(parseISO(this.props.created_at),'H:mm')}
                                    -
                                    {format(parseISO(this.props.updated_at),'H:mm')}
                                </span>
                            </div>
                            {
                                this.state.isTomatoEdit ?
                                    <Input value={this.state.desc}
                                           onKeyUp={(e)=>{this.submitEdit(e)}}
                                           onChange={(e)=>{this.setState({desc:e.target.value})}} />
                                    : (<span className="desc">{this.props.description ? this.props.description:'番茄描述为空 '}</span>)

                            }
                        </div>
                        {
                            this.state.isTomatoEdit ?
                                <div className="action-wrapper">
                                    <span className="reset" onClick={()=>{this.updateTomato({description:this.state.desc},'update')}}>提交</span>
                                    <span className="delete" onClick={()=>{this.setState({isTomatoEdit:false})}}>取消</span>
                                </div>
                                :
                                <div className="action-wrapper">
                                    <span className="reset" onClick={()=>{this.setState({isTomatoEdit:true})}}>编辑</span>
                                </div>

                        }
                    </div>
                );
            default:
                return null
        }
    }
    render() {
        return this.whichToRender()
    }
}
const mapDispatchToProps = {
    updateItem,
    updateTomato
}
export default connect(undefined,mapDispatchToProps)(HistoryItem)