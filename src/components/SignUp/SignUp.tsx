import * as React from 'react';
import { Input, Icon,Button ,message} from 'antd';
import api from '../../config/axios'
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
        try{
            await api.post('/sign_up/user',{
                password_confirmation:passwordConfirmation,
                account,
                password,
            }).then(res=>{
                if(res.status === 200){
                    message.success('注册成功')
                }else{
                    message.error('注册成功')
                }
            })
        }catch (e) {
            throw new Error(e)
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
            <div className={'sign-up'}>
                <Input
                    placeholder="输入账号"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={this.onAccountChange}
                    allowClear
                />
                <Input.Password placeholder="输入密码"  onChange={this.onPasswordChange}/>
                <Input.Password placeholder="确认密码" onChange={this.onConfirmChange}/>
                <Button onClick={this.validate}>注册</Button>
            </div>
        );
    }
}