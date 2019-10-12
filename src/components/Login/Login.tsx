import * as React from 'react';
import { Input, Icon,Button ,message} from 'antd';
import {Link, RouteComponentProps} from 'react-router-dom'
import api from '../../config/axios'
import '../SignUp/SignUp.scss'
import logo from '../../pomotodo_cn.png';
interface PropsIF extends RouteComponentProps<any>{

}
interface StateIF {
    account:String,
    password:String,
}

export default class SignUp extends React.Component<PropsIF, StateIF> {
    constructor(props:PropsIF) {
        super(props)
        this.state = {
            account:'',
            password:'',
        }
    }
    onInputChange = (key:keyof StateIF,e:React.ChangeEvent<HTMLInputElement>)=>{
        const newState = {}
        newState[key] = e.target.value
        this.setState(newState)
    }

    onKeyUp = (e:React.KeyboardEvent)=>{
        if(e.keyCode === 13){
            this.signUp()
        }
    }

    signUp = async ()=>{
        const {account,password} = this.state
            try {
                await api.post('/sign_in/user',{
                    account,
                    password,
                }).then(res=> {
                    if (res.status === 200) {
                        message.success('登录成功')
                        this.props.history.push('/')
                    }
                })
            }catch (e) {
                let errMsg = e.response.data.errors
                if(errMsg){
                    message.error(errMsg)
                }
            }
    }
    validate = ()=>{
        this.signUp()
    }
    render() {
        return (
            <div id="sign-up">
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>
                <h1>登录</h1>
                <Input
                    placeholder="输入账号"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={(e)=>this.onInputChange('account',e)}
                    allowClear
                />
                <Input.Password placeholder="输入密码"
                                onKeyUp={e=>this.onKeyUp(e)}
                                onChange={(e)=>this.onInputChange('password',e)}/>
                <Button onClick={this.validate} type="danger" size='large'>登录</Button>
                <p className='tip'>还没有账号？立即<Link to='signUp'>注册</Link></p>
            </div>
        );
    }
}