import * as React from 'react'

interface PropsIF {
    p_points?:string
}

interface StateIF {
}

export default class Polygon extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    render() {
        return (
            <div className="polygon">
                <svg width={'100%'} height={'60px'}>
                    <polygon fill="rgba(24, 144, 255,0.1)" stroke="rgba(24, 144, 255,0.5)"
                             strokeWidth="1" points={this.props.p_points ?this.props.p_points : '0,60,319,60' }/>
                </svg>
            </div>
        );
    }
}