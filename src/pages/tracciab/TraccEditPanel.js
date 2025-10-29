import React, {useState,useMemo,useContext,useEffect,useRef} from "react";
import moment from "moment";
import { Button, Icon } from 'semantic-ui-react';
import "./OrderMainPanel.css";
import {apiRequest,jAlert,log} from "api";
import {Modal} from "semantic-ui-react";
 

import { MateriePrimeList} from "./MateriePrimeList";
export const TraccEditPanel = ({scheduler,reloadDesk}) => {
    // eventState0 l'intero oggetto da modificare
	const {eventState, overlayEditPanel, digitLavagna} = scheduler.state;
	const [error, setError] = useState("");
	const [resa,  setResa] = useState(0);
	const [qta,   setQta] = useState(0);
	const [qli,   setQli] = useState(0);
 	const [localLoading, setLocalLoading] = useState(false);
	const [countRef, setCountRef]= useState(0);
	const [notaHead, setNotaHead] = useState(eventState?.nota);
	const {	user } = scheduler.props;
 
	const deleteInfo ={
		lotto:"",
		articoli:[]	  
	}

	useEffect(()=>{
	  if(eventState) {
		 setQta(eventState.qta);
	     log("TraccEditPanel.useEffect");
		 setNotaHead(eventState.nota);
		}
	},[eventState])

	useEffect(()=>{
		if (qta && eventState?.resa){
			const qtaNum = parseFloat(qta);
			const qtaResa= (qtaNum * eventState.resa);
			qtaNum >0 &&  setResa(Math.floor(qtaResa));
			qtaNum >0 &&  changeQli(qtaNum);
		}
		if (qta==="" || qta==="0" ) {
			setResa("0");
			setQli("0")
		}		
    },[qta])

	const changeQli = () => {
		const qtaNum = parseFloat(qta);
		if(eventState?.tipologia.toLowerCase()==="ls") 
		   setQli(qtaNum * 2);
		else
		   setQli(qtaNum);
	};
	const creaCpAction=async ()=> {
		setError("");
		try {
		eventState.descrizione=eventState.title;	
		eventState.qta= String(eventState.qta).replace(',', '.');
		
		setLocalLoading(true);
	 	const response = await apiRequest({
					method: "POST",
					url: "/cpcreate",
					data: eventState,
					user: user,
				});
				setLocalLoading(false)
				if(parseInt(response.data.rc)===0) 
				{   log("tutto ok");
		  			closeOverlay(true);
				} else {
					alert("Attenzione operazione non conclusa possibile errore sui lotti imputati");
					closeOverlay(false);
				}
		}
		catch(e){}
		finally{ setLocalLoading(false); }
	}
 
	const noImpastatodAction=async ()=> {
		setError("");
		eventState.descrizione=eventState.title;
		try {
		setLocalLoading(true);
			const response = await apiRequest({
					method: "POST",
					url: "/tracc_noimp",
					data: eventState,
					user: user,
				});
				setLocalLoading(false)
				 
			if(parseInt(response.data.rc)===0) 
			  {
					log("tutto ok");
		  			closeOverlay(true);
			  } else {
					alert(response.data.msgOut);
					closeOverlay(false);
			  }

		}
		catch(e){}
		finally{ setLocalLoading(false); }
	}
	const noConfezionatoAction=async ()=> {
		setError("");
		try {
		eventState.descrizione=eventState.title;	
		setLocalLoading(true);
	 	const response = await apiRequest({
					method: "POST",
					url: "/tracc_noconf",
					data: eventState,
					user: user,
				});
				setLocalLoading(false)
				 
			if(parseInt(response.data.rc)===0) 
			  {
					log("tutto ok");
		  			closeOverlay(true);
			  } else {
					alert("Errore esecuzione non-confezionato: "+response.data.msgOut);
					closeOverlay(false);
			  }

		}
		catch(e){}
		finally{ setLocalLoading(false); }
	}

	const closeOverlay=(flagReload)=>{
	 
		setQta(0);
		setResa('');
		setError('');
		setTimeout(() => flagReload  && reloadDesk(), 1000);
		// annullo flag aperdura e struttura passata
	 	scheduler.setState({
			overlayEditPanel: false, 
			eventState:undefined
		})
	}
	
	const drawLotto = () => {
		return (
			<div className="divLotto">
			    <div className="divLotto">
			     <div style={{display:"table-row",width:"100%"}}>
				  <div className="header" style={{display:"table-cell",width:'65%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  {eventState.id} {" - "} {eventState.title}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'20%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"Lotto :"} &nbsp;{eventState.lotto}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'15%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {moment(eventState.start).format("DD-MM-YYYY")}
				 </div>
				</div>
				</div>
	
				<MateriePrimeList 
				eventState={eventState}  
				countRef={countRef} 
				setCountRef={setCountRef}
			    notaHead={notaHead} 
				digitLavagna={digitLavagna}
				setNotaHead={setNotaHead}
				localLoading={localLoading}
				setLocalLoading={setLocalLoading}
				qta={qta}
				qli={qli}
				resa={resa}
				user={user}
			  />
            </div>
			 			 
		);
	};


	return (
		<Modal 	className="desk-overlay-panel"
		// mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
		// !!!! tolgo per adattare la larghezza con i div size='small'
		onClose={()=>closeOverlay(false)}
		poppermodifiers={[
			{
				name: 'preventOverflow',
				options: {
					boundariesElement: "window"
				},
			} 
		]}
		open={overlayEditPanel}
	   >
	   <div className="content" style={{width:950,backgroundColor:'white',height:750}}>
	   <div style={{display:"table-cell",width:'100%',textAlign:'center',vAlign:'top',height:50}}>
				{ (digitLavagna && eventState?.cp==="") &&
				     <Button  className="ui button"  onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 creaCpAction(); 
					 }} style={{marginRight:30, padding:0,width: 120, height: 50, color:'black',backgroundColor: "#bad9d4"}}>
					<Icon name='pencil' style={{color: 'black'}}/>Crea CP</Button>
					}
                    { (digitLavagna  && eventState?.cp==="" ) &&
				     <Button  className="ui button"  onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 noImpastatodAction(); 
					 }} style={{marginRight:10, padding:0,width: 200, height: 50, color:'black',backgroundColor: "#0fad0c"}}>
					<Icon name='pencil' style={{color: 'black'}}/>Prodotto Non Impastato</Button>
					}
					{ (digitLavagna && eventState?.canDigit) &&
				     <Button  className="ui button"  disabled onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 noConfezionatoAction(); 
					 }} style={{marginRight:10, padding:0,width: 300, height: 50, color:'black',backgroundColor: "#e3eb7c"}}>
					<Icon name='pencil' style={{color: 'black'}}/>Prodotto Impastato Non Confezionato</Button>
					}
                    <Button className="ui button"  onClick={(event) => {
						    event.preventDefault()
							event.stopPropagation()
							closeOverlay(false);
					 }} style={{marginLeft:30, width: 130, height: 50, color:'white',backgroundColor: '#35150E', border: '1px solid black' }}>
					<Icon name='close' style={{color: 'white'}}/>Annulla</Button>
				</div>

				<div style={{display:"table-row"}}>
					<div style={{display:"table-cell",height:30,width:'100%',textAlign:'center',padding:5}}>
						{ error!=="" &&
						<div style={{width:'100%',backgroundColor:'red',color: 'white',fontSize:'1.1em'}}>{error}</div>
						}
					</div>
				</div>		

				<div style={{display:"table",width:'100%',border:'1px solid black',	borderRadius:'4px'}}>
				<div style={{display:"table-cell",width:'100%',padding:5}}>{eventState && drawLotto()}</div>
				</div>
				<div className="divLotto">
			  </div>
			 </div>
			</Modal>
		);
};
