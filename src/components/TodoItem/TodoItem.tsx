import * as React from 'react'
import './TodoItem.scss'
import {Checkbox} from "antd";

interface PropsIF {
    description:string;
    completed:boolean;
    id:number;
    updateItem:Function;
}

interface StateIF {

}

export default class TodoItem extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    update = (params:any)=>{
        this.props.updateItem(this.props.id,params)
    }

    render() {
        return (
            <div className="todo-item">
                <Checkbox checked={this.props.completed}
                          onChange={e=>this.update({completed:e.target.checked})}
                />
                <span>{this.props.description}</span>
            </div>
        );
    }
}