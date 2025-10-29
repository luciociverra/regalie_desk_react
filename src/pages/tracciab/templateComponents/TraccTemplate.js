import React,{useEffect} from "react";
import {jAlert,log} from "api";
import "pages/scheduler/templateComponents/itemTemplate.css";
import { getIsRtlScrollbarOnLeft } from "@fullcalendar/core";
const TraccTemplate = ({
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
	// riga 51 eventItemHeight
	const height = mustBeHeight; // altezza elemento definita in src\pages\scheduler\schedulerSetup.js
	 
    const titleString = ``;
 	const editItem=(e)=> {
		editEvent(event);
	}
	const getQtQli=()=> {
		if(event.tipologia.toLocaleLowerCase()==="ls") return event.qta *2;
		return event.qta;
	}

	const getColor=()=> {
		if(event.cp!=="")
		  return "white";
		return "trasparent";
	}
	
	const getCellColor=()=> {
		let c=`${event.bgColor}`;
		if(event.qtaEv===0 && event.cp==="")
		{
		return {
			backgroundColor: c,
			backgroundImage: "repeating-linear-gradient(-20deg, #ccc, #ccc 2px," + c +" 0px,"+c+" 10px"
	    }} else
		{
			return {
				backgroundColor: c
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
 
	<div key={event.id+event.lotto} 
	     className={className} style={{height}}  title={titleString} onClick={e => editItem(e)}>
		<div className="rostering-item-template" style={getCellColor()}>
		<div style={{width:'100%',display:'table'}}>
			<div style={{width:'100%',fontWeight: "bold",display:'table-row'}} className={'cellFont'}>
			 <div style={{width:'8%',  display:'table-cell',textAlign:'center',backgroundColor:getColor()}}>
				{getQtQli()}</div>
			 <div style={{width:'84%', display:'table-cell',textAlign:'center'}}>{event.id} </div>
			 <div style={{width:'8%',  display:'table-cell',textAlign:'center'}}></div>
			</div>
		</div>

		<div style={{width:'100%',display:'table',marginTop:-4}}>
			<div style={{fontWeight: "bold",display:'table-row'}} className={'cellFont'}>
			<div style={{width:'100%', display:'table-cell',textAlign:'center'}}>{event.title}</div>
			</div>
		</div>
		<div style={{width:'100%',display:'table',marginTop:-6}}>
			<div style={{fontWeight: "bold",display:'table-row'}} className={'cellFontNota'}>
			<div style={{width:'100%', display:'table-cell',textAlign:'center'}}>{event.notaRiga}</div>
			</div>
		</div>
	</div>
	</div>
	 

	);
};

export default TraccTemplate;
