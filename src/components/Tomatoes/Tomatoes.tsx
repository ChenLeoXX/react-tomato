import {format, parseISO} from "date-fns";
import * as React from 'react'
import {connect} from "react-redux";
import {addTomato,updateTomato} from "../../redux/actions/tomatoAction";
import TomatoAction from './TomatoAction'
import TomatoList from '../TomatoList/TomatoList'
import api from '../../config/axios'
import './tomatoes.scss'
import Empty from '../empty'
import groupBy from 'lodash/groupBy'
interface PropsIF {
    addTomato:(payload:any)=>{};
    updateTomato:(payload:any)=>{};
    tomatoes:any[];
}

interface StateIF {

}

class Tomatoes extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    addTomato = async ()=>{
        try {
            const {data:{resource},status} =  await api.post('tomatoes',{
                duration:1500000
            })
            if(status===200){
                this.props.addTomato(resource)
            }else{

            }
        }catch(e){
            throw new Error(e)
        }
    }

    updateTomato = async (params:any)=>{
        try {
            const {data:{resource}} = await api.put(`tomatoes/${this.unFinishTomato.id}`,params)
            this.props.updateTomato(resource)
        }catch(e){
            throw new Error(e)
        }
    }

    get unFinishTomato(){
        return this.props.tomatoes.filter(t=> !t.description && !t.ended_at && !t.aborted)[0]
    }

    get finishedTomato(){
        const list  = this.props.tomatoes.filter(t=>t.description &&t.ended_at && !t.aborted)
        return groupBy(list,(t)=>{
            return format(parseISO(t.started_at), 'yyyy-MM-dd')
        })
    }

    render() {
        return (
            <div className="tomatoes-wrapper">
                <TomatoAction addTomato={this.addTomato}
                              updateTomato={this.updateTomato}
                              unFinishTomato={this.unFinishTomato}/>
                <div className="tomato-lists">
                    <div className="child">
                        {
                            Object.keys(this.finishedTomato).length > 0 ?<TomatoList tomatoObj={this.finishedTomato}/> :<Empty text={'没有记录'}/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state:any,ownProps:object) => {
    return {
        tomatoes:state.tomatoes,
        ...ownProps
    }
}

const mapDispatchToProps = {
    addTomato,
    updateTomato
}
export  default connect(mapStateToProps,mapDispatchToProps)(Tomatoes)