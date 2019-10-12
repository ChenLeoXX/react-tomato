import * as React from 'react'
import api from '../../config/axios'
import {RouteComponentProps} from "react-router-dom";
import {Menu,Dropdown,Icon,Button,message} from "antd";
import TodoInput from '../TodoInput/TodoInput'
import TodoItem from '../TodoItem/TodoItem'
import './Index.scss'

interface PropsIF extends RouteComponentProps{

}

interface StateIF {
    user:any,
    todos:any[],
}

export default class Index extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            user:{},
            todos:[]
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
            this.setState({todos:newState})
        }catch(e){
            throw new Error(e)
        }
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

    addTodo = async (description:string)=>{
       try {
           const response = await  api.post('todos',{
               description
           })
           if(response.status === 200){
               const {todos} = this.state
               message.success('添加任务成功')
               //新添加的TODO添加到列表中
               this.setState({todos:[response.data.resource,...todos]})
           }else{
               message.success('添加失败')
           }
       }catch(e){
           throw new Error(e)
       }
    }

    toggleEdit = (id:number)=>{
        const {todos} = this.state
        const newState = todos.map((t:any)=>{
            if(t.id === id){
                return Object.assign({},t,{editing:true})
            } else{
                 t.editing = false
                return t
            }
        })
        this.setState({todos:newState})

    }

    updateItem = async (id:number,params:any)=>{
        const {todos} = this.state
        const response = await api.put(`todos/${id}`,params)
        if(response.status === 200){
            const newState = todos.map(t=>{
                if(t.id === id){
                    return response.data.resource
                }else{
                    return t
                }
            })
            this.setState({todos:newState})
        }else{
            message.error('更新错误')
        }
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
                <main>
                    <div className="todos-outer">
                        <TodoInput addTodo={(params:any)=>this.addTodo(params)} />
                        <div className="todo-items">
                            {
                                this.state.todos.map((t:any)=><TodoItem
                                    updateItem={this.updateItem}
                                    toggleEdit={this.toggleEdit}
                                    key={t.id} {...t}/>)
                            }
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}