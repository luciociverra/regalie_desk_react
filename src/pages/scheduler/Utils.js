import moment from "moment";
// usage  import Utils from "pages/scheduler/Utils";
class Utils {
	static capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
    static roundTwo(aValore){
      return (aValore % 1 !== 0) ? aValore.toFixed(2) : aValore;
	}
	static trunk(string, maxlenght) {
		if (!string || !string.length || string.length <= maxlenght) {
			return string;
		}
		return string.substring(0, maxlenght);
	}
    // temina con puntini dopo unc erto numero di caratteri
	static trunkDotted(string, maxlenght) {
		if (!string || !string.length || string.length <= maxlenght - 3) {
			return string;
		}
		return string.substring(0, maxlenght) + "...";
	}

	static formatRemoteDate(datestring) {
		return datestring && moment(datestring).format('YYYY-MM-DD HH:mm')
	}
    // usage alert(Utils.lottoFromDate("14/12/2021"));
   static lottoFromDate(aDate) {
		let datetime=moment(aDate, 'DD/MM/YYYY');
		const wkd = datetime.day();
		return moment(datetime).format('YY')+Utils.putTwo(moment(datetime).isoWeeks())+wkd;
	}

	static numDigits(x) {
		return x ? (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1 : 0;
	}

	static mustControlQta = (codice,descrizione) => {
		//alert(codice.startsWith("1") +"   e   "+codice.trim().endsWith("S/P"));
		if(codice.startsWith("1") && codice.trim().endsWith("S/P")) 
		{
		  return false;
		}
		if(descrizione.indexOf("SLICE")>=0) {
		  return false;
		}
		return true;
	  }	
	static isArray=(aObj)=> {
		return Array.isArray(aObj);
	  }
	static putTwo=(aNumber)=> {
		return aNumber<10 ? "0"+aNumber:aNumber;
	}
	static doubleIt (aNum) {
	 	return Number(aNum).toLocaleString("it-IT", {minimumFractionDigits: 0})
	}
    //date settimane iso 
	static firstDay(y,w){
		var dt1=this.weekToDate(y,w,1);
		return moment(dt1).format('YYYY-MM-DD');
	}
    // DATO ANNO E SETTIMANA torna prima data to senda data+6
	static weekRange(y,w) {
	  var dt1=this.weekToDate(y,w,1);
	  var dt2=this.weekToDate(y,w,7);
	  return moment(dt1).format('DD/MM/YY') +" -> "+ moment(dt2).format('DD/MM/YY');
	}
	static weekRangeArray(y,w) {
		var dt1=this.weekToDate(y,w,1);
		var dt2=this.weekToDate(y,w,7);
		return [moment(dt1),moment(dt2)];
	}
	static weekToDate(year, week, weekDay = 0) {
		const getZeroBasedIsoWeekDay = date => (date.getDay() + 6) % 7;
		const getIsoWeekDay = date => getZeroBasedIsoWeekDay(date) + 1;
		const zeroBasedWeek = week - 1;
		const zeroBasedWeekDay = weekDay - 1;
		let days = (zeroBasedWeek * 7) + zeroBasedWeekDay;
			// Dates start at 2017-01-01 and not 2017-01-00
			days += 1;
	  
		const firstDayOfYear = new Date(year, 0, 1);
		const firstIsoWeekDay = getIsoWeekDay(firstDayOfYear);
		const zeroBasedFirstIsoWeekDay = getZeroBasedIsoWeekDay(firstDayOfYear);
	  
		// If year begins with W52 or W53
		if (firstIsoWeekDay > 4) {
		  days += 8 - firstIsoWeekDay; 
		// Else begins with W01
		} else {
		  days -= zeroBasedFirstIsoWeekDay;
		}
		return new Date(year, 0, days);
	  }
     // data settimana e anno torno un array di date possibili
	 static nextTwoWeek(currentLotto,weekNumber,currentYear)
	 { 
	  let oggi     = moment();	
	  // tutte le date della settimana corrente maggiore di oggi
	  // settimana prossima  settimana prossima + 1
	  let allWeeks=[
  	    [weekNumber,currentYear],Utils.addTract(currentYear,weekNumber,1),Utils.addTract(currentYear,weekNumber,2)];
	   
	   let dateArray = [];
	   allWeeks.map((el, i) => {
		  let dates=Utils.weekRangeArray(el[1],el[0]);
		  var currDate = moment(dates[0]) ;
          var lastDate = moment(dates[1]) ;
          console.log(moment(dates[0]).format('DD/MM/YYYY')+" ----------"+dates[1]);  
		  let lotto=Utils.lottoFromDate(currDate);
		  if(moment(currDate).isAfter(oggi) && lotto!==currentLotto) 
		     dateArray.push([lotto,moment(currDate).format('DD/MM/YYYY')]);
          
		  while(currDate.add(1, 'days').diff(lastDate) < 0) {
             let aData=currDate.clone().toDate();
			 let lotto=Utils.lottoFromDate(aData);

			 if(moment(aData).isBefore(oggi)) continue;
			 if(lotto===currentLotto) continue;
			 dateArray.push([lotto,moment(aData).format('DD/MM/YYYY')]);
		 }
	   });
       //---------------  
	   return dateArray;
    }
	// ARRAY DI RITORNO Progressivo settimana anno di competenza
	static addTract (year, numero_settimana,num_sub) {
		let aW=(numero_settimana+num_sub);
		if(aW<53) return [aW,year];
		if(aW===53) return [1,parseInt(year)+1];
		if(aW===54) return [2,parseInt(year)+1];
		if(aW===55) return [3,parseInt(year)+1];
	}
	static subTract (year, numero_settimana,num_sub) {
		let aW=(numero_settimana-num_sub);
		if(aW>0)   return [aW,year];
		if(aW===0) return [52,parseInt(year)-1];
		if(aW<0)   return [51,parseInt(year)-1];
		return {aW,year};
	}
    // VASCHE
	static coloreVasca(desart) {
		if (desart.includes('TOP')){
		  return  "RGB(251, 255, 0)"
		};
		if (desart.includes('BOX')){
		  return   "RGB(129, 158, 69)"
		};
		if (desart.includes('PAST')){
		  return  "RGB(180, 93, 86)"
		} 
		return "#ffffff"
	 }

	 static coloreFase(codice) {
		if (codice==="RF1"){
		  return  "#f2f272"
		};
		if (codice==="R1G"){
			return   "#fff8b0"
		};
		return "#ffffff"
	 }
	
	 static isDispari(aNum)
        { return (aNum % 2 == 1 ?  true : false);}
		 
	}



export default Utils;
