import Icon from "antd/lib/icon";
import * as React from 'react'
import {Button,Input,message} from "antd";
const classNames = require('classnames')
// import CountDown from './CountDown';
import CountDown from './CountDownHook';
interface PropsIF {
    addTomato:()=>{};
    updateTomato:(payload:any)=>{};
    readonly unFinishTomato:any;
}

interface StateIF {
    description:string;
    isFocus:boolean;
    notCounting:boolean;
}

export default class TomatoAction extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            description:'',
            isFocus:false,
            notCounting:true
        }
    }

    submit = (e?:React.KeyboardEvent|React.MouseEvent,click:boolean = false)=>{
        const {description} = this.state
        if(!click &&(e as React.KeyboardEvent).keyCode=== 13){
            if(description === '') return message.info('请输入完成工作内容')
             this.props.updateTomato({description,ended_at:new Date()})
            this.setState({description:''})
        }else if(click){
            if(description === '') return message.info('请输入完成工作内容')
             this.props.updateTomato({description,ended_at:new Date()})
             this.setState({description:''})
        }
        return
    }

    finishRender=()=>{
        this.forceUpdate()
        this.setState({notCounting:true})
    }

    addTomato = ()=>{
        this.props.addTomato()
        this.setState({notCounting:false})
    }

    computedTime= ()=>{
        const {created_at,duration} = this.props.unFinishTomato
        const isRemain = duration > (Date.now() - Date.parse(created_at)+2000)
        if(isRemain){
            return (<CountDown finish={this.finishRender}
                               timer = {duration -(Date.now() - Date.parse(created_at)+2000)}/>)
        }else{
            const suffix = this.state.isFocus ? <Icon type="enter" onClick={e=>this.submit(e,true)}/> : <span />;
            return (<Input value={this.state.description} style={{height:'40px'}}
                           onKeyUp={e=>this.submit(e)}
                           onChange={e=>this.setState({description:e.target.value})}
                           onFocus={()=>this.setState({isFocus:true})} suffix={suffix}
                           placeholder="请输入刚刚完成的工作"/>)
        }

    }

    howToRender = ()=>{
        let content
        const btnClass = classNames({
            'not-counting':this.state.notCounting
        })
        if(this.props.unFinishTomato){
            content = this.computedTime()
        }else{
            content = (
                <Button className={btnClass} block onClick={this.addTomato}>
                    开始番茄
                </Button>
            );
        }
        return content
    }

    render() {
        const content = this.howToRender()
        return (
            <div className="tomato-action-wrapper">
                {content}
            </div>
        );
    }
}