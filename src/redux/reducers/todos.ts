import {INIT_TODO,EDIT_TODO,ADD_TODO} from "../actionTypes";

interface ActionIF {
    type:String,
    payload:any
}
export default (state:any[]=[],action:ActionIF) =>{
    switch (action.type) {
        case ADD_TODO:
            return [action.payload,...state]
        case INIT_TODO:
            return [action.payload]
        case EDIT_TODO:
            return [action.payload,...state]
        default:
            return state
    }
}