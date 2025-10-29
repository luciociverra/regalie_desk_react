import React, { useState,useEffect, useContext } from "react";
import {SessionContext} from "components/SessionContext";
import "./MainPanel.css";
import { Button } from 'semantic-ui-react';
import {apiRequest,jAlert} from "api";


export const UserList = (props) => {
    const {sessionInfo} = useContext(SessionContext);
    const [error, setError] = useState("");
    const {forceReload,setTotals}= props;
    const [filtraList,setFiltraList]=useState([]);
    const [list,setList]=useState([]);
    const [values, setValues] = useState(
        {"id": null,
         "name": "",
         "surname":"", 
         "intPrefix": "",
         "contactPhone":"", 
         "homePhone":"",
         "email":"",
         "department": 0,
         "notes":"",
         "statusActive": true, 
         "roles": ""});
    useEffect(()=>{
          conteggioDipendenti();
        },[])

    useEffect(()=>{
		riceviDati();
        conteggioDipendenti();
    },[forceReload])

 

	useEffect(()=>{
		if (props.search) {
			setFiltraList(list.filter(
				(item) =>
				  item.fullName.toLowerCase().indexOf(props.search.toLocaleLowerCase()) > -1
			  ))
			} else {
				setFiltraList(list);				
			}
    },[props.search])

    const riceviDati = async() =>{
        const response = await apiRequest({
            method: "GET",
            user: sessionInfo.user,
            url: "/employee"
        });
        if (response.status !== 200) {
            setError('operazione fallita')
        }   else {
            setList(response.data);
            setFiltraList(response.data)
        }
    };

    const conteggioDipendenti = async() =>{
        setTotals(""); 
        const response = await apiRequest({
            method: "GET",
            user: sessionInfo.user,
            url: "/empsummary"
        });
        if (response.status === 200) {
             if(response.data.rc>0) {
                setTotals(response.data.msgOut)
             }
        }
    };

    const btSelect = (item) => {
		return <Button  className="primary"  size='mini' onClick={(e) => props.setItem(item)} style={{width:'100%'}}
        title={item.id}> Seleziona</Button>
    };

    return (
        <div className="divMain" style={{textAlign:'left',height:500,moverflowY:'scoll',overflowX:'none', border: 'px solid blue'}}>
        <div style={{overflow:'auto',height:'100%', border: 'px solid red'}}>					
        <ul style={{listStyleType: "none",padding:0}}>
        {filtraList.length>0 && filtraList.map((item,index) => {
                    return (
                        <li key={index} className="liList">		
                    <div className="divMain">
                    <div className="divRow">

                    {!item.statusActive===true ? ( 
                        <div className="divCell" style={{width:'60%', color: 'red'}} >{item.fullName}</div>
                    ) : (
                    <div className="divCell" style={{width:'60%'}}>{item.fullName}</div>
                    )} 
                    <div className="divCell" style={{width:'20%',textAlign:'center'}}>{item.contactPhone}</div>
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
