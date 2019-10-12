import Icon from "antd/lib/icon";
import * as React from 'react'
import {Input} from "antd";
import './TodoInput.scss';

interface PropsIF {
    addTodo:Function;
}

interface StateIF {
    description:string;
    isFocus:boolean;
}

export default class TodoInput extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            description:'',
            isFocus:false
        }
    }
    //区分点击提交和回车提交
    addNewTodo = (e?:React.KeyboardEvent,isSubmit:boolean = false)=>{
        if(e&&e.keyCode === 13 && !isSubmit){
            this.props.addTodo( e&&(e.target as HTMLInputElement).value)
            this.setState({description:''})
        }else if(isSubmit){
            this.props.addTodo(this.state.description)
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