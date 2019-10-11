import * as React from 'react'

interface PropsIF {

}

interface StateIF {

}

export default class Login extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    render() {
        return (
            <h2>Login</h2>
        );
    }
}