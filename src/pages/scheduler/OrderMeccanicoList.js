import React, {useEffect,useState,useContext, createRef } from "react";
import {jAlert, jLog, log,apiRequest} from "api";
import { InputNumber } from 'primereact/inputnumber';
import "./OrderMainPanel.css";
import {SessionContext} from "components/SessionContext"; 
import LoadingOverlay from 'components/LoadingOverlay';
import { Input,Button,Icon } from 'semantic-ui-react';

export const OrderMeccanicoList = ({eventState, notaHead,setNotaHead,countRef,setCountRef,localLoading,setLocalLoading,changeQtaLotto,qta,qli,resa,digitLavagna,noLoader,foundInWeek}) => {
	const {sessionInfo,isAuthorized} = useContext(SessionContext);
	const [countRows, setCountRows]= useState(0);
	const [countRefNota, setCountRefNota]= useState(0);
	const [mecDetails, setMecDetails]= useState([]);
	const [selectedRow, setSelectedRow]= useState(null);
	const [showQli, setShowQli]= useState(true);
	const inputRef = createRef()

	useEffect(()=>{
		// chiamato su edit nota meccanco o riordino
		inputRef.current.focus()
		log("ordermeccanicolist-ridisegna");
		// totale righe meccanico editate
		let total = eventState.details.filter((elem => elem.riga>0));
	    if(eventState.groupId.toLowerCase()==="tortine e biscotti") setShowQli(false);
		setCountRows(total.length);
    },[countRef]);
	
	useEffect(()=>{
    },[countRefNota]);

	function isNumber(char) {
		if (typeof char !== 'string') {
		  return false;
		}
	  
		if (char.trim() === '') {
		  return false;
		}
	  
		return !isNaN(char);
	}

	const shouldBlur = (e) => {
		log('--blur:'+ e.keyCode)
		if (e.keyCode === 40) {
		  e.target.blur();
		  log('blur')
		}
	};
    const formatQta=(aValue) =>{
		return String(aValue).replaceAll('.', ',')
	};

	const handleChangeNotaHead = (e, { name, value }) => {
		setNotaHead(value);
	};

	const changeValueNote = (index,aValue) => {
	  	let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === index);
	    elem.nota=aValue;
		areaUpdate={...areaUpdate,elem};
		setCountRefNota(countRefNota+1); // modifica i dati - refresh
	};

	const controlloQta = (aValue)=>{
		log("arrivato:"+ aValue)
		let oldValue= String(qta);
		 let newChar= aValue.slice(-1);
		 let haGiaVirgola=oldValue.includes(".");
		 let numDecimali=0;

		 if (oldValue.length>aValue.length ) {
			changeQtaLotto(aValue);
			return;
		 };

         if(haGiaVirgola && newChar===".")  return;
		  
         if(haGiaVirgola) {
		    numDecimali=oldValue.substring(oldValue.lastIndexOf('.')+1).length};

		 log("primo step:"+ oldValue + "--nuovonumero:--"+ newChar +"--- "+ isNumber(newChar)+"----ha già la virgola--"+haGiaVirgola +" numDecimali: "+numDecimali);//ok
		 if(numDecimali>1){
			return;
		  } 
		 var go= false;
         if (isNumber(newChar)) go= true;
		 if (go===false && newChar==="." && aValue.length > 1) go= true;

		 if (go) {
			changeQtaLotto(aValue)
		}
	}
	
	const qtaEditor = (item) => {
        return <InputNumber small value={item.qta} onChange={(e) => changeValue(item.index,e.value)} mode="decimal" />
    };
	const changeValue = (index,aValue) => {
		let areaUpdate=eventState.details;
		let elem = areaUpdate.find((el) => el.index === index);
        elem.qta=parseInt(aValue);
		areaUpdate={...areaUpdate,elem};
	};

	const noteEditor = (item) => {
        return <Input value={item.nota} onChange={(e) => changeValueNote(item.index,e.target.value)} 
		 style={{width:200,borderBottom:"1px solid grey"}}
		/>
    };
	const detailEditor = (item,rowIndex) => {
        return <a  className="link" onClick={(e) => getMecDetails(item.codice,rowIndex)} title="Mostra dettagli">	
		<Icon name="zoom-in" style={{width:10}} /></a>
    };
	 
	const formatIt = (qli)=>{
		return String(qli);
	}

	const changePosition = async (item,index,action) => {
		let rowUnderOver=null;
		let currentRow=eventState.details[index]; // riga su cui ho cliccato
		if(action==="G") // sposto giu
		  rowUnderOver = eventState.details[index+1]; 
		if(action==="S") // sposto su
		  rowUnderOver = eventState.details[index-1];
		let numRowUnderOver=rowUnderOver.riga;

		rowUnderOver.riga=currentRow.riga;
		currentRow.riga=numRowUnderOver;
		eventState.details.sort(compare_riga); 
		setCountRef(countRef+1);
	 };
    function compare_riga(a, b){
        // a should come before b in the sorted order
        if(a.riga < b.riga){
            return -1;
        } else if(a.riga > b.riga){
                return 1;
        } else{
            return 0;
        } 
    }

	const moveButton = (item,index) => {
		const btSu= 
		(
		<a className="link" onClick={(e) => changePosition(item,index,'S')} title="Sposta sopra">	
		<Icon name="arrow alternate circle up" style={{width:10}} /></a>
		);
		const btGiu= 
		(
		<a className="link" onClick={(e) => changePosition(item,index,'G')} title="Sposta sotto">	
		<Icon name="arrow alternate circle down" style={{width:10}} /></a>
		);
		const btAll= 
		(<>
			<a className="link" onClick={(e) => changePosition(item,index,'S')} title="Sposta sopra">	
			<Icon name="arrow alternate circle up" style={{width:10}} /></a>
			<a className="link" onClick={(e) => changePosition(item,index,'G')} title="Sposta sotto">	
			<Icon name="arrow alternate circle down" style={{width:10}} /></a>
		</>
		);
		if(countRows===1)   return "";    //una sola riga
		if( item.riga===0 )	return ""; // non editata
		if( index === 0 )	return btGiu; //prima
		if( index === (countRows-1)) return btSu; //ultima
		return btAll;
	};
	
	const getMecDetails = async (aCodArt,rowIndex) => {
	    setSelectedRow(rowIndex);
		setLocalLoading(true);
	 	var data ={"codice":aCodArt};
     	const response = await apiRequest({
			method: "POST",	url: "/meccanicoinfo",	user: sessionInfo.user, data: data
		});
		setMecDetails(response.data);
		//jAlert(mecDetails);
		setLocalLoading(false);
    };
   const rigaAttiva=()=>{
	  return 'rigaSelezionata';
   }
   const isSelect=(a,b)=>{
	if(a===b) 
		return('rigaSelezionata');
	return "";   
 }
    return (
		<>
		{foundInWeek && 
			<span style={{color:'red'}}>
					ATTENZIONE ARTICOLO GIA' SCHEDULATO IN QUESTO LOTTO,VERRA' ELIMINATO E SOVRASCRITTO CON I DATI IMMESSI IN QUESTA FINESTRA
			</span>
		}
		<div className="divLotto">
	
				  <div style={{display:"table-row"}}>
					<div className="divCella" style={{width:'25%'}}>Quantità Lotti</div>
					<div className="divCella" style={{width:'10%'}}>{showQli && 'QLI'}</div>
					<div className="divCella" style={{width:'20%'}}>Resa</div>
					<div className="divCella" style={{width:'60%'}}>Nota</div>
				  </div>
			    </div>
		 
				<div className="divLotto">
				  <div style={{display:"table-row"}}>

					<div className="divCella" style={{width:'25%'}}>
					<Input
					 ref={inputRef}
					 value={qta}			
					 onKeyDown={(e)=>shouldBlur(e)}	 
					 style={{width: 70, textAlign: 'center', display: 'flex'}}
					 onChange={(e)=>controlloQta(e.target.value)} />
  				
  				{/*<Button icon 
					className="p-button-secondary p-button-raised" 
					aria-label="Secondary" onClick={(e)=> changeQtaLotto('m')}>
						 <i class="minus icon"></i>
					</Button>
					<span style={{width:40,paddingLeft:10,paddingRight:10,fontWeight:'bold',textAlign:'center'}}>{qta}</span>
                    <Button icon  
					onClick={(e)=> changeQtaLotto('p')}
					className="p-button-secondary p-button-raised" 
					aria-label="Submit"><i class="plus icon"></i></Button>*/}


        			</div>
					<div className="divCella" style={{width:'10%',fontWeight:'bold',textAlign:'left'}}>{showQli && formatIt(qli)}</div>
					<div className="divCella" style={{width:'20%',fontWeight:'bold'}}>{resa}</div>
					<div className="divCella" style={{width:'60%'}}>
					<Input 
						style={{width: '100%', marginBottom: 10,border:'1px solid lightgray'}} 
						name="nota"
						onChange={handleChangeNotaHead} 
						value={notaHead}
						/>
				  </div>
			    </div>
		</div>
		<div className="divLotto" 
				 style={{border:'1px solid lightgrey' ,textAlign:'left',height:240,maxHeight:240,
				 overflowY:'scoll',overflowX:'none'}}>
				<div style={{overflow:'auto',height:230}}>	
				<div className="divLottoRow" style={{height:20, width: '100%' }}>
				    <div className="divCellaHeader" style={{width:'5%'}}></div>
					<div className="divCellaHeader" style={{width:'40%'}}>Articolo</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Qta</div>
					<div className="divCellaHeader" style={{width:'15%',textAlign:'center'}}>Giacenza</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Data rottura</div>
					<div className="divCellaHeader" style={{width: '25%', textAlign:'center'}}>Note</div>
					<div className="divCellaHeader" style={{width: '5%', textAlign:'center'}}>Dett.</div>
				</div>
				
				{   
				eventState.details.map(( item,index ) => {
				return (
				<div className={`divLottoRow`}   style={{display:"table-row"}} key={index}>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} 
					style={{width:'5%',textAlign:'center'}}>{digitLavagna && moveButton(item,index)}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} 
					style={{width:'40%'}}> {item.codice} {item.descrizione}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{width:'10%',textAlign:'center'}}>{qtaEditor(item)}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{width:'10%',textAlign:'center'}}>{item.giacenza}</div>
					{/*
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{width:'10%',textAlign:'center'}}>{item.giacenza}-{item.coeffImpiego}</div>
				    */}
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{width:'10%',textAlign:'center'}}>{item.data_rottura}</div>
					<div className={`divCellaHeader  ${isSelect(index,selectedRow)}`} style={{ width: '25%',textAlign:'center'}}>{noteEditor(item)}</div>
					<div className={`divCellaRow  ${isSelect(index,selectedRow)}`} style={{ width: '5%',textAlign:'center'}}>{detailEditor(item,index)}</div>
				</div>
				)
				}) //map
				}
				</div>
				{
					localLoading && ! noLoader &&
					<div className="divLotto" >
			       	<div style={{display:"table-row"}}>
					<LoadingOverlay mode={'orange'} showTxt={'..Processing data..'}/>
					</div>
					</div>
				}
			</div>
			<div className="divLotto" 
				 style={{border:'1px solid lightgrey' ,textAlign:'left',height:220,maxHeight:220,
				 overflowY:'scoll',overflowX:'none'}}>
				<div style={{overflow:'auto',height:220}}>
				{
				mecDetails.length > 0 && (
				<div className="divLottoRow" style={{display:"table-row"}}>
					<div className="divCellaHeader" style={{width:'65%',textAlign:'left'}}>Info</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Qt.carico</div>
					<div className="divCellaHeader" style={{width:'10%',textAlign:'center'}}>Qt.scarico</div>
					<div className="divCellaHeader" style={{width:'20%',textAlign:'center'}}>Data</div>
					<div className="divCellaHeader" style={{width:'15%',textAlign:'center'}}>Disp.</div>
				</div>
				)}
				{   
				mecDetails.map(( item,index ) => {
				return (
				<div className={`divLottoRow  ${item.qtaCarico>0 && 'boldTxt'}`}  style={{display:"table-row"}} key={index}>
					<div className="divCellaRow" style={{width:'65%',textAlign:'left'}}>{item.info} </div>
					<div className="divCellaRow" style={{width:'10%',textAlign:'center'}}>{item.qtaCarico}</div>
					<div className="divCellaRow" style={{width:'10%',textAlign:'center'}}>{item.qtaScarico}</div>
					<div className="divCellaRow" style={{width:'20%',textAlign:'center'}}>{item.data}</div>
					<div className="divCellaRow" style={{width:'15%',textAlign:'center'}}>{item.dispFlusso}</div>
				</div>
				)
				}) //map
				}
		        </div>
				</div>	
			</>	
	);
};

