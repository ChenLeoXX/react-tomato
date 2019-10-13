import {INIT_TOMATO, ADD_TOMATO} from "../actionTypes";

interface ActionIF {
    type:String,
    payload:any
}

export default (state:any[]=[],action:ActionIF) =>{
    switch (action.type) {
        case ADD_TOMATO:
            return [action.payload,...state]
        case INIT_TOMATO:
            return [...action.payload]
        default:
            return state
    }
}