import React, {useState,useMemo,useContext,useEffect,useRef} from "react";
import moment from "moment";
import { Button, Icon,Dropdown } from 'semantic-ui-react';
import "./OrderMainPanel.css";
import {apiRequest,jAlert,log,jLog} from "api";
import {mustControlQta,calcolaQtaCoeff} from "./CommonFunc";
import {Modal} from "semantic-ui-react";
import Utils from "./Utils";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import ColorPick from "./generalComponents/ColorPick";
import { OrderMeccanicoList } from "./OrderMeccanicoList";
export const OrderEditPanel = ({scheduler,reloadDesk,movePanelTo,colorChange,colorReset}) => {
    // eventState0 l'intero oggetto da modificare
	const {eventState, overlayEditPanel, digitLavagna} = scheduler.state;
	const [error, setError] = useState("");
	const [resa,  setResa] = useState(0);
	const [qta,   setQta] = useState(0);
	const [qli,   setQli] = useState(0);
 	const [localLoading, setLocalLoading] = useState(false);
	const [countRef, setCountRef]= useState(0);
	const [notaHead, setNotaHead] = useState(eventState?.nota);
	const [listaLotti,setListaLotti]=useState([]);
	const {	user } = scheduler.props;

	const deleteInfo ={
		lotto:"",
		articolo: "",
		articoli:[]	  
	}

	useEffect(()=>{
	  if(eventState) {
		 setQta(eventState.qta);
		// jAlert(eventState.details);
	     log("OrdetEditPanel.useEffect");
		 setNotaHead(eventState.nota);
		}
	},[eventState])

	useEffect(()=>{
		if (qta && eventState?.resa){
			const qtaNum = parseFloat(qta);
			const qtaResa= (qtaNum * eventState.resa);
			qtaNum >0 && setResa(Math.floor(qtaResa));
			qtaNum >0 &&  changeQli(qtaNum);
			setListaLotti(optionsList());
		}
		if (qta==="" || qta==="0" ) {
			setResa("0");
			setQli("0")
		}		
    },[qta])

		 
	const changeQtaLotto = (aValue) => {
		setQta(aValue)
};

    useEffect(()=>{
		log("OrderEditPanel.js use effects - resa: "+ resa);
		if (resa>0 && eventState.details ) {
			if(eventState.details.length) {
			if (eventState.details.length===1) {
				changeValue(0, resa)
				setCountRef(countRef+1)
			}
		}
		} 
    },[resa])

	const changeValue = (index,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === index);
        elem.qta=parseInt(aValue);
		areaUpdate={...areaUpdate,elem};
	};
	const optionsList=()=> {
		const date_today  = moment().format('YYYY-MM-DD');
		const currentYear_today = moment().format('YYYY');
		const weekNumber_today  = moment(date_today).isoWeeks();
		
		const date  = moment(eventState.data).format('YYYY-MM-DD'); // dato del lotto che devo spostare
	    const currentYear = moment(eventState.data).format('YYYY');
	    const weekNumber = moment(date).isoWeeks();
		let allDates=Utils.nextTwoWeek(eventState.lotto,weekNumber_today,currentYear_today);
		// Array fatto lotto e data
		const yearsOption=[];
		yearsOption.push({key:"", value: "lotto  -  data",text: "lotto  -  data" });
		allDates.map((el, i) => {
			yearsOption.push({key:el, value: String(el[0]+" "+el[1]),text: String(el[0]+" - "+el[1]) });
		 });
	   return yearsOption;
	 }
	const changeQli = () => {
		const qtaNum = parseFloat(qta);
		if(eventState?.tipologia.toLowerCase()==="ls") 
		   setQli(qtaNum * 2);
		else
		   setQli(qtaNum);
	};

	const changeOrdAction=async ()=> {
		setError("");
		try {
		const returnControls= await calculateValue();
		//eventState.nota=notaHead; 
		//jAlert(eventState);
		if(returnControls)
		{
			setLocalLoading(true);
			eventState.qta= String(eventState.qta).replace(',', '.');
			eventState.nota=notaHead;
			//const respDelete=await deleteAction();
            
		 	const response = await apiRequest({
					method: "POST",
				 	url: "/pochange",
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
	}
		catch(e){}
		finally{ setLocalLoading(false); }
	}

    const deleteAction=async()=> {
		try
		{ 
	    deleteInfo.lotto=eventState.lotto;
	    let arr=[];
		arr.push(eventState.id);
	    eventState.details.map((item) => {arr.push(item.codice)});
	    deleteInfo.articoli=arr;
		const response = await apiRequest({
			method: "DELETE",
			url: "/podelete",
			data: deleteInfo,
			user: user,
		});
		return response;
	}
	catch(e){ alert("deleteAction:"+e)}
	}
	const deleteOrdAction=async ()=> {
		setError("");
		try {
		if(window.confirm('Sei sicuro di voler cancellare?'))
		{
			setLocalLoading(true);
			const response = await deleteAction();
			//jAlert(response.data);
			setLocalLoading(false)
			if(parseInt(response.data.rc)===0) 
			{
				log("tutto ok");
		  		closeOverlay(true);
			} else {
				alert(response.data.msgOut);
				closeOverlay(false);
			}
		}}
		catch(e){ alert("deleteOrdAction:"+e)}
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
	const handleMove = (e, data) => {
		if(data.value.length<15) return; 
		const myArray = data.value.split(" ");
	 	const lottoDest=myArray[0];
		const dataDest=moment(myArray[1],"DD/MM/YYYY").format("YYYY-MM-DD 00:00:00");
		setQta(0);
		setResa('');
		setError('');
		setTimeout(() => movePanelTo(eventState,eventState.data,dataDest,lottoDest), 1000);
	 	scheduler.setState({ overlayEditPanel: false});
    };
	
	const colorChangeLoc = async (bg_color,fg_color) => {
		colorChange(eventState.lotto,eventState.resourceId,bg_color,fg_color);
	};
	const colorResetLoc = async () => {
		colorReset(eventState.lotto,eventState.resourceId);
	}; 
	const calculateHeight = () => {
        return 710; 
	};
	const pkDateChange = (event, data) => {
	    if(data.value) 
		{
		   var dataDest=moment(data.value,"DD/MM/YYYY").format("YYYY-MM-DD 00:00:00");   
		   var lottoDest=Utils.lottoFromDate(data.value);
		   var now = moment();
		   if(! now.isBefore(moment(data.value)))
		   {
			  alert("Data non valida"); return;
		   }
            
		   setQta(0);
		   setResa('');
		   setError('');
		   setTimeout(() => movePanelTo(eventState,eventState.data,dataDest,lottoDest), 1000);
	 	   scheduler.setState({ overlayEditPanel: false});
		}
	}

	const calculateValue = async () => {
		if(qta===0)
		{
			setError("Quantità da produrre non specificata");
			return false;
		}
		if(resa===0)
		{
			setError("Resa non disponibile");
			return false;
		}
		let total = eventState.details.reduce((previous, next) => {
			return previous + calcolaQtaCoeff(next);
		}, 0);
		if(total===0)
		{
			setError("Quantità meccanico da produrre non specificata");
			return false;
		}
		if(mustControlQta(eventState.id,eventState.title))
		{  
			if(total !== resa)
			{
				setError("La somma delle quantità ("+total+") non coincide con la produzione: "+resa);
				return false;
			}
	    }
		eventState.qta=qta;
		return true;
	};
	 
	const drawLotto = (headerTitle) => {
		return (
			<div className="divLotto">
			    <div className="divLotto">
			     <div style={{display:"table-row",width:"100%"}}>
				  <div className="header" style={{display:"table-cell",width:'40%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  {eventState.id} {" - "} {eventState.title}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'20%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"CP :"} &nbsp; {eventState.cp}
				 </div>
				 
				 <div className="header" style={{display:"table-cell",width:'20%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"Lotto :"} &nbsp; {eventState.lotto}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'20%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {moment(eventState.data).format("DD-MM-YYYY")}
				 </div>
				</div>
				</div>
	
				<OrderMeccanicoList eventState={eventState} countRef={countRef}  
				notaHead={notaHead} 
				digitLavagna={digitLavagna}
				setNotaHead={setNotaHead}
				localLoading={localLoading}
				setLocalLoading={setLocalLoading}
				setCountRef={setCountRef}
				mode="change"
				changeQtaLotto={changeQtaLotto}
				qta={qta}
				qli={qli}
				resa={resa}
			  />
            </div>
			 			 
		);
	};

	
	

	return (
		<Modal 	className="desk-overlay-panel"
		//mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
		size='small'
		onClose={()=>closeOverlay(false)}
		popperModifiers={[
			{
				name: 'preventOverflow',
				options: {
					boundariesElement: "window"
				},
			} 
		]}
		open={overlayEditPanel}
	   >
	   <div className="content" style={{backgroundColor:'white',height:calculateHeight()}}>
	           
	           { (digitLavagna) &&
				     <div style={{position:'absolute',top:25,left:40}}>  
					 <ColorPick  colorChange={colorChangeLoc} colorReset={colorResetLoc}/></div>
     				}
				<div className="divLotto">
				
						
				 
				<div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5,border:'0px solid red'}}>
				   
                    { (digitLavagna && eventState?.canDigit) &&
				     <Button  className="ui button"  onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()  
						 changeOrdAction(); 
					 }} style={{marginRight:30, width: 120, height: 35, color:'black',backgroundColor: "#0fad0c"}}>
					<Icon name='pencil' style={{color: 'black'}}/>Modifica</Button>
					}
                    { (digitLavagna && eventState?.canDigit) &&
					<Button className="ui button"   onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 deleteOrdAction(); 
					 }} style={{marginRight:20, width: 120, height: 35,  color:'black',backgroundColor: '#d9eb3b', }}>
					 <Icon name='trash alternate' style={{color: 'black'}}/>Elimina
					 </Button>
					}
                    
					{ (digitLavagna && eventState?.canDigit) &&
				     <Dropdown text='Muovi' icon='exchange' 
					    floating labeled button className='icon' 
    					options={listaLotti}
						onChange={handleMove} 
						defaultValue="xxxxxx"
						/>
					}
					{ (digitLavagna && eventState?.canDigit) &&
					   <SemanticDatepicker icon='calendar' iconPosition='left' 
					    showToday='true' style='maxWidth:100px'
					    format='DD-MM-YYYY' locale="it-IT" onChange={pkDateChange} />	
					}
					<Button class="ui button"  onClick={(event) => {
						    event.preventDefault()
							event.stopPropagation()
							closeOverlay(false);
					 }} style={{marginLeft:10, width: 120, height: 35, color:'white',backgroundColor: '#35150E', border: '1px solid black' }}>
					<Icon name='close' style={{color: 'white'}}/>Annulla
					</Button>
				</div>

				<div style={{display:"table-row"}}>
					<div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5}}>
						{ error!=="" &&
						<div style={{width:'100%',backgroundColor:'red',color: 'white',fontSize:'1.1em'}}>{error}</div>
						}
					</div>
				</div>	

				<div style={{display:"table",width:'100%',border:'1px solid black',	borderRadius:'4px'}}>
				
				<div style={{display:"table-cell",width:'100%',padding:5}}>
				{eventState && drawLotto()}
				</div>
				</div>
				</div>
				<div style={{display:"table-row"}}>
				    <div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5}}>
				    </div>	
				</div>
			 </div>
			
			</Modal>
		);
};
 