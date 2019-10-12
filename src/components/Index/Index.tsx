import * as React from 'react'
import api from '../../config/axios'
import {RouteComponentProps} from "react-router-dom";
import {Menu,Dropdown,Icon,Button,message} from "antd";
import TodoInput from '../TodoInput/TodoInput'
import './Index.scss'

interface PropsIF extends RouteComponentProps{

}

interface StateIF {
    user:any
}

export default class Index extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            user:{}
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

    logout = ()=>{
        localStorage.setItem('token','')
        this.props.history.push('login')
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
               message.success('添加任务成功')
           }else{
               message.success('添加失败')
           }
       }catch(e){
           throw new Error(e)
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
                <main className="clocks-wrapper">
                    <TodoInput addTodo={this.addTodo} />
                </main>
            </div>
        );
    }
}