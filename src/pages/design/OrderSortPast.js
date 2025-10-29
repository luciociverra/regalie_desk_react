import React, {useState,useMemo,useContext,useEffect,useRef} from "react";
import { Button, Icon } from 'semantic-ui-react';
import "./OrderMainPanel.css";
import {apiRequest,jAlert,log,jLog} from "api";
import {Modal} from "semantic-ui-react";
import LoadingOverlay from 'components/LoadingOverlay';
 
export const OrderSortPast = ({scheduler,reloadDesk}) => {
	const {eventState,overlaySortPanel} = scheduler.state; // dallo stao del Component chiamante
	const [error, setError] = useState("");
	const [localLoading, setLocalLoading] = useState(false);
	const [countRef, setCountRef]= useState(0);
	const [evenStateCloned,setEventStateCloned]=useState([]);
	const {	user } = scheduler.props;
 
	useEffect(()=>{
        const clona=()=> {
		   var clonedObj =[];
		   log(eventState.length);
		   eventState.forEach((row) => { clonedObj.push(Object.assign( {}, row ))} );
		   setEventStateCloned(clonedObj)
		}
		Array.isArray(eventState) && clona()
    },[eventState])

	const changeSortAction=async ()=> {
		setError("");
		{
			setLocalLoading(true);
			let dataToSend=[];
			evenStateCloned.map((elem) =>
			  { dataToSend.push({"dorig":elem.dorig,"riga":elem.row_number}) 
			});
			//jAlert(dataToSend);
		 
		 	const response = await apiRequest({
					method: "POST",
				 	url: "/moverows",
					data: dataToSend,
					user: user,
				});
			
			setLocalLoading(false)
			closeOverlay(true);
		}  
	}
	const closeOverlay=(flagReload)=>{
	 	setError('');
		setEventStateCloned([])
		setTimeout(() => flagReload  && reloadDesk(), 1000);
		// annullo flag aperdura e struttura passata
	 	
		scheduler.setState({
			overlaySortPanel: false, 
			eventState:undefined
		})
	}
	
	const calculateHeight = () => {
        return 650; 
	};

	const changePosition = async (index,action) => {
		let rowUnderOver=null;
		let currentRow=evenStateCloned[index]; // riga su cui ho cliccato
		if(action==="G") // sposto giu
		  rowUnderOver = evenStateCloned[index+1]; 
		if(action==="S") // sposto su
		  rowUnderOver = evenStateCloned[index-1];
		let numRowUnderOver=rowUnderOver.row_number;

		rowUnderOver.row_number=currentRow.row_number;
		currentRow.row_number=numRowUnderOver;
		evenStateCloned.sort(compare_riga); 
		setCountRef(countRef+1);
	 };
	 function compare_riga(a, b){
        // a should come before b in the sorted order
        if(a.row_number < b.row_number){
            return -1;
       
        } else if(a.row_number > b.row_number){
                return 1;
        } else{
                return 0;
        }
}
	const moveButton = (item,index) => {
		let countRows=eventState.length;
		 
		const btSu= 
		(
		<a  className="link" onClick={(e) => changePosition(index,'S')} title="Sposta sopra">	
		<Icon name="arrow alternate circle up" style={{fontSize:20}} /></a>
		);
		const btGiu= 
		(
		<a  className="link" onClick={(e) => changePosition(index,'G')} title="Sposta sotto">	
		<Icon name="arrow alternate circle down" style={{fontSize:20}} /></a>
		);
		const btAll= 
		(<>
			<a  className="link" onClick={(e) => changePosition(index,'S')} title="Sposta sopra">	
			<Icon name="arrow alternate circle up" style={{fontSize:20}} /></a>
			<a  className="link" onClick={(e) => changePosition(index,'G')} title="Sposta sotto">	
			<Icon name="arrow alternate circle down" style={{fontSize:20}} /></a>
		</>
		);
		
		if( index === 0 )	return btGiu; //prima
		if( index === (countRows-1)) return btSu; //ultima
		return btAll;
	};
		
	 
	const drawList = () => {
		return (
			<div className="divLotto" 
				 style={{border:'1px solid lightgrey' ,textAlign:'left',height:560,
				 overflowY:'scoll',overflowX:'none'}}>
				{	
				evenStateCloned.length>0 &&
				
				<div className="divLottoRow" style={{display:"table-row",width:800}} key={1}>
					 
					<div className="divCellaRow" style={{width:'100%',paddingLeft:10,paddingRight:30,paddingTop:5,
							fontWeight:'bold'}}>
						{evenStateCloned[0].lotto} - Lievitati
					</div>
				</div>
	            }
				<div style={{overflow:'auto',height:520 }}>
				{	
				evenStateCloned.length>0 &&
				evenStateCloned.map((item,index) => {
				return (
				<div className="divLottoRow" style={{display:"table-row",width:800,height:30}} key={index}>
					<div className="divCellaRow" style={{width:'15%',textAlign:'center'}}>{moveButton(item,index)}</div>
					<div className="divCellaRow" style={{width:'15%',textAlign:'center'}}>{item.id}</div>
					<div className="divCellaRow" style={{width:'5%',textAlign:'center'}}>{item.row_number}</div>
					<div className="divCellaRow" style={{width:400,paddingLeft:20,paddingRight:20}}>
					{item.dorig} - {item.title}  
					</div>
				</div>
				)
				}) //map
				}
				</div>
			</div> 			 
		);
	};


	return (
		<Modal 	className="desk-overlay-panel"
		//mini importante !!  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
		size='tiny'
		onClose={()=>closeOverlay(false)}
		poppermodifiers={[
			{
				name: 'preventOverflow',
				options: {
					boundariesElement: "window"
				},
			} 
		]}
		open={overlaySortPanel}
	   >
	   <div className="content" style={{backgroundColor:'white',height:calculateHeight()}}>
	   {
					localLoading &&
					<div className="divLotto" >
			       	<div style={{display:"table-row"}}>
					<LoadingOverlay mode={'orange'} showTxt={'Updating ... '}/>
					</div>
					</div>
					} 
				<div style={{display:"table",width:'100%',border:'1px solid black',	borderRadius:'4px'}}>
				
				<div style={{display:"table-cell",width:'100%',padding:5}}>
				{eventState && drawList()}
				</div>
				</div>
				<div className="divLotto">
				
				<div style={{display:"table-row"}}>
					<div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5}}>
						{ error!=="" &&
						<div style={{width:'100%',backgroundColor:'red',color: 'white',fontSize:'1.1em'}}>{error}</div>
						}
					</div>
				</div>					
				 
				<div style={{display:"table-cell",width:'100%',textAlign:'center',padding:5}}>
 
				     <Button size='mini' onClick={(event) => {
						 event.preventDefault()
						 event.stopPropagation()
						 changeSortAction(); 
					 }} style={{marginRight:10,  width: 100, height: 30, backgroundColor: "#0fad0c"}}>
					 <Icon name='check' style={{color: 'black'}}/>
					 <label style={{color: 'black'}}>Conferma{" "}</label>
					</Button>
					 

					 
                     <Button size='mini' onClick={(event) => {
						    event.preventDefault()
							event.stopPropagation()
							closeOverlay(false);
					 }} style={{marginLeft:10,width:100,height:30,backgroundColor:'#35150E',border: '1px solid black' }}>
					 <Icon name='close' style={{color: 'white'}}/>
					 <label style={{color: 'white'}}>Annulla{" "}</label>
					</Button>
					 
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
