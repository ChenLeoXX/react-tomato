import Icon from "antd/lib/icon";
import * as React from 'react'
import {Button,Input,message} from "antd";
import CountDown from './CountDown'
interface PropsIF {
    addTomato:(payload:any)=>{};
    updateTomato:(payload:any)=>{};
    readonly unFinishTomato:any;
}

interface StateIF {
    description:string;
    isFocus:boolean;
}

export default class TomatoAction extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            description:'',
            isFocus:false
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
    }

    computedTime= ()=>{
        const {created_at} = this.props.unFinishTomato
        const isRemain = 50000 > (Date.now() - Date.parse(created_at))
        if(isRemain){
            return (<CountDown finish={this.finishRender} timer = {50000 - (Date.now() - Date.parse(created_at))}/>)
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
        if(this.props.unFinishTomato){
            content = this.computedTime()
        }else{
            content = (
                <Button  block onClick={this.props.addTomato}>
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