import {INIT_TODO,ADD_TODO} from "./actionTypes";
export const addTodo = (payload:any)=>{
    return {
        type:ADD_TODO,
        payload
    }
}
export const initTodo = (payload:any)=>{
    return {
        type:INIT_TODO,
        payload
    }
}