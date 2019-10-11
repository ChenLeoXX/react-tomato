import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";
import './App.scss';
import Index from './components/index/index'
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'

class App extends React.Component{
    render(){
        return(
            <Router>
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
