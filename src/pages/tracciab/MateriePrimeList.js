import React, {useEffect,useState,useContext  } from "react";
import {jAlert,jLog,log,apiRequest} from "api";
import "./OrderMainPanel.css";
import {SessionContext} from "components/SessionContext"; 
import LoadingOverlay from 'components/LoadingOverlay';
import {Input,Button,Icon} from 'semantic-ui-react';
import Utils from "pages/scheduler/Utils";

export const MateriePrimeList = ({eventState,user,countRef,setCountRef,localLoading,setLocalLoading,qta,qli,resa}) => {
	const {sessionInfo,isAuthorized} = useContext(SessionContext);
	const [matDetails, setMatDetails]= useState([]);
	const [selectedRow, setSelectedRow]= useState(-1);
	const [showQli, setShowQli]= useState(true);
	const [currMatPrima, setCurrMatPrima] = useState("");
	useEffect(()=>{
		// chiamato su edit nota meccanco o riordino
		log("ordermeccanicolist-ridisegna");
		// totale righe meccanico editate
		let total = eventState.details.filter((elem => elem.riga>0));
	    if(eventState.groupId.toLowerCase()==="tortine e biscotti") setShowQli(false);
	},[countRef]);

 	const changeValueLotto = (item,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === item.index);
		elem.lotto_mat=aValue;
		areaUpdate={...areaUpdate,elem};
		setCountRef(countRef+1);
	};

	const qtaEditor = (item) => {
        return <Input
		value={item.consumo}			
		onKeyDown={(e)=>shouldBlur(e)}	 
		style={{width: 70, textAlign: 'center', display: 'flex'}}
		onChange={(e)=>controlloQta(item,e.target.value)} />
    };

	const shouldBlur = (e) => {
		if (e.keyCode === 40) {
		  e.target.blur();
		}
	};

	const controlloQta = (item,aValue)=>{
		let areaUpdate=eventState.details;
		 let elem = areaUpdate.find((el) => el.index === item.index);
         let oldValue= String(elem.consumo);
		 let newChar= aValue.slice(-1);
		 let haGiaVirgola=oldValue.includes(".");
		 let numDecimali=0;
		 //log("index:"+item.index+"old:"+ oldValue + "--new char:"+ newChar +"--- "+ isNumber(newChar)
		 //+"----ha già la virgola--"+haGiaVirgola +" numDecimali: "+numDecimali );
		 if (oldValue.length>aValue.length ) {
			changeValue(item,aValue)
			return;
		 };

         if(haGiaVirgola && newChar===".")  return;
		  
         if(haGiaVirgola) {
		    numDecimali=oldValue.substring(oldValue.lastIndexOf('.')+1).length};

		  if(numDecimali>2){
			return;
		  } 
		 var go= false;
         if (isNumber(newChar)) go= true;
		 if (go===false && newChar==="." && aValue.length > 1) go= true;

		 if (go) {
			changeValue(item,aValue)
		}
	}
	const changeValue = (item,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === item.index);
        elem.consumo=aValue;
 
		areaUpdate={...areaUpdate,elem};
		setCountRef(countRef+1);
	};
	const copyPasteLotto=(item) => {
		let areaUpdate=eventState.details;
		let elem = eventState.details[selectedRow];
		elem.lotto_mat=item.lotto;
		elem.giacenza=item.giacenzaLotto; // in formato double
		areaUpdate={...areaUpdate,elem};
		setCountRef(countRef+1);
	}

	const lottoEditor = (item) => {
        return <Input value={item.lotto_mat} onChange={(e) => changeValueLotto(item,e.target.value)} 
		        style={{width:170,padding:0,margin:0,borderBottom:"1px solid grey",}}
		/>
    };
	function lottiSparati(item) {
		if(	item.lotti_num > 1) {
		  return  <div style={{width:'100%',height:'100%',backgroundColor:'#95e685'}}>{item.lotti_num}</div>
		} else {
		  return <div style={{width:'100%',height:'100%'}}></div>
		}
	};
	function drawLotto(item) {
		var arr=[];
		var ltsp=eventState.lottiSparati.find(v => v.codMat === item.codMat);
		if(ltsp && ltsp.counter>1) {
           arr=ltsp.lotti;
		}
		if(	arr.includes(item.lotto)) {
			return  <div style={{width:'100%',height:'100%',backgroundColor:'#95e685'}}>{item.lotto}</div>
		  } else {
			return <div style={{width:'100%',height:'100%'}}>{item.lotto}</div>
		  }
	}
	const selectMatPrima = (item) => {
		setCurrMatPrima(item.target.value);
    };

	const detailEditor = (item,rowIndex) => {
        return <a  className="link" onClick={(e) => getMatDetails(item,rowIndex)} title="Mostra dettagli">	
		<Icon name="zoom-in" style={{width:10}} /></a>
    };
	 
	const formatIt = (qli)=>{
		return String(qli);
	}

	const getMatDetails = async (aItem,rowIndex) => {
	    setSelectedRow(rowIndex);
		setLocalLoading(true);
	 	var data ={"codice":aItem.codice,"lotto":eventState.lotto};
		const response = await apiRequest({
			method: "POST",	url: "/matprimeinfo",	user: sessionInfo.user, data: data
		});
	 	setMatDetails(response.data);
		setLocalLoading(false);
	};
	
	function isNumber(char) {
		if (typeof char !== 'string')  return false;
	  	if (char.trim() === '') 	    return false;
	  	return !isNaN(char);
	}
	const isSelect=(a,b)=>{
		if(a===b) return('rigaSelezionata');
		return "";   
    }
	
	const addRowAction= async ()=> {
		if(currMatPrima==="") {
			alert("Nessuna nuova materia prima selezionata");
			return;
		}
		setLocalLoading(true);
		var data=[];
		data.push(currMatPrima);
		data.push(eventState.lotto);
		eventState.details.forEach(item => {
			if(item.lotto_mat !== "")
			  data.push(item.lotto_mat);
		});
         // data tutti i lotti che sto utilizzando; 
		try {  
		const response = await apiRequest({
			method: "POST",	url: "/lottodisp",	user: sessionInfo.user, data: data
		});
		// dato una materia prima il periodo corrente e tutti i lotti usati a video 
		// torna uno sparato per questa materia
		var new_lotto=response.data;
	    log("new lotto per "+currMatPrima+" -> "+new_lotto);
		var mat_item=eventState.materiePrime.find(v => v.codice === currMatPrima);
		var data ={"codice":currMatPrima,"lotto":eventState.lotto};
		const response2 = await apiRequest({
			method: "POST",	url: "/matprimeinfo",	user: sessionInfo.user, data: data
		});
		var giac="0";
		var lotto_item=response2.data.find(v => v.lotto === new_lotto);
		if(lotto_item)
		   giac=lotto_item.giacenzaLotto;
		   
        var newItem={
		 	"index": selectedRow < 0 ? eventState.details.length:selectedRow+1,
			"codice":currMatPrima,
			"descrizione":mat_item.descrizione,
			"um":"KG",
			"consumo": "0",
			"giacenza": giac,
			"lotto_mat":new_lotto
		};
		setLocalLoading(false);
		if(selectedRow < 0) {
		   eventState.details.push(newItem); }
        else { 
		    eventState.details.splice(selectedRow+1, 0, newItem);
			let pos=0;
			eventState.details.forEach(item => {
			item.index=pos;
			pos=pos+1
			});
		}
		setCountRef(countRef+1);
	   } catch(e) {
		 alert(e);
	   }
    }

	const delRowAction=()=> {
		if( selectedRow <0) {
			alert("Nessuna riga selezionata");
			return;
		}
		if(!window.confirm('Sei sicuro di voler cancellare?')) return;
		eventState.details=eventState.details.filter(function(item) {
			return item.index !== selectedRow;
		});
		setSelectedRow(-1); // tolgo selezione
		setMatDetails([]);
		let pos=0;
		eventState.details.forEach(item => {
			item.index=pos; pos+=1;
		});
		setCountRef(countRef+1);
	}
	return (
		<>
		<div className="divLotto" style={{padding:10}}>
			<div style={{display:"table-row"}}>
			 <div className="divCella" style={{width:'35%'}}>
			  <div className="divLotto">
			  <div style={{display:"table-row"}}>
			
			<div className="divCella" style={{width:'10%'}}>Qta Lotti</div>
			<div className="divCella" style={{width:'5%',fontWeight:'bold'}}>{qta}</div>
			<div className="divCella" style={{width:'10%'}}>{showQli && 'QLI'}</div>
			<div className="divCella" style={{width:'5%',fontWeight:'bold',textAlign:'left'}}>{showQli && formatIt(qli)}</div>
			<div className="divCella" style={{width:'6%'}}>Resa</div>
			<div className="divCella" style={{width:'5%',fontWeight:'bold'}}>{resa}</div>
             </div></div></div>

			<div className="divCella borderShadow" style={{width:'60%'}}>
		 	 <div className="divLotto">
			  <div style={{display:"table-row"}}>
			   
		    <div className="divCella" style={{width:'70%',textAlign:'center'}}>
			<select className="ui dropdown" style={{marginTop: 5,width:'100%',border:'2px solid black'}} value={currMatPrima} 
			                            onChange={(e)=> selectMatPrima(e)} >
            <option value="">Materie prime</option>
            {eventState.materiePrime.map((item,index) => {
             return (                                
               <option key={index} value={item.codice}>{item.codice} {item.descrizione}</option>
             )})
            }
            </select>
			</div>
			<div className="divCella" style={{width:'20%',textAlign:'center'}}>
			 
			<Button  className="ui button"  onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 addRowAction(); 
					 }} style={{marginRight:30, padding:0,width: 95, height: 30, color:'black',backgroundColor: "#bad9d4"}}>
					<Icon name='plus' style={{color: 'black'}}/>Aggiungi</Button>
			 		 
			</div>
			<div className="divCella" style={{width:'20%',textAlign:'center'}}>
			 

			<Button  className="ui button"  onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 delRowAction(); 
					 }} style={{marginRight:30, padding:0,width: 95, height: 30, color:'white',backgroundColor: "red"}}>
				<Icon name='minus' style={{color: 'white'}}/>Rimuovi</Button>
			</div>
			</div></div></div>
			</div>
		</div>

		<div className="divLotto" 
				 style={{border:'1px solid lightgrey' ,textAlign:'left',height:340,
				 overflowY:'scoll',overflowX:'none'}}>
				<div style={{overflow:'auto',height:'100%'}}>	
				<div className="divLottoRow" style={{width: '100%',height:20 }}>
				    <div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Cod.</div>
					<div className="divCellaHeader" style={{width:'35%',textAlign:'center'}}>Articolo</div>
					<div className="divCellaHeader" style={{width:'5%', textAlign:'center'}}>UM</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Qta</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Nr.lotti<br/>sparati</div>
					<div className="divCellaHeader" style={{width:'20%',textAlign:'center'}}>Lotto</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Giacenza Lotto</div>
					<div className="divCellaHeader" style={{width:'5%' ,textAlign:'center'}}>Dett.</div>
				</div>
				
				{   
				eventState.details.map(( item,index ) => {
				return (
				<div className={`divLottoRow`}   style={{display:"table-row"}} key={index}>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{item.codice}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{}}>{item.descrizione}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{item.um}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{qtaEditor(item)}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center',padding:3,lineHeight:2.4}}>
						{lottiSparati(item)}</div>
					<div className={`divCellaHeader ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{lottoEditor(item)}</div>
				
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>
					{ 
					item.lotto_mat==="" ?
					<p>-</p> : 	Utils.doubleIt(item.giacenza)
					}
					</div>
				  <div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{textAlign:'center'}}>{detailEditor(item,index)}</div>
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
			<div className="divLotto" 
				 style={{border:'1px solid lightgrey',height:160,maxHeight:160,
				 overflowY:'scoll',overflowX:'none',borderTop:'2px solid gray',paddingTop:5,paddingLeft:5,paddingRight:5}}>
				<div style={{overflow:'auto',height:'100%'}}>
				{
				matDetails.length > 0 && (
				<div className="divLottoRow" style={{display:"table-row"}}>
					<div className="divCellaHeader" style={{width:90,textAlign:'left'}}>Cod. Mat</div>
					<div className="divCellaHeader" style={{width:120,textAlign:'center'}}>Data Scadenza</div>
					<div className="divCellaHeader" style={{width:120,textAlign:'center'}}>Data Arrivo</div>
					<div className="divCellaHeader" style={{width:100,textAlign:'center'}}>BK</div>
					<div className="divCellaHeader" style={{width:140,textAlign:'center'}}>Lotto</div>
					<div className="divCellaHeader" style={{width:210,textAlign:'center'}}> </div>
					<div className="divCellaHeader" style={{width:120,textAlign:'center'}}>Giac. Lotto</div>
				</div>
				)}
				{   
				matDetails.map(( item,index ) => {
				return (
				<div className={`divLottoRow  ${item.qtaCarico>0 && 'boldTxt'}`}  style={{display:"table-row"}} key={index}>
					<div className="divCellaRow" style={{textAlign:'left'}}>{item.codMat} </div>
					<div className="divCellaRow" style={{textAlign:'center'}}>{item.dtScadenza}</div>
					<div className="divCellaRow" style={{textAlign:'center'}}>{item.dtArrivo}</div>
					<div className="divCellaRow" style={{textAlign:'center'}}>{item.bk}</div>
					<div className="divCellaRow" style={{textAlign:'center'}}>{drawLotto(item)}</div>
					<div className="divCellaRow rigaSelezionataA" style={{textAlign:'center',padding:0}}>
						<a onClick={()=> copyPasteLotto(item)}>Copia nella riga selezionata</a>
					</div>
					<div className="divCellaRow" style={{textAlign:'center'}}>
						{  Utils.doubleIt(item.giacenzaLotto) }
					</div>
				</div>
				)
				}) //map
				}
		        </div>
				</div>	
			</>	
	);
};