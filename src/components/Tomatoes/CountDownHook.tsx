import * as React from 'react'
import Timeout = NodeJS.Timeout;
import {useState,useEffect} from 'react'
interface ICountDown {
    timer:number;
    finish:()=>void;
}

let timerId:Timeout
const CountDown:React.FC<ICountDown>= (props) =>{
    const [countDown,setCountDown] = useState(props.timer)
    const min = Math.floor(countDown/1000/60)
    const sec = Math.floor(countDown/1000%60)
    let displayTime = `${min<10 ?'0'+min:min}:${sec<10?'0'+sec:sec}`
    useEffect(()=>{
        timerId = setInterval(()=>{
            let time = countDown - 1000
            if(time < 0 ){
                props.finish()
                clearInterval(timerId)
                document.title = `番茄闹钟`
            }else{
                setCountDown(time)
                document.title = `番茄闹钟-${displayTime}`
            }
        },1000)
        return function(){
            clearInterval(timerId)
        }
    },[])
    return (
        <div className="count-down">
            <p>{displayTime}</p>
        </div>
    );
}
export default CountDown
