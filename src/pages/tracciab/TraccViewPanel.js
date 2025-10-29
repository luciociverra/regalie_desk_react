import React, {useState,useEffect} from "react";
import moment from "moment";
import { Button, Icon } from 'semantic-ui-react';
import "./OrderMainPanel.css";
import {apiRequest,jAlert,log} from "api";
import {Modal} from "semantic-ui-react";
 

import { MateriePrimeListView} from "./MateriePrimeListView";
export const TraccViewPanel = ({scheduler,reloadDesk}) => {
    // eventState0 l'intero oggetto da modificare
	const {eventState, overlayViewPanel, digitLavagna} = scheduler.state;
	const [error, setError] = useState("");
	const [resa,  setResa] = useState(0);
	const [qta,   setQta] = useState(0);
	const [qli,   setQli] = useState(0);
 	const [localLoading, setLocalLoading] = useState(false);
	const [countRef, setCountRef]= useState(0);
	const [notaHead, setNotaHead] = useState(eventState?.nota);
	const {	user } = scheduler.props;
  	useEffect(()=>{
	  if(eventState) {
		 setQta(eventState.qta);
	     log("TraccViewPanel.useEffect");
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
					alert(response.data.msgOut);
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
			overlayViewPanel: false, 
			eventState:undefined
		})
	}
	 
	const calculateHeight = () => {
        return 700; 
	};

	const drawLotto = () => {
		return (
			<div className="divLotto">
			    <div className="divLotto">
			     <div style={{display:"table-row",width:"100%"}}>
				  <div className="header" style={{display:"table-cell",width:'45%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  {eventState.id} {" - "} {eventState.title}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'20%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"CP :"} &nbsp; {eventState.cp} 
				 </div>
				 <div className="header" style={{display:"table-cell",width:'20%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"Lotto :"} &nbsp; {eventState.lotto}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'15%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {moment(eventState.start).format("DD-MM-YYYY")}
				 </div>
				</div>
				</div>
	
				<MateriePrimeListView 
				eventState={eventState} 
				countRef={countRef}  
				notaHead={notaHead} 
				digitLavagna={digitLavagna}
				setNotaHead={setNotaHead}
				localLoading={localLoading}
				setLocalLoading={setLocalLoading}
				setCountRef={setCountRef}
				mode="change"
				qta={qta}
				qli={qli}
				resa={resa}
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
		open={overlayViewPanel}
	   >
	   <div className="content" style={{backgroundColor:'white',height:calculateHeight()}}>
	   <div className="divLotto">
	   <div style={{display:"table-cell",width:'100%',textAlign:'center',vAlign:'top',height:50}}>
			 { (digitLavagna) &&
			  <Button  class="ui button"  disabled onClick={(event) => {
				  event.preventDefault()
				  event.stopPropagation()
				  noConfezionatoAction(); 
			  }} style={{marginRight:10, padding:0,width: 290, height: 50, color:'black',backgroundColor: "#e3eb7c"}}>
			 <Icon name='pencil' style={{color: 'black'}}/>Prodotto Impastato Non Confezionato</Button>
			 }
			 <Button class="ui button"  onClick={(event) => {
					 event.preventDefault()
					 event.stopPropagation()
					 closeOverlay(false);
			  }} style={{marginLeft:10, width: 120, height: 50, color:'white',backgroundColor: '#35150E', border: '1px solid black' }}>
			 <Icon name='close' style={{color: 'white'}}/>Annulla</Button>
		 </div>

		 <div style={{display:"table-row"}}>
					<div style={{display:"table-cell",height:30,width:'100%',textAlign:'center',padding:5}}>
						{ error!=="" &&
						<div style={{width:'100%',backgroundColor:'red',color: 'white',fontSize:'1.1em'}}>{error}</div>
						}
					</div>
		</div>		
</div>
				<div style={{display:"table",width:'100%',border:'1px solid black',	borderRadius:'4px'}}>
				
				<div style={{display:"table-cell",width:'100%',padding:5}}>
				{eventState && drawLotto()}
				</div>
				</div>
				
				
				 
				 
			 </div>
			
			</Modal>
		);
};
