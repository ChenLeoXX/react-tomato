import {format, parseISO} from "date-fns";
import * as React from 'react'
import {connect} from "react-redux";
import {addTomato,initTomato,updateTomato} from "../../redux/actions/tomatoAction";
import TomatoAction from './TomatoAction'
import TomatoList from '../TomatoList/TomatoList'
import api from '../../config/axios'
import './tomatoes.scss'
import groupBy from 'lodash/groupBy'
interface PropsIF {
    addTomato:(payload:any)=>{};
    initTomato:(payload:any)=>{};
    updateTomato:(payload:any)=>{};
    tomatoes:any[];
}

interface StateIF {

}

class Tomatoes extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    componentDidMount() {
        this.getTomato()
    }
    getTomato = async ()=>{
        try {
            const {data:{resources},status}=  await api.get('tomatoes')
            if(status===200){
                this.props.initTomato(resources)
            }else{

            }
        }catch(e){
            throw new Error(e)
        }
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
                    <TomatoList tomatoObj={this.finishedTomato}/>
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
    initTomato,
    updateTomato
}
export  default connect(mapStateToProps,mapDispatchToProps)(Tomatoes)