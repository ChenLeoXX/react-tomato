import * as React from 'react'
import {connect} from "react-redux";
import {addTomato,initTomato} from "../../redux/actions/tomatoAction";
import TomatoAction from './TomatoAction'
import api from '../../config/axios'
interface PropsIF {
    addTomato:(payload:any)=>{};
    initTomato:(payload:any)=>{};
}

interface StateIF {

}

class Tomatoes extends React.Component<PropsIF, StateIF> {
    constructor(props: PropsIF) {
        super(props)
    }

    componentWillMount() {
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
                duration:150000
            })
            console.log(resource)
            if(status===200){
                this.props.addTomato(resource)
            }else{

            }
        }catch(e){
            throw new Error(e)
        }
    }

    render() {
        return (
            <div className="tomatoes-wrapper">
                <TomatoAction addTomato={this.addTomato}/>
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
    initTomato
}
export  default connect(mapStateToProps,mapDispatchToProps)(Tomatoes)