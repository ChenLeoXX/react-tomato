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
    toggleEdit:Function,
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
            'todo-item':true,
            'editing':this.props.editing,
            'completed':this.props.completed
        })
        const input = (
          <div className="edit-wrapper">
              <textarea value={this.state.editText} ref={(node)=>node&&node.focus()}
                     onChange={e=>this.setState({editText:e.target.value})}
                     onKeyUp={e=>this.submit(e)}
              />
              <div className="icon-wrapper">
                  <Icon type="enter"
                        style={{'fill':'#bbb'}}
                        onClick={e=>this.update({description:this.state.editText})}/>
                  <Icon type="delete"
                        style={{'fill':'#bbb'}}
                        onClick={e=>this.update({deleted:true})}/>
              </div>
          </div>
        );
        const text = <span className="description" onDoubleClick={this.toEdit}>{this.props.description}</span>
        return (
            <div className={editClass}>
                <Checkbox checked={this.props.completed}
                          onChange={e=>this.update({completed:e.target.checked})}
                />
                {this.props.editing? input:text}
            </div>
        );
    }
}