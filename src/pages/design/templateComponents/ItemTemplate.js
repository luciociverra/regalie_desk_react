import React,{useEffect} from "react";
 
import Utils from "../Utils";
import { Progress,Popup,Button,Grid } from 'semantic-ui-react';
import "./itemTemplate.css";
const ItemTemplate = ({
								 //BIG SCHEDULER PROPS
								 scheduler,
								 schedulerMode,
								 schedulerData,
								 editEvent,
								 event,
								 mustAddCssClass,
								 mustBeHeight,
								 deskData,
								 blocked,
							 }) => {
	const className = mustAddCssClass;
	const {customsColor} = deskData
	// riga 51 eventItemHeight
	const height = mustBeHeight; // altezza elemento definita in src\pages\scheduler\schedulerSetup.js
	let background = `${event.bgColor}`;
    const titleString = ``;
 	const editItem=(e)=> {
		editEvent(event);
	}
	const getQtQli=(item)=> {
		if(item.tipologia.toLocaleLowerCase()==="ls") return item.qta *2;
		return item.qta;
	}
	const getQtQliTot=(item)=> {
		if(item.tipologiaTot.toLocaleLowerCase()==="ls") return Utils.roundTwo(item.qta *2);
		return item.qta;
	}
	const confTotale=(item)=> {
		var v=(item.totpro) / (item.resa*item.qta)
		if(v===0) return "";
		return (v * 100).toFixed(1) +"%";
	}
	const confTotaleDett=(type,item)=> {
		var base =type==="prima"?item.totpro:item.totsca;
		var v=(base) / (item.resa*item.qta)
		if(v===0) return " - ";
		return (v * 100).toFixed(1) +"%";
	}
	{/*
		lotto	"23243"
		articolo	"9246/P"
		bgColor	"#c3a8af"
		fgColor	"#FF000
    */}
	const getCellColor=()=> {
		let c=`${event.bgColor}`;
		let f=`${event.fgColor}`;
        let cColor=customsColor.find(e => (String(e.lotto) === String(event.lotto) && event.id === e.articolo));
        if(cColor){
			c=cColor.bgColor; f=cColor.fgColor;
		}
	 
		if(event.qtaEv===0 && event.cp==="")
		{
		return {
			color: f,	backgroundColor: c,
			backgroundImage: "repeating-linear-gradient(-20deg, #ccc, #ccc 2px,"
							 + c +" 0px,"+c+" 10px"  
			}
	   } else  {
			
		return {
				color: f,backgroundColor: c
			}	
		}
	}

	useEffect(()=>{
		if(event) {
		 //  log(event.typ +" "+event.resourceId);
		  }
	  },[event])
  
   //onClick={e => activeItemTemplate(event)}
  //	<div style={{width:'5%',  display:'table-cell',textAlign:'left'}}>{event.stp}</div> 
	  
   return (
	event.typ==='D' ? 
	<div key={event.id+event.lotto} className={className} style={{height}} title={titleString} onClick={e => editItem(e)}>
		<div className="rostering-item-template" style={getCellColor()}>
		<div style={{width:'100%',display:'table'}}>
			<div style={{width:'100%',fontWeight: "bold",display:'table-row'}} className={'cellFont'}>
			 <div style={{width:'8%',  display:'table-cell',textAlign:'center'}}>{getQtQli(event)}</div>
			 <div style={{width:'84%', display:'table-cell',textAlign:'center'}}>{event.id}</div>
			 <div style={{width:'8%',  display:'table-cell',textAlign:'center'}}>{event.avanzamento}</div>
			</div>
		</div>
		<div style={{width:'100%',display:'table',marginTop:-4}}>
			<div style={{fontWeight: "bold",display:'table-row'}} className={'cellFont'}>
			<div style={{width:'100%', display:'table-cell',textAlign:'center'}}>{event.title}</div>
			</div>
		</div>
		<div style={{width:'100%',display:'table',marginTop:-6}}>
			<div style={{fontWeight: "bold",display:'table-row'}} className={'cellFontNota'}>
			<div style={{width:'8%', display:'table-cell',textAlign:'center'}}></div>	
			<div style={{width:'84%',display:'table-cell',textAlign:'center'}}>{event.notaRiga}</div>
			<div style={{width:'8%', display:'table-cell',textAlign:'center'}}>
		 	 <Popup
			  hoverable
			  positionFixed
			  trigger={<a style={{height:18,width:'100%',color:'black',fontWeight:'bold',fontSize:12}}>{confTotale(event)}</a>}
  			  >
				<Grid centered divided>
				<Grid.Row style={{height:20}}>
				<Grid.Column width={10}>Totale Confezionato</Grid.Column><Grid.Column width={4}><b>{confTotaleDett('prima',event)}</b></Grid.Column>
				</Grid.Row>
				<Grid.Row style={{height:20}}>
				<Grid.Column width={10}>Prima Scelta</Grid.Column><Grid.Column width={4}><b>{event.avanzamento}</b></Grid.Column>
				</Grid.Row>
				<Grid.Row style={{height:20}}>
				<Grid.Column width={10}>Seconda Scelta</Grid.Column><Grid.Column width={4}><b>{confTotaleDett('sec',event)}</b></Grid.Column>
				</Grid.Row>
				<Grid.Row style={{height:20}}>
				<Grid.Column width={8}></Grid.Column><Grid.Column width={4}></Grid.Column>
				</Grid.Row>
				</Grid>
			</Popup> 
			</div>
			</div>
		</div>
		
		{/*
		<div style={{width:'100%',display:'table'}}>
			<div style={{width:'100%',display:'table-row'}}>
				<div style={{paddingLeft:10,paddingRight:10,  display:'table-cell',textAlign:'center'}}>
			     <Progress percent={event.progWork} size='tiny' color='green' style={{marginTop:4}}></Progress>
				</div> 
		    </div>
		</div>
      */}
	</div>
	</div>
	:
	<div className="rostering-item-template-tot"  style={{background}}>
	    <div className="left-column" style={{textAlign:'center',width:25}}>{getQtQliTot(event)}</div>
		<div className="center-column" style={{paddingLeft:6}}>{event.title}</div>
	</div>

	);
};

export default ItemTemplate;
