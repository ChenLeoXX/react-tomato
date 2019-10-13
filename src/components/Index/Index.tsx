import * as React from 'react'
import {connect} from "react-redux";
import api from '../../config/axios'
import {RouteComponentProps} from "react-router-dom";
import {Menu,Dropdown,Icon,Button} from "antd";
import {initTodo} from "../../redux/actions/todoAction";
import TodoInput from '../TodoInput/TodoInput'
import TodoItem from '../TodoItem/TodoItem'
import Tomatoes from '../Tomatoes/Tomatoes'
import Empty from '../empty';
import './Index.scss'

interface PropsIF extends RouteComponentProps{
    todos:any[];
    updateItem:Function;
    initTodo:Function;
    toggleEdit:Function;
}

interface StateIF {
    user:any,
}

 class Index extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            user:{},
            // todos:[]
        }
    }

    getUser = async ()=>{
        try {
            await  api.get('me').then(res=>{
                if(res.status === 200){
                    this.setState({user:res.data})
                }
            })
        }catch (e) {

        }
    }

    getTodos = async ()=>{
        try {
            const {data:{resources}} = await api.get('todos')
            const newState = resources.map((t:any)=>{
                 t.editing = false
                return t
            })
            this.props.initTodo(newState)
        }catch(e){
            throw new Error(e)
        }
    }

    get unDeletedTodo(){
        return this.props.todos.filter(t=>!t.deleted)
    }

    get unCompletedTodo(){
        return this.unDeletedTodo.filter(t=>!t.completed)
    }

    get completedTodo(){
        return this.unDeletedTodo.filter(t=>t.completed)
    }

    logout = ()=>{
        localStorage.setItem('token','')
        this.props.history.push('login')
    }
    async componentDidMount() {
        await this.getTodos()
    }
    async componentWillMount(){
        await this.getUser()
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <Icon type="user" />
                    个人设置
                </Menu.Item>
                <Menu.Item key="2" onClick={this.logout}>
                    <Icon type="logout"/>
                    注销
                </Menu.Item>
            </Menu>
        );
        const content = (
            <div>
                <div className="todo-items">
                    {
                        this.unCompletedTodo.map((t:any)=><TodoItem
                            key={t.id} {...t}/>)
                    }
                </div>
                <div className="todo-items completed">
                    {
                        this.completedTodo.map((t:any)=><TodoItem
                            key={t.id} {...t}/>)
                    }
                </div>
            </div>
        );
        const {user} = this.state
        return (
            <div className="index-wrapper">
                <header>
                    <a className="logo">React-Tomato</a>
                    <Dropdown overlay={menu}>
                        <Button>
                            {user.account} <Icon type="down" />
                        </Button>
                    </Dropdown>
                </header>
                <main className="clearfix">
                    <div className="tomato-app-action">
                        <div className="tomatoes-outer">
                            <Tomatoes/>
                        </div>
                        <div className="todos-outer">
                            <TodoInput/>
                            {
                                this.props.todos.length > 0 ? content : <Empty text={"没有记录"}/>
                            }
                        </div>
                    </div>
                </main>
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
    initTodo
}
export  default connect(mapStateToProps,mapDispatchToProps)(Index)