import {format, parseISO} from "date-fns";
import * as React from 'react'
import './TomatoList.scss'

interface PropsIF {
    tomatoObj:any
}

interface StateIF {

}

function TomatoItem(props:any){
    return (
        <div className="item-wrapper" key={props.id}>
          <span className="date-range">
              {
                  `${format(parseISO(props.created_at),'HH:mm')} - ${format(parseISO(props.ended_at),'HH:mm')}`
              }
          </span>
            <span className="item-description">
              {props.description}
          </span>
        </div>
    );
}

export default class TomatoList extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    dates(){
        return Object.keys(this.props.tomatoObj)
            .sort((a:string,b:string) => (+new Date(b) - +new Date(a)))
            .splice(0,3)
    }

    renderList(){
        return this.dates().map(d => {
            const dateTomatoes:any[] = this.props.tomatoObj[d]
            return (
                <div className="tomato-date-wrapper" key={d}>
                    <div className="title">
                        <span className="date">
                            {format(parseISO(d), 'M月dd日')}
                        </span>
                        <span className="counts">
                            {`完成了${dateTomatoes.length}个番茄`}
                        </span>
                    </div>
                    {
                        dateTomatoes.map(d => {
                            return <TomatoItem {...d}/>
                        })
                    }
                </div>
            );

        })
    }

    render() {
        const list = this.renderList()
        return (list)
    }
}