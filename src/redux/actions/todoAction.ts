import {INIT_TODO,ADD_TODO,UPDATE_TODO,EDIT_TODO} from "../actionTypes";
export const addTodo = (payload:object)=>{
    return {
        type:ADD_TODO,
        payload
    }
}
export const initTodo = (payload:any[])=>{
    return {
        type:INIT_TODO,
        payload
    }
}

export const updateItem = (payload:any[])=>{
    return {
        type:UPDATE_TODO,
        payload
    }
}

export const toggleEdit = (payload:number)=>{
    return {
        type:EDIT_TODO,
        payload
    }
}