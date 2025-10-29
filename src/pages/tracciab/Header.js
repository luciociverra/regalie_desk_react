import React, {useContext,useEffect, useState} from "react";
import {SessionContext} from "components/SessionContext";
import {Button, Icon} from "semantic-ui-react";
import moment from "moment";
import Utils from "../scheduler/Utils";
import {jAlert,jLog,log} from "api";
import { clearAsyncError } from "redux-form";

const Header = ({	schedulerData,
					item,
					style,
			}) => {
	const datetime = schedulerData.localeMoment(item.time);
	const [printIsSelect, setPrintIsSelect] = useState(false);
	const isCurrentDate = datetime.isSame(new Date(), "day");
    const italianDays=['dom','lun','mar','merc','giov','ven','sab']
	const {drawLottoHeads, sessionInfo} = useContext(SessionContext);
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
		backgroundColor:'#b3cccc',
		color: isCurrentDate ? "black" : ""
	};
    style.maxWidth = style.width;
	 

	return (
		<th className={classname} style={style} >
			<div style={{width:'100%',display:'table'}}>
			<div style={{width:'100%',fontSize:10,display:'table-row'}}>

			
			<div style={{width:'55%', display:'table-cell',fontSize:16,fontWeight: "bold",	color: isCurrentDate && "black" }}>
				{moment(item.time, "YYYY-MM-DD HH:mm:ss").format("DD-MM")} {italianDays[wkd]}</div>

			<div style={{width:'45%', display:'table-cell',paddingLeft:10,paddingRight:5 }}>
				<div style={{backgroundColor:'#fcfce8',color:'red',border:'1px solid gray',
				//left rigt left right
				borderRadius:'15px 15px 15px 15px',fontSize:14}}>
				{lotto}
				</div>
			</div>
			</div>
			</div>
			
		    {/*
			<div style={{width:'100%',display:'table',marginTop:8}}>
			<div style={{width:'100%',fontSize:10,display:'table-row'}}>
				<div style={{width:'10%', display:'table-cell'}}>QL</div>
				<div style={{width:'40%', display:'table-cell'}}>Prodotto</div>
				<div style={{width:'50%', display:'table-cell'}}>
				<div style={{width:'100%',display:'table'}}>
			      <div style={{width:'100%',fontSize:10,display:'table-row'}}>
				  <div style={{width:'50%', display:'table-cell',textAlign:'center',backgroundColor:"#ffddcc"}}
				  title="Num. tetsta pasticceria">
				   {hInfo[0] && 'P: '+hInfo[0]}
				  </div>
			      <div style={{width:'50%', display:'table-cell',textAlign:'center',backgroundColor:"#80ffbf"}} 
				  title="Num. tetsta meccanico">
				  {hInfo[1] && 'M: '+hInfo[1]}
				  </div>
			      
				  </div>    
					</div>
				</div>
				</div>
			</div>
	    */}
		</th>
	);
};

export default Header;
