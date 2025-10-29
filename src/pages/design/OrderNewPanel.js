import React, {useState,useMemo,useCallBack,useEffect} from "react";
import moment from "moment";
import {Button, Icon} from 'semantic-ui-react';
import "./OrderMainPanel.css";
import {apiRequest,jAlert,log} from "api";
import {mustControlQta,calcolaQtaCoeff} from "./CommonFunc";
import { Modal} from "semantic-ui-react";
import LoadingOverlay from 'components/LoadingOverlay';
import { Input } from 'semantic-ui-react';
import { OrderMeccanicoList } from "./OrderMeccanicoList";
import ColorPick from "./generalComponents/ColorPick";
import { isNumber } from "lodash";
import { Alert } from "react-bootstrap";


export const OrderNewPanel = ({scheduler,reloadDesk,deskData}) => {
	const {eventState, overlayNewPanel,prodotti} = scheduler.state;
	const [error, setError] = useState("");
	const [qta, setQta] = useState("0");
	const [resa, setResa] = useState(0);
	const [qli, setQli] = useState(0);
	const [countRef, setCountRef]= useState(0);
	const [notaHead, setNotaHead] = useState("");


	const [showDetails, setShowDetails] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [bgColor, setBgColor] = useState('');
	const [fgColor, setFgColor] = useState('');
	
	const [filterProdotti,setFilterProdotti]=useState([]);
	const [search, setSearch] = useState(null);
	
	const {
	 	schedulerData,
	 	user
	} = scheduler.props;
	useEffect(()=>{;
		if (qta && eventState?.resa){
			const qtaNum = parseFloat(String(qta));
			const qtaResa= (qtaNum * eventState.resa);
			qtaNum >0 && setResa(Math.floor(qtaResa));
			qtaNum >0 &&  changeQli(qtaNum);
			setNotaHead("");
		}
		if (qta==="" || qta==="0" ) {
			setResa("0");
			setQli("0")
		}
		
	},[qta])

	useEffect(()=>{
		if (search) {
			setFilterProdotti(prodotti.filter(
				(item) =>
				  item.fulldesc.toLowerCase().indexOf(search.toLocaleLowerCase()) > -1
			  ))
			} else {
				setFilterProdotti(prodotti);
			}
    },[search,prodotti])

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

	const changeQli = (qtaNum) => {
		try {
			if(eventState?.tipologia.toLowerCase()==="ls") 
		   setQli(qtaNum * 2);
		else
		   setQli(qtaNum);
		} catch(e){}
	};
	const changeValue = (index,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === index);
        elem.qta=parseInt(aValue);
		areaUpdate={...areaUpdate,elem};
	};
	{/** gestoione colore box */}
	const colorChangeLoc = async (bg_color,fg_color) => {
		setBgColor(bg_color);
		setFgColor(fg_color);
	};
	const colorResetLoc = async () => {
		setBgColor('');
		setFgColor('');
	}; 
	const createOrdAction=async ()=> {
		setError("");
		eventState.nota=notaHead; 
		eventState.bg_color=bgColor; 
		eventState.fg_color=fgColor; 
		
		try {
		const esitoControlli= await calculateValue();
		if(esitoControlli)
		{
			setLocalLoading(true);
			 	const response = await apiRequest({
					method: "POST",
					url: "/pocreate",
					user: user,
					data: eventState
				});
				if(parseInt(response.data.rc)===0) 
				{
					log("tutto ok");
					closeOverlay(true);
				} else {
					alert(response.data.msgOut);
					closeOverlay(false);
				}

		}}
		catch(e){}
		finally{	setLocalLoading(false); }
	};


	  

	function closeOverlay(flagReload){
		setSearch(null);
		setQta(0);
		setResa("");
		setError("");
		setTimeout(() => flagReload  && reloadDesk(), 100);
	
		setShowDetails(false);
	 	scheduler.setState({
			overlayNewPanel: false,
			eventState:undefined
		})
	}
	 
	const changeQtaLotto = (aValue) => {
			setQta(aValue)
	};

 
	const calculateHeight = () => {
        return 710; 
	};
	const drawArticle = async (item) => {
		//jAlert(item);
		let justIn=deskData.deskItems.filter((elem) => elem.lotto === eventState.lotto && elem.resourceId===item.codice);
		if(justIn.length) {
			alert(item.codice+" articolo già presente in questo OI");
			return;
		};
		setLocalLoading(true);
		 
		setShowDetails(false);
		eventState.codice=item.codice;
		eventState.descrizione=item.descrizione;
		eventState.qta=1;
		eventState.resa=parseInt(item.resa);
		eventState.oi="";
		eventState.ndoc="";
		eventState.nota="";
	
		
		let requestData = {"resourceId": item.codice};
		const response = await apiRequest({
			method: "POST",
			url: "/meccanico",
			user: user,
			data: requestData
		});
		//jAlert(response.data.details); 
		eventState.details=response.data.details;
		setQta(eventState.qta);
		setResa(eventState.qta * item.resa);
		 
		setError("");
		setLocalLoading(false);
        setShowDetails(true);
		
	};

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
		eventState.qta=qta;
		let total = eventState.details.reduce((previous, next) => {
			return previous + calcolaQtaCoeff(next);
		}, 0);
		if(total===0)
		{
			setError("Quantità meccanico da produrre non specificata");
			return false;
		}
		if(mustControlQta(eventState.codice,eventState.descrizione))
		{  
			if(total !== resa)	{
				setError("La somma delle quantità ("+total+") non coincide con la produzione: "+resa)
				return false;
			}
		}
		return true;
	};

	const btSelect = (item) => {
		return <Button className="ui button" label="Sel."    onClick={(e) => drawArticle(item)} style={{width:'100%'}} />
    }
	 
	const drawLotto = (headerTitle) => {
		return (
			<div className="divLotto">
			    <div className="divLotto">
			     <div style={{display:"table-row",width:"100%"}}>
				
				 <div className="header" style={{display:"table-cell",width:'50%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  {eventState.codice} {" - "} {eventState.descrizione}  
				 </div>
				 <div className="header" style={{display:"table-cell",width:'25%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {"Lotto :"} &nbsp; {eventState.lotto}
				 </div>
				 <div className="header" style={{display:"table-cell",width:'25%',padding:12,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				 {moment(eventState.data).format("DD-MM-YYYY")} 
				 </div>
				</div>
				</div>

			 
               { showDetails && 
			   <>
			  <OrderMeccanicoList 
			  eventState={eventState} 
			  countRef={countRef}  
			  notaHead={notaHead} 
			  setNotaHead={setNotaHead}
			  setCountRef={setCountRef}
			  localLoading={localLoading}
			  setLocalLoading={setLocalLoading}
			  mode="new"
			  changeQtaLotto={changeQtaLotto}
			  digitLavagna={true}
			  qta={qta}
			  qli={qli}
			  resa={resa}
			  noLoader={true}
			  />
                     
		</>
	    }
		{
		 localLoading &&
			<div className="divLotto" >
				<div style={{display:"table-row"}}>
				<LoadingOverlay mode={'orange'} showTxt={'Wait requested info....'}/>
				</div>
			</div>
		}
        </div>
		);
	};

	const drawRicerca = () => {
		return (
			<div className="divLotto">
			    <div className="divLotto" >

			    <div style={{display:"table-row",width:"100%", height: '100%', }}>
				  <div className="header" style={{display:"table-cell",width:'95%',padding:5,backgroundColor:"#f2f2f2",fontWeight:'bold'}}>
				  <div style={{display:'inline-block',paddingRight:10}}>
				  <ColorPick  colorChange={colorChangeLoc} colorReset={colorResetLoc}/> 	
				  </div>
			
				  <Input
				  	icon="search"
				    type="search"
					autoFocus
					placeholder= "Search..."
        			name="search"
					value={search}
        			onChange={(e) => setSearch(e.target.value)}
					style={{border: '1px solid grey', borderRadius: 5}}
      			/>
				</div>
				</div>
				</div>

				<div className="divLotto" style={{textAlign:'left',height:500,maxHeight:500,overflowY:'scoll',overflowX:'none'}}>
				<div style={{overflow:'auto',height:540}}>					
				<ul style={{listStyleType: "none",padding:0}}>
				{     filterProdotti.length>0 && filterProdotti.map((item,index) => {
                            return (
							<li key={index}>	
							<div className="divLotto">
							<div style={{display:"table-row"}}>
							<div className="divCellaRow" style={{width:'80%'}}>{item.fulldesc}</div>
							<div className="divCellaRow" style={{width:'20%',textAlign:'center'}}>{btSelect(item)}</div>
							</div>
							</div>
							</li>
							)					  
                        })
                    }
				</ul>	
				</div>
			 </div>
			</div> 			 
		);
	};

	return (
		<Modal 	className="desk-overlay-panel"
		//mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
		size='large'
		onClose={()=>closeOverlay(false)}
		poppermodifiers={[
			{
				name: 'preventOverflow',
				options: {	boundariesElement: "window"	},
			} 
		]}
		open={overlayNewPanel}
	   >
			<div className="content" style={{backgroundColor:'white',height:calculateHeight()}}>
			 
				<div style={{display:"table",width:'100%',border:'1px solid black',	borderRadius:'4px'}}>
						
				<div style={{display:"table-cell",width:'40%',padding:5}}>
				{eventState &&  drawRicerca()}
				</div>
			
				<div style={{display:"table-cell",width:'60%',padding:5}}>
				{eventState && drawLotto('Nuovo Ordine')}
				</div>
					
				</div>
				<div className="divLotto">
				 
				<div style={{display:"table-cell",width:'50%',textAlign:'center',padding:5}}>
					{ error!=="" &&
					<div style={{width:'100%',backgroundColor:'red',color: 'white',fontSize:'1.2em'}}>{error}</div>
					}
				</div>					

				   <div style={{display:"table-cell",width:'50%',textAlign:'center',padding:5}}>
				    
     			
				     <Button  class="ui button" onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 createOrdAction(); 
					 }} style={{marginRight:10,width: 130, height: 35, backgroundColor: "#0fad0c",color:"black"}}>
						<Icon name='check' style={{color: 'black'}}/>Conferma</Button>	

                     <Button class="ui button" onClick={(event) => {
						    event.preventDefault()
							event.stopPropagation()
							closeOverlay(false);
							 
					 }} style={{marginLeft:10,width: 130, height: 35, backgroundColor: '#35150E', color:'white',border: '1px solid black' }}>
						<Icon name='close' style={{color: 'white'}}/>Annulla</Button>	
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
