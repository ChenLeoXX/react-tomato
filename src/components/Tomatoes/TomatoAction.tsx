import * as React from 'react'
import {Button} from "antd";

interface PropsIF {
    addTomato:(payload:any)=>{}
}

interface StateIF {

}

export default class TomatoAction extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    render() {
        return (
            <div className="tomato-action-wrapper">
                <Button style={{width:'100%',height:'40px'}} onClick={this.props.addTomato}>
                    开始番茄
                </Button>
            </div>
        );
    }
}