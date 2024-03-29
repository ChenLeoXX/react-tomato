import * as React from "react";
const empty:React.FC<{text:string}>= (props:any)=>{
    return (
        <div className="empty-wrapper">
            <svg className=" empty-icon icon" aria-hidden="true">
                <use xlinkHref="#icon-correct"/>
            </svg>
            <p style={{marginTop:'16px',color:"#999",textAlign:"center"}}>{props.text}</p>
        </div>
    )
}
export default empty