//{eventState.codice} {" - "} {eventState.descrizione}
// {eventState.id} {" - "} {eventState.title}
export const mustControlQta = (codice,descrizione) => {
    if(true) return true;
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

  export const isArray=(aObj)=> {
    return Array.isArray(aObj);
  }

  export const calcolaQtaCoeff=(aItem)=> {
		if(aItem.coeffImpiego===1) return aItem.qta;
		return Math.round(aItem.qta * aItem.coeffImpiego);
	 } 