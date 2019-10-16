import * as React from 'react'

interface PropsIF {
    isLoading:boolean
}

const Loading:React.FC<PropsIF> = (props)=>{
    return  (
        props.isLoading?<div className="global-loading ">
            <div className="loading-img">
                <img src="assets/pomotodo-spinner.gif" alt=""/>
            </div>
        </div> :null
    )
}
export default Loading