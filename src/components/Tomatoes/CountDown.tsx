import {Icon,Modal} from "antd";
import * as React from 'react'
import Timeout = NodeJS.Timeout;
const {confirm} = Modal
interface PropsIF {
    timer:number;
    finish:()=>void;
    updateTomato:(payload:any)=>void;
}

interface StateIF {
    countdown:number;
}
let timerId:Timeout
export default class CountDown extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            countdown:this.props.timer
        }
    }

    calcTime=()=>{
        const {countdown} = this.state
        const min = Math.floor(countdown/1000/60)
        const sec = Math.floor(countdown/1000%60)
        return`${min<10 ?'0'+min:min}:${sec<10?'0'+sec:sec}`
    }

    showConfirm = ()=>{
        confirm({
            content:'您目前正在一个番茄工作时间中，要放弃这个番茄吗？',
            okText:'确认',
            cancelText:'取消',
            centered:true,
            width:445,
            onOk:()=>{
                this.abortTomato()
            }
        })
    }

    abortTomato = ()=>{
        this.props.updateTomato({aborted:true})
        document.title = '番茄闹钟'
    }

    componentDidMount() {
        timerId = setInterval(()=>{
            let time = this.state.countdown - 1000
            if(time < 0 ){
                this.props.finish()
                clearInterval(timerId)
                document.title = `番茄闹钟`
            }else{
                this.setState({countdown:time})
                const times = this.calcTime()
                document.title = `番茄闹钟-${times}`
            }
            
        },1000)
    }

    componentWillUnmount() {
        clearInterval(timerId)
    }

    render() {
        const {countdown} = this.state
        const times = this.calcTime()
        let percent =  1 - (countdown/1500000)
        return (
            <div className="countdown-wrapper">
                <div className="count-down">
                    <p>{times}</p>
                    <Icon type="close-circle" onClick={()=>{this.showConfirm()}}/>
                    <div className="progress" style={{width:`${percent*100}%`}}/>
                </div>
            </div>
        );
    }
}