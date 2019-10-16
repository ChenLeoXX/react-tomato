import {message} from "antd";
import {format, parseISO} from "date-fns";
import * as React from 'react'
import {connect} from "react-redux";
import api from '../../../config/axios'
import {updateItem} from "../../../redux/actions/todoAction";

interface PropsIF {
    description:string
    completed_at:string
    updated_at:string
    id:number
    render:string
    updateItem:(payload:any)=>{}
}

interface StateIF {

}

class HistoryItem extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
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
    whichToRender = ()=>{
        if(this.props.render=== 'finishItem'){
            return (
                <div className="history-item">
                    <div className="content">
                        <span className="time">{format(parseISO(this.props.completed_at),'H:mm')}</span>
                        <span className="desc">{this.props.description}</span>
                    </div>
                    <div className="action-wrapper">
                        <span className="reset" onClick={()=>{this.updateTodo({completed:false})}}>恢复</span>
                        <span className="delete" onClick={()=>{this.updateTodo({deleted:true,completed:false})}}>删除</span>
                    </div>
                </div>
            );
        }else{
            return (
                <div className="history-item">
                    <div className="content">
                        <span className="time">{format(parseISO(this.props.updated_at),'yyyy-MM-dd')}</span>
                        <span className="desc">{this.props.description}</span>
                    </div>
                    <div className="action-wrapper">
                        <span className="reset" onClick={()=>{this.updateTodo({deleted:false,completed:false})}}>恢复</span>
                    </div>
                </div>
            );
        }
    }
    render() {
        return this.whichToRender()
    }
}
const mapDispatchToProps = {
    updateItem
}
export default connect(undefined,mapDispatchToProps)(HistoryItem)