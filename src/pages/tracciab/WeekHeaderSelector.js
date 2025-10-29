import React from "react";
import moment from "moment";
import { Dropdown } from 'semantic-ui-react'
import { log } from "api";
import "./weekHeaderSelector.css";
import Utils from "../scheduler/Utils";
 
// DESK TOP AREA SINISTRA visualizza ANNO SETTIMANA CORRENTE - PREC SUCC

const WeekHeaderSelector = ({ schedulerData = {}, setSchedulerData, onSelectDate}) => {
	const {startDate} = schedulerData;
	const date  = moment(startDate).format('YYYY-MM-DD');
	const startWeek = moment(startDate).format('DD-MM-YYYY');
    
	const currentYear = moment(startDate).format('YYYY');
	const weekNumber=moment(date).isoWeeks();
	log("--datapartenza-"+date +" num. settimana--"+weekNumber); 
	const allWeeks=[
		Utils.subTract(currentYear,weekNumber,3),
		Utils.subTract(currentYear,weekNumber,2),
		Utils.subTract(currentYear,weekNumber,1),[weekNumber,currentYear],
		Utils.addTract(currentYear,weekNumber,1),
		Utils.addTract(currentYear,weekNumber,2),
		Utils.addTract(currentYear,weekNumber,3)
	];
	
	function onDateClick(weekNumber,aYear) {
		let formattedDay=Utils.firstDay(aYear,weekNumber);
		 
		schedulerData.startDate = formattedDay;
		schedulerData.endDate = formattedDay;
		const oldEvents = schedulerData.events;
		schedulerData.setDate(formattedDay);
		schedulerData.setEvents(oldEvents);
		setSchedulerData(schedulerData);
		onSelectDate(schedulerData,formattedDay)
	}
	function reloadCurrentDesk() {
	   onSelectDate(schedulerData,schedulerData.startDate)
	}

	return (
		<div className="date-header">
			 <div style={{width:80}}> <YearSelect year={currentYear}/></div>
			  {
		 	   allWeeks.map((el, i) => {
			 	const isCurrent = (el[0]===weekNumber);
				const className = "hoverable clickable";
				return (
					<div
						key={i}
						style={{
							color: isCurrent ? "black" : "",
							fontWeight: isCurrent ? "bold" : "",
							backgroundColor: isCurrent ? "rgb(211,211,211)" : "",
						}}
					>
						<div
							className={className}
							disabled={isCurrent}
							//onClick={() => (isCurrent ? null : onDateClick(el))}..non faccio nulla..
							onClick={() => (onDateClick(el[0],el[1]))}
							
						>
						<div className="day-name">{el[0]}</div>
						<div className="day-number">
							{Utils.weekRange(el[1],el[0])}
						</div>
						</div>
					</div>
				);
			})} 
			<div style={{width:200}}>{/*<SocketFunctions reloadCurrentDesk={reloadCurrentDesk}/>*/}</div>
		</div>
	);
};

const days = moment.weekdaysShort();

function YearSelect(props) {
  const handleOnChange = (e, data) => {
    	console.log(data.value);
  };
  let aYear=parseInt(props.year);
  const yearsOption=[{key:String(aYear-1), value: String(aYear-1),text: String(aYear-1)}];
  yearsOption.push({key:String(aYear), value: String(aYear),text: String(aYear) });
  yearsOption.push({key:String(aYear+1), value: String(aYear+1),text: String(aYear+1)});
  

  const getDropList = () => {
  	const year = parseInt(props.year);
    return (
    	Array.from( new Array(3), (v,i) =>
      	<option key={i} value={year+i}>{year+i}</option>
      )
    );
  };
    return (
      
		 <Dropdown  
		 compact
		 onChange={handleOnChange} 
		 selection
		 placeholder={props.year}
	 	 options={yearsOption} />
       
    )
 
}


export default WeekHeaderSelector;
