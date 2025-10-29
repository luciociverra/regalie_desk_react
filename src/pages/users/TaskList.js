import React, { useState, useContext } from "react";
import "./MainPanel.css";
import { Button } from 'semantic-ui-react';
import {SessionContext} from "components/SessionContext";


export const TaskList = (props) => {

    const [error, setError] = useState("");
    const { isAuthorized} = useContext(SessionContext);

    const [filtraList,setFiltraList]=useState(
    [
        {id:'dosate_alcol',desc:'Dosate Alcol'},
        {id:'spezzatrice' ,desc:'Files spezzatrice'}
    ]
    );
    
    const goItem=(itemId)=>{
        props.setItem(itemId)
    }
    
    const btGo = (itemId) => {
        var isAuth=false;
        isAuth = itemId==="dosate_alcol" && isAuthorized("MNU_TASK_ALCOL");
        if(! isAuth) {
           isAuth = itemId==="spezzatrice"  && isAuthorized("MNU_TASK_SPEZZATRICE");
        }
        if(isAuth)
		  return <Button className="primary" size='mini' onClick={(e) => goItem(itemId)} style={{width:'100%'}}> Esegui</Button>
        return <Button className="disabled" size='mini'  style={{width:'100%'}}> Not avail.</Button>
    };
	
    return (
           <div className="divMain" style={{textAlign:'left',height:300,maxHeight:300,overflowY:'scoll',overflowX:'none', border: '0px solid blue'}}>
	  		<div style={{overflow:'auto',height:370, border: '0px solid red'}}>					
				<ul style={{listStyleType: "none",padding:0}}>
				{filtraList.length>0 && filtraList.map((item,index) => {
                            return (
                            <li key={index} className="liList">		
							<div className="divMain">
							<div className="divRow">
							<div className="divCell" style={{width:'80%'}}>{item.desc}</div>
							<div className="divCell" style={{width:'20%',textAlign:'center'}}>{btGo(item.id)}</div>
							</div>
							</div>
							</li>
							)
					  
                        })
                    }
				</ul>	
				</div><p>{error}</p>
               
				</div>
    );
};
