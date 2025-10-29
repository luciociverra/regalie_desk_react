import React, {useState,useEffect} from "react";
import moment from "moment";
import { InputNumber } from 'primereact/inputnumber';
import {Button, Icon} from "semantic-ui-react";
import "./OrderMainPanel.css";
import {apiRequest,jAlert,log} from "api";
import {mustControlQta,calcolaQtaCoeff} from "./CommonFunc";
import {Modal} from "semantic-ui-react";
import LoadingOverlay from 'components/LoadingOverlay';
import { OrderMeccanicoList } from "./OrderMeccanicoList";
 
export const OrderMovePanel = ({scheduler,reloadDesk}) => {
	//       precedente    prossimo
	const { lastEventState,eventState,overlayMovePanel,foundInWeek} = scheduler.state;
	const [error, setError] = useState("");
	const [resaSx, setResaSx] = useState(0);
	const [resa, setResa] = useState(0);
	const [qtaSx, setQtaSx] = useState(0);
	const [qtaDx, setQtaDx] = useState(0);
	const [qliSx, setQliSx] = useState(0);
	const [qli, setQli] = useState(0);
	const [localLoading, setLocalLoading] = useState(false);
	const [notaHead, setNotaHead] = useState("");
	const [notaHeadSx, setNotaHeadSx] = useState("");
	const [countRef, setCountRef]= useState(0);
	const [showQli, setShowQli]= useState(true);
	const {	user } = scheduler.props;
	const deleteInfo ={
		lotto:"",
		articoli:[]	  
	}
	useEffect(()=>{ 
		if(eventState  && lastEventState) {	 
			setNotaHead(eventState.nota)
			setNotaHeadSx(eventState.nota);
			setQtaSx(lastEventState.qta)
			setQtaDx(eventState.qta)
			setResaSx(lastEventState.qta * eventState.resa);
			setResa(eventState.qta * eventState.resa);
			if(eventState.groupId.toLowerCase()==="tortine e biscotti") setShowQli(false);
			changeQliSx();
		}
	
	},[eventState])

	useEffect(()=>{
		if (qtaDx && eventState?.resa){
			const qtaNum = parseFloat(String(qtaDx));
			//const qtaNum = parseFloat(String(qtaDx).replaceAll(',', '.'));
		
			const qtaResa= (qtaNum * eventState.resa);
			qtaNum >0 && setResa(Math.floor(qtaResa));
			qtaNum >0 &&  changeQli(qtaNum);
		}
		if (qtaDx==="" || qtaDx==="0" ) {
			setResa("0");
			setQli("0")
		}
	},[qtaDx])

	useEffect(()=>{
		log("use effects - resa: "+ resa);
		if (resa>0 && eventState.details ) {
			if(eventState.details.length) {
			if (eventState.details.length===1) {
				changeValue(0, resa)
				setCountRef(countRef+1)
			}
		}
		} 
    },[resa])

	const changeQtaLotto = (aValue) => {
		setQtaDx(aValue);
	
	};

	const changeValue = (index,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === index);
        elem.qta=parseInt(aValue);
		areaUpdate={...areaUpdate,elem};
	};

	const changeQliSx = () => {
		const qtaSx = parseFloat(String(qtaSx));
		if(eventState?.tipologia.toLowerCase()==="ls") 
		   setQliSx(qtaSx * 2);
		else
		   setQliSx(qtaSx);
	};
	const changeQli = () => {
		const qtaDxNum = parseFloat(String(qtaDx));
		if(eventState?.tipologia.toLowerCase()==="ls") 
		   setQli(qtaDxNum * 2);
		else
		   setQli(qtaDxNum);
	};


	const changeOrdAction=async ()=> {

		setError("");
		try {
		const returnControls= await calculateValue();
	 
	 	if(returnControls)
		{
			setLocalLoading(true);
			if(foundInWeek){
			   const respDelete=await deleteTarget();
			}
			eventState.nota=notaHead;
			eventState.qta= String(eventState.qta).replace(',', '.');
			const response = await apiRequest({
					method: "POST",
					url: "/pocreate",
					data: eventState,
					user: user,
				});
				
				if(parseInt(response.data.rc)===0) 
				{
					log("tutto ok-elimino partenza");
					const respDelete=await deleteAction();
					setLocalLoading(false);
		  			if(respDelete.data.rc==="1") {
						alert("Attenzione OI originale non eliminato !");
					}
					closeOverlay(true);
				} else {
					setLocalLoading(false);
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
	    deleteInfo.lotto=lastEventState.lotto;
	    let arr=[];
		arr.push(lastEventState.id); // codice principale + meccanici
	    lastEventState.details.map((item) => {arr.push(item.codice)});
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
	const deleteTarget=async()=> {
		try
		{ 
	    deleteInfo.lotto=eventState.lotto;
	    let arr=[];
		arr.push(eventState.codice);
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
	catch(e){ 
		alert("delete target Action:"+e +" consultare l'assistenza ");
    }
	}

	const closeOverlay=(flagReload)=>{
		setQtaDx(0);
		setResa('');
		setError('');
		setTimeout(() => flagReload  && reloadDesk(), 1000);
		// annullo flag aperdura e struttura passata
	 	scheduler.setState({
			overlayMovePanel: false, 
			eventState:undefined,
			lastEventState:undefined
		})
	}
	

	const getData = (event) => {
		 return moment(event.data).format("DD-MM-YYYY")
	};
	const getNewData = () => {
		return moment(eventState.data).format("DD-MM-YYYY")
   };
	const calculateHeight = () => {
	    return 730; 
	};
	const calculateValue = async () => {
		if(qtaDx===0)
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
		if(mustControlQta(eventState.codice,eventState.title))
		{  
			if(total !== resa)
			{
				setError("La somma delle quantità ("+total+") non coincide con la produzione: "+resa);
				return false;
			}
	    }
		eventState.qta=qtaDx;
		return true;
	};
	const qtaEditor = (item) => {
        return <InputNumber small value={item.qta} onChange={(e) => changeValue(item.index,e.value)} mode="decimal" />
    }
	 
	
	const drawLottoDisabled = () => {
		return (
			<div className="divLotto">
			    <div className="divLotto">

			    <div style={{display:"table-row",width:"100%"}}>
				  <div className="header" style={{display:"table-cell",padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  Ordine originario (verra' eliminato) 
				</div>
				</div>
				</div>

				<div className="divLotto">
				  <div style={{display:"table-row"}}>
					<div className="divCella" style={{width:'50%'}}>
				    {getData(lastEventState)}
					</div>
					<div className="divCella" style={{backgroundColor:'',width:'50%'}}>
				   {"Lotto :"} &nbsp; {lastEventState.lotto}
					</div>
				  </div>
			    </div>

				<div className="divLotto">
				  <div style={{display:"table-row"}}>
					<div className="divCella" style={{width:'100%'}}>
				    {lastEventState.id} {" - "} {lastEventState.title}
					</div>
				  </div>
			    </div>

				<div className="divLotto">
				  <div style={{display:"table-row"}}>
					<div className="divCella" style={{width:100}}>Quantità Lotti</div>
					 
					<div className="divCella" style={{width:200}}>Resa</div>
				  </div>
				  <div style={{display:"table-row",height:45}}>
					<div className="divCella" >
					<span style={{width:40,paddingLeft:10,paddingRight:10,fontWeight:'bold',textAlign:'center'}}>{qtaSx}</span>
                    </div>
					 
					<div className="divCella">{resaSx}</div>
				</div>
				<div style={{display:"table-row"}}>
				 <div className="divCella" style={{width:'10%',paddingLeft:10}}>Nota</div>
			  	 <div className="divCella" style={{width:'90%',textAlign:'left'}}>{notaHeadSx}</div>
			     </div>
		        </div>
				
				<div className="divLotto">
				<div style={{display:"table-row"}}>
				<div className="divCellaHeader" style={{width:'50%'}}>Articolo</div>
				<div className="divCellaHeader" style={{width:'15%',textAlign:'center'}}>Qta</div>
				<div className="divCellaHeader" style={{width:'20%',textAlign:'center'}}>Data rottura</div>
				</div>
                 {     
                        lastEventState.details && lastEventState.details.length &&
						lastEventState.details.map((item,index) => {
							if(item.qta>0) {
                            return (
							<div style={{display:"table-row"}} key={index}>
							<div className="divCellaRow" style={{width:'50%'}}>{item.codice} {item.descrizione}</div>
							<div className="divCellaRow" style={{width:'15%',textAlign:'center'}}>{item.qta}</div>
							<div className="divCellaRow" style={{width:'20%',textAlign:'center'}}>{item.data_rottura}</div>
							</div>
				           )
						}
				  })
                    }
                </div>
            </div>
			 			 
		);
	};

	const drawLotto = () => {
		return (
			<div className="divLotto">
			    <div className="divLotto">

			    <div style={{display:"table-row",width:"100%"}}>
				<div className="header" style={{display:"table-cell",width:'50%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  {eventState.codice} {" - "} {lastEventState.title}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'25%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"Lotto :"} &nbsp; {eventState.lotto}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'25%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {getNewData()}
				 </div>
				</div>
				</div>
          
				<OrderMeccanicoList eventState={eventState} countRef={countRef}  
				notaHead={notaHead} 
				foundInWeek={foundInWeek}
				setNotaHead={setNotaHead}
				localLoading={false} /** lo gestisco in questa pagina*/
				setLocalLoading={setLocalLoading}
				setCountRef={setCountRef}
				changeQtaLotto={changeQtaLotto}
				digitLavagna={true}
				qta={qtaDx}
				qli={qli}
				resa={resa}
			  />
				
            </div>
			 			 
		);
	};




	return (
		<Modal 	className="desk-overlay-panel"  
		//mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
		size='large'
		onClose={()=>closeOverlay()}
		poppermodifiers={[
			{
				name: 'preventOverflow',
				options: {
					boundariesElement: "window"
				},
			} 
		]}
		open={overlayMovePanel}
	   >
			<div className="content" style={{backgroundColor:'white',height:calculateHeight()}}>
			 
				<div style={{display:"table",width:'100%',border:'1px solid black',	borderRadius:'4px'}}>
						
					<div style={{display:"table-cell",width:'40%',padding:5}}>
					{eventState && overlayMovePanel && drawLottoDisabled()}
					</div>
					
					<div style={{display:"table-cell",width:'60%',padding:5}}>
					{eventState && overlayMovePanel && drawLotto()}
					</div>
					
				</div>
				<div className="divLotto">
				<div style={{display:"table-row"}}>
					<div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5}}>
						{ error!=="" &&
						<div style={{width:'100%',backgroundColor:'red',color: 'white',fontSize:'1.2em'}}>{error}</div>
						}
					</div>
				</div>	
				</div>	

				<div className="divLotto">
				<div style={{display:"table-row"}}>
				<div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5}}>
						 
				  <Button class="ui button"  onClick={(event) => {
					    event.preventDefault()
						event.stopPropagation()
						changeOrdAction(); 
					}} style={{marginRight:10,  width: 130, height: 35, color:'black',backgroundColor: "#0fad0c"}}>
						<Icon name='check' style={{color: 'black'}}/>Conferma</Button>

                  <Button  class="ui button" onClick={(event) => {
						    event.preventDefault()
							event.stopPropagation()
							closeOverlay();
							return null;
					}} style={{marginLeft:10,  width: 130, height: 35,color:'white',backgroundColor: '#35150E', border: '1px solid black'}}>
						<Icon name='close' style={{color: 'white'}}/>Annulla</Button>	
					</div>	
					</div>
					{
				   localLoading &&
					<div className="divLotto" >
			       	<div style={{display:"table-row"}}>
					<LoadingOverlay mode={'white'} />
					</div>
					</div>
					}
				</div>
			 </div>
			</Modal>
		);
};
