import * as React from 'react'
import {Button} from "antd";
interface PropsIF {
    history:{
        push:Function
    },
}

interface StateIF {

}

export default class index extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }
    signUp = ()=>{
        console.log(this.props);
        this.props.history.push('/login')
    }
    render() {
        console.log(123);
        return (
            <Button onClick={this.signUp}>登录</Button>
        );
    }
}