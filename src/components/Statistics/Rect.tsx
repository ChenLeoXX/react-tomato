import * as React from 'react'

interface PropsIF {
    weeklyTomato:any[]
}

interface StateIF {

}

export default class Rect extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }
    
    get calcSvg(){
        let weekTotal:number = 0
        let heightArr:number[]= []
            this.props.weeklyTomato.forEach((t)=>{
            if(t !== 'undefined'){
                weekTotal += t.length
            }
        })
         this.props.weeklyTomato.forEach(t=>{
            if(t !== 'undefined'){
                heightArr.push(t.length / weekTotal*60)
            }else{
                heightArr.push(1)
            }
        })
        return heightArr
    }
    
    render() {
        const baseX = 104.39
        return (
            <div className="rect">
                <svg width={'100%'} height={'60px'}>
                    {
                        this.props.weeklyTomato.map((t,ind)=>{
                            return (
                                <rect width="16px" height={`${this.calcSvg[ind]}px`} y={60 - this.calcSvg[ind]} x={baseX+(ind*30)} fill="rgba(215,78,78,.5)" key={ind}>

                                </rect>
                            );
                        })
                    }
                </svg>
            </div>
        );
    }
}