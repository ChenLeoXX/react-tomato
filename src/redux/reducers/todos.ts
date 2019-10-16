import {INIT_TODO,EDIT_TODO,ADD_TODO,UPDATE_TODO} from "../actionTypes";

interface ActionIF {
    type:String,
    payload:any
}
export default (state:any[]=[],action:ActionIF) =>{
    switch (action.type) {
        case ADD_TODO:
            return [action.payload,...state]
        case INIT_TODO:
            return [...action.payload]
        case EDIT_TODO:
            return state.map(t=>{
                if(t.id === action.payload){
                    return Object.assign({},t,{editing:true})
                }else{
                    return Object.assign({},t,{editing:false})
                }
            })
        case UPDATE_TODO:
            return state.map(t=>{
                if(t.id === action.payload.id){
                    return action.payload
                }else{
                    return t
                }
            })
        default:
            return state
    }
}