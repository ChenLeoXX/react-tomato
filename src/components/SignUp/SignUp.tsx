import * as React from 'react';
import { Input, Icon,Button ,message} from 'antd';
import {Link} from 'react-router-dom'
import api from '../../config/axios'
import './SignUp.scss'
import logo from '../../pomotodo_cn.png';
interface PropsIF {

}

interface StateIF {
    account:String,
    password:String,
    passwordConfirmation:String
}

export default class SignUp extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
        this.state = {
            account:'',
            password:'',
            passwordConfirmation:''
        }
    }
    onAccountChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({account:e.target.value})
    }
    onPasswordChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({password:e.target.value})
    }
    onConfirmChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({passwordConfirmation:e.target.value})
    }
    signUp = async ()=>{
        const {account,password,passwordConfirmation} = this.state
            try {
                await api.post('/sign_up/user',{
                    password_confirmation:passwordConfirmation,
                    account,
                    password,
                }).then(res=> {
                    if (res.status === 200) {
                        message.success('注册成功')
                    }
                })
            }catch (e) {
                let errMsg = e.response.data.errors
                if(errMsg['account']){
                    message.error(`account ${errMsg['account'][0]}`)
                }else if(errMsg['password']){
                    message.error(`password ${errMsg['account'][0]}`)
                }else{
                    message.error(`password ${errMsg['password_confirmation'][0]}`)
                }
            }

    }
    validate = ()=>{
        const {password,passwordConfirmation} = this.state
        if(passwordConfirmation === password){
            this.signUp()
        }else{
            message.error('两次输入密码不一致,请重新输入')
        }
    }
    render() {
        return (
            <div id="sign-up">
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>
                <h1>注册</h1>
                <Input
                    placeholder="输入账号"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={this.onAccountChange}
                    allowClear
                />
                <Input.Password placeholder="输入密码"  onChange={this.onPasswordChange}/>
                <Input.Password placeholder="确认密码" onChange={this.onConfirmChange}/>
                <Button onClick={this.validate} type="danger" size='large'>注册</Button>
                <p className='tip'>如果你已有账号，可立即<Link to='login'>登录</Link></p>
            </div>
        );
    }
}