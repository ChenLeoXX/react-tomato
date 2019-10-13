import * as React from 'react'
import './TodoItem.scss'
const classNames =require('classnames')
import {Checkbox, Icon, message} from "antd"
import {connect} from "react-redux";
import api from "../../config/axios";
import { toggleEdit, updateItem} from "../../redux/action";

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

class TodoItem extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            editText:this.props.description
        }
    }

    toEdit = ()=>{
        this.props.toggleEdit(this.props.id)
    }

    submit = (e:React.KeyboardEvent)=>{
        const {editText} = this.state
        if(e.keyCode === 13 &&editText !== ''){
            this.updateItem({description:editText})
        }
    }

    updateItem = async (params:any)=>{
        try {
            const {data:{resource},status} = await api.put(`todos/${this.props.id}`,params)
            if(status === 200){
                this.props.updateItem(resource)
            }
        }catch(e){
            message.error(e)
            console.log(e)
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
              <input value={this.state.editText} ref={(node)=>node&&node.focus()}
                     onChange={e=>this.setState({editText:e.target.value})}
                     onKeyUp={e=>this.submit(e)}
              />
              <div className="icon-wrapper">
                  <Icon type="enter"
                        style={{'fill':'#bbb'}}
                        onClick={e=>this.updateItem({description:this.state.editText})}/>
                  <Icon type="delete"
                        style={{'fill':'#bbb'}}
                        onClick={e=>this.updateItem({deleted:true})}/>
              </div>
          </div>
        );
        const text = <span className="description" onDoubleClick={this.toEdit}>{this.props.description}</span>
        return (
            <div className={editClass}>
                <Checkbox checked={this.props.completed}
                          onChange={e=>this.updateItem({completed:e.target.checked})}
                />
                {this.props.editing? input:text}
            </div>
        );
    }
}
const mapStateToProps = (state:any,ownProps:object) => {
    return {
        todos:state.todos,
        ...ownProps
    }
}

const mapDispatchToProps = {
    updateItem,
    toggleEdit
}
export default connect(mapStateToProps,mapDispatchToProps)(TodoItem)