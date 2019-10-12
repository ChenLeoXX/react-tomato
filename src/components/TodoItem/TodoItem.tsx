import * as React from 'react'
import './TodoItem.scss'
const classNames =require('classnames')
import {Checkbox,Icon} from "antd"

interface PropsIF {
    description:string;
    completed:boolean;
    id:number;
    updateItem:Function;
    editing:boolean;
    toggleEdit:Function
}

interface StateIF {
    editText:string;
}

export default class TodoItem extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            editText:this.props.description
        }
    }

    update = (params:any)=>{
        this.props.updateItem(this.props.id,params)
    }

    toEdit = ()=>{
        this.props.toggleEdit(this.props.id)
    }

    submit = (e:React.KeyboardEvent)=>{
        const {editText} = this.state
        if(e.keyCode === 13 &&editText !== ''){
            this.update({description:editText})
        }
    }

    render() {
        const editClass = classNames({
            'edit-wrapper':true,
            'editing':this.props.editing
        })
        const input = (
          <div className={editClass}>
              <input type="text" value={this.state.editText}
                     onChange={e=>this.setState({editText:e.target.value})}
                     onKeyUp={e=>this.submit(e)}
              />
              <div className="icon-wrapper">
                  <Icon type="enter" onClick={e=>this.update({description:this.state.editText})}/>
                  <Icon type="delete" onClick={e=>this.update({deleted:true})}/>
              </div>
          </div>
        );
        const text = <span className="description" onDoubleClick={this.toEdit}>{this.props.description}</span>
        return (
            <div className="todo-item">
                <Checkbox checked={this.props.completed}
                          onChange={e=>this.update({completed:e.target.checked})}
                />
                {this.props.editing? input:text}
            </div>
        );
    }
}