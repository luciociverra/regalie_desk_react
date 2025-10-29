import React, { useState,useEffect, useRef } from "react";
import "./MainPanel.css";
import { Button } from 'semantic-ui-react';
import {apiRequest} from "api";


export const UserList = (props) => {
    const [error, setError] = useState("");
    const {forceReload}= props;
    const [filtraList,setFiltraList]=useState([]);
    const [list,setList]=useState([]);
    const [values, setValues] = useState({"id": null, "userName":"","userDesc":"", "statusActive": true, "roles": ""});
	
    useEffect(()=>{
		riceviDati();
    },[forceReload])

	useEffect(()=>{
		if (props.search) {
			setFiltraList(list.filter(
				(item) =>
				  item.full.toLowerCase().indexOf(props.search.toLocaleLowerCase()) > -1
			  ))
			} else {
				setFiltraList(list);				
			}
    },[props.search])

    const riceviDati = async() =>{
        const response = await apiRequest({
            method: "GET",
            url: "/userdata"
        });
        if (response.status !== 200) {
            setError('operazione fallita')
        }   else {
            setList(response.data);
            setFiltraList(response.data)
        }
    };

    const btSelect = (item) => {
		return <Button  className="primary"  size='mini' onClick={(e) => props.setItem(item)} style={{width:'100%'}}> Seleziona</Button>
    };

    return (

               <div className="divMain" style={{textAlign:'left',height:400,overflowY:'scoll',overflowX:'none', border: 'px solid blue'}}>
				<div style={{overflow:'auto',height:500, border: 'px solid red'}}>					
				<ul style={{listStyleType: "none",padding:0}}>
				{filtraList.length>0 && filtraList.map((item,index) => {
                            return (
                             <li key={index} className="liList">		
							<div className="divMain">
							<div className="divRow">

                            {!item.statusActive===true ? ( 
							<div className="divCell" style={{width:'80%', color: 'red'}}>{item.full}</div>
                            ) : (
                            <div className="divCell" style={{width:'80%'}}>{item.full}</div>
                            )} 

							<div className="divCell" style={{width:'20%',textAlign:'center'}}>{btSelect(item)}</div>
							</div>
							</div>
							</li>
							)
					  
                        })
                    }
				</ul>	
				</div>
			 </div>
     
    );
};
