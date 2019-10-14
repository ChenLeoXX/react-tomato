import {INIT_TOMATO,ADD_TOMATO,UPDATE_TOMATO} from "../actionTypes";

export const addTomato = (payload:any)=>{
    return {
        type:ADD_TOMATO,
        payload
    }
}
export const initTomato = (payload:any)=>{
    return {
        type:INIT_TOMATO,
        payload
    }
}

export const updateTomato = (payload:any)=>{
    return {
        type:UPDATE_TOMATO,
        payload
    }
}