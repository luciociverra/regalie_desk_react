import React, {useEffect,useState,useContext, createRef } from "react";
import {jAlert, jLog, log,apiRequest} from "api";
import { InputNumber } from 'primereact/inputnumber';
import "./OrderMainPanel.css";
import {SessionContext} from "components/SessionContext"; 
import LoadingOverlay from 'components/LoadingOverlay';
import { Input,Button,Icon } from 'semantic-ui-react';

export const MateriePrimeListView = ({eventState,notaHead,countRef,setCountRef,localLoading,setLocalLoading,qta,qli,resa,digitLavagna}) => {
	const {sessionInfo,isAuthorized} = useContext(SessionContext);
	const [countRows, setCountRows]= useState(0);
	const [matDetails, setMatDetails]= useState([]);
	const [selectedRow, setSelectedRow]= useState(null);
	const [showQli, setShowQli]= useState(true);
	
	useEffect(()=>{
		// chiamato su edit nota meccanco o riordino
		log("ordermeccanicolist-ridisegna");
		// totale righe meccanico editate
		let total = eventState.details.filter((elem => elem.riga>0));
	    if(eventState.groupId.toLowerCase()==="tortine e biscotti") setShowQli(false);
		setCountRows(total.length);
	},[countRef]);

 	const changeValueLotto = (item,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.codice === item.codice);
		elem.lotto_mat=aValue;
		areaUpdate={...areaUpdate,elem};
		setCountRef(countRef+1);
	};

	 
	 
	const formatIt = (qli)=>{
		return String(qli);
	}

	 
  
	const isSelect=(a,b)=>{
		if(a===b) return('rigaSelezionata');
		return "";   
    }

    return (
		<>
		<div className="divLotto" style={{height:40}}>
			<div style={{display:"table-row"}}>
			<div className="divCella" style={{width:'25%'}}>Quantità Lotti</div>
			<div className="divCella" style={{width:'5%',fontWeight:'bold'}}>{qta}</div>
			<div className="divCella" style={{width:'10%'}}>{showQli && 'QLI'}</div>
			<div className="divCella" style={{width:'10%',fontWeight:'bold',textAlign:'left'}}>{showQli && formatIt(qli)}</div>
			<div className="divCella" style={{width:'10%'}}>Resa</div>
			<div className="divCella" style={{width:'20%',fontWeight:'bold'}}>{resa}</div>
			<div className="divCella" style={{width:'20%'}}>Nota</div>
			<div className="divCella" style={{width:'50%'}}>{notaHead}</div>
			</div>
		</div>

		<div className="divLotto" 
				 style={{border:'1px solid lightgrey' ,textAlign:'left',height:490,
				 overflowY:'scoll',overflowX:'none'}}>
				<div style={{overflow:'auto',height:'100%'}}>	
				<div className="divLottoRow" style={{width: '100%',height:20 }}>
				    <div className="divCellaHeader" style={{width:'20%',textAlign:'center'}}>Cod.</div>
					<div className="divCellaHeader" style={{width:'35%'}}>Articolo</div>
					<div className="divCellaHeader" style={{width:'15%',textAlign:'center'}}>UM</div>
					<div className="divCellaHeader" style={{width:'15%',textAlign:'center'}}>Qta</div>
					<div className="divCellaHeader" style={{width:'35%', textAlign:'center'}}>Lotto</div>
					 
				</div>
				
				{   
				eventState.details.map(( item,index ) => {
				return (
				<div className={`divLottoRow`}   style={{display:"table-row"}} key={index}>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{item.codice}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{}}>{item.descrizione}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{item.um}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{item.consumo}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{item.lotto_mat}</div>
				</div>
				)
				}) //map
				}
				</div>
				{
					localLoading &&
					<div className="divLotto" >
			       	<div style={{display:"table-row"}}>
					<LoadingOverlay mode={'orange'} showTxt={"Loading ..."} />
					</div>
					</div>
				}
			</div>
			</>	
	);
};