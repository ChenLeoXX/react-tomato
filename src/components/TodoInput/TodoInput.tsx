import Icon from "antd/lib/icon";
import * as React from 'react'
import {connect} from "react-redux";
import {Input, message} from "antd";
import api from "../../config/axios";
import {addTodo} from "../../redux/actions/todoAction";
import './TodoInput.scss';

interface PropsIF {
    addTodo:Function;
}

interface StateIF {
    description:string;
    isFocus:boolean;
}

 class TodoInput extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            description:'',
            isFocus:false
        }
    }
    //区分点击提交和回车提交
    addNewTodo = async (e?:React.KeyboardEvent,isSubmit:boolean = false)=>{
        if(e&&e.keyCode === 13 && !isSubmit){
            try {
                const response = await api.post('todos',{
                    description:(e.target as HTMLInputElement).value
                })
                if(response.status === 200){
                    message.success('添加任务成功')
                    //新添加的TODO添加到列表中
                    this.props.addTodo(response.data.resource)
                }else{
                    message.success('添加失败')
                }
            }catch(e){
                throw new Error(e)
            }
            this.setState({description:''})
        }else if(isSubmit){
            try {
                const response = await  api.post('todos',{
                    description:this.state.description
                })
                if(response.status === 200){
                    message.success('添加任务成功')
                    //新添加的TODO添加到列表中
                    this.props.addTodo(response.data.resource)
                }else{
                    message.success('添加失败')
                }
            }catch(e){
                throw new Error(e)
            }
            this.setState({description:''})
            this.setState({isFocus:false})
        }
    }
    render() {
        const {isFocus,description} = this.state
        const suffix = isFocus ? <Icon type="enter" onClick={()=>this.addNewTodo(undefined,true)}/> : <span />;
        return (
            <div className="input-wrapper">
                <Input placeholder="添加新任务" style={{height:40}}
                       onKeyUp={e=>this.addNewTodo(e)}
                       value={description}
                       onChange={e=>this.setState({description:e.target.value})}
                       onFocus={()=>this.setState({isFocus:true})} suffix={suffix}/>
            </div>
        );
    }
}
const mapStateToProps = (state:any[],ownProps:object) => {
    return {
        ...ownProps
    }
}

const mapDispatchToProps = {
    addTodo
}
export  default connect(mapStateToProps,mapDispatchToProps)(TodoInput)