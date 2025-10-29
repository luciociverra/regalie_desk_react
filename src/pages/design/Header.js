import React, {useContext, useState} from "react";
import {SessionContext} from "components/SessionContext";
import {Button, Icon} from "semantic-ui-react";
import moment from "moment";
import Utils from "./Utils";
import {jAlert,jLog,log} from "api";

const Header = ({	schedulerData,
					item,
					style,
			}) => {
	const datetime = schedulerData.localeMoment(item.time);
	const [printIsSelect, setPrintIsSelect] = useState(false);
	const isCurrentDate = datetime.isSame(new Date(), "day");
    const italianDays=['dom','lun','mar','merc','giov','ven','sab']
	const {drawLottoHeads, sessionInfo} = useContext(SessionContext);
	// è sempre la stessa gestita cosi' se si vuole variare per sabato o dom...
	let classname = "header3-text";
 
	// colorazioni header a seconda del giorno
	const wkd = datetime.day();
	const lotto = moment(datetime).format('YY')+Utils.putTwo(moment(datetime).isoWeeks())+""+wkd;
	const hInfo=drawLottoHeads(lotto);
	//const headsInfo = sessionInfo.lotti.find((el) => el.lotto === lotto);
	// item {"time":"2022-09-20 00:00:00","nonWorkingTime":false}
    
	moment()
    style = {
		...style,
		fontWeight: "bold",
		backgroundColor:"#faf5f5",
		color: isCurrentDate ? "black" : "",
		padding:0,
		borderRight:"1px solid gray"
	};

	style.maxWidth = style.width;
	 
	function onInnerClick() {
		/*
		const oldEvents = schedulerData.events;
		schedulerData.setViewType(ViewTypes.Custom, false, schedulerData.isEventPerspective);
		schedulerData.setDate(datetime);
		schedulerData.setEvents(oldEvents);
		setSchedulerData(schedulerData);
 
		*/
	}

	const sendToPrint = async ()=>{
		const {lottiToPrint} = sessionInfo;
		 
		let myIndex= lottiToPrint.indexOf(lotto)
		if (myIndex < 0){
			lottiToPrint.push(lotto);
			setPrintIsSelect(true) 
		} else {
			lottiToPrint.splice(myIndex, 1)
			setPrintIsSelect(false)
		}
    	 
	}

	return (
		<th className={classname} style={style} onClick={onInnerClick}>
			<div style={{width:'100%',display:'table'}}>
			<div style={{width:'100%',fontSize:10,display:'table-row'}}>

			<div style={{width:'10%', display:'table-cell',textAlign:'left'}} >
				<Button onClick={()=>sendToPrint()} 
				                style={{width: 20, height: 30, backgroundColor: 'transparent',position:'relative',left:-8,
								title:"Seleziona questo lotto per la stampa"}}>
					 { ! printIsSelect  ? (
                          <Icon name="print" size= 'large' color= 'black'/>
                       ):(
                          <Icon name="print" size= 'large' color= 'green'/>
                       )}
				</Button>
			</div>
			
			<div style={{width:'50%', display:'table-cell',fontSize:15,fontWeight: "bold",	color: isCurrentDate && "black" }}>
				{moment(item.time, "YYYY-MM-DD HH:mm:ss").format("DD-MM")} {italianDays[wkd]}</div>

			<div style={{width:'40%', display:'table-cell',paddingLeft:10,paddingRight:5 }}>
				<div style={{backgroundColor:'#fcfce8',color:'red',border:'1px solid gray',
				             borderRadius:'15px 15px 15px 15px',fontSize:14}}>
				{lotto}
				</div>
			</div>
			</div>
			</div>
			
		
			<div style={{width:'100%',display:'table',marginTop:6,borderBottom:"0px solid black"}}>
			<div style={{width:'100%',fontSize:10,display:'table-row'}}>
				<div style={{width:'10%', display:'table-cell'}}>QL</div>
				<div style={{width:'30%', display:'table-cell'}}>Prodotto</div>
				<div style={{width:'60%', display:'table-cell'}}>
				<div style={{width:'100%',display:'table'}}>
			      <div style={{width:'100%',fontSize:10,display:'table-row'}}>
				  <div style={{width:'50%', display:'table-cell',textAlign:'center',backgroundColor:"#ffddcc"}}
				  title="Num. testata pasticceria">
				   {hInfo[0] && 'P: '+hInfo[0]}
				  </div>
			      <div style={{width:'50%', display:'table-cell',textAlign:'center',backgroundColor:"#80ffbf"}} 
				  title="Num. testata meccanico">
				  {hInfo[1] && 'M: '+hInfo[1]}
				  </div>
			      
				  </div>    
					</div>
				</div>
				</div>
			</div>
		</th>
	);
};

export default Header;
