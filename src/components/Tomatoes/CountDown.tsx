import * as React from 'react'
import Timeout = NodeJS.Timeout;
interface PropsIF {
    timer:number;
    finish:()=>void;
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
        const times = this.calcTime()
        return (
            <div className="count-down">
                <p>{times}</p>
            </div>
        );
    }
}