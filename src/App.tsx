import * as React from 'react';
import {
    Router,
    Route,
} from "react-router-dom";
import  History from './config/history'
import './App.scss';
import Index from './components/Index/Index'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'

class App extends React.Component{
    render(){
        return(
            <Router history={History}>
                <div>
                    <Route path="/" exact={true} component={Index}/>
                    <Route path="/signUp" component={SignUp}/>
                    <Route path="/login" component={Login}/>
                </div>
            </Router>
        )
    }
}

export default App;
