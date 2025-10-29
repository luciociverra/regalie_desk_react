import {log} from "api";
import {createContext, useState,useEffect } from 'react';
const defaultSessionInfo = {
	user: undefined,  // codice utente (autenticato)
	userName:undefined,  // rag soc .. solo descriz
	loginPhase: "offline",
	company: undefined,
	abilitazioni:[],  //elenco abilit.
	homeMenu:[],  // elenco abilitazioni per l'home menu
	lotti:[],     // variabile di appoggio per testata
	deskParam:[],  // salvataggio ultimi parametri usati per mostre la lavagna (x reports)
    lottiToPrint:[] // salvataggio lotti selezionati ultimi parametri usati per mostre la lavagna (x reports)
};
 
export const SessionContext = createContext(null);

export const SessionContextProvider  = ({ children }) => {
	const [sessionInfo, setSessionInfo] =useState(JSON.parse(localStorage.getItem('sessInfo')) || null);
	 useEffect(() => {
		log("SessionContext use Effects "+JSON.stringify(sessionInfo));
		if(! sessionInfo) { 	
			log("Imposto default");
			setSessionInfo(defaultSessionInfo);
		}
	 }, []);

	const setLoginData=(aLoginData)=>{
		//jAlert(aLoginData);
		setSessionInfo(aLoginData);
		localStorage.setItem('sessInfo', JSON.stringify(aLoginData));
	}
	const setLotti=(aLotti)=>{
		defaultSessionInfo.lotti=aLotti;
	}
	const logOff=()=>{
		setSessionInfo(defaultSessionInfo);
		localStorage.removeItem('sessInfo');
	}
	//const isLoginValid = () => false;
	const isLoginValid = () => sessionInfo?.loginPhase==="ok";
	// Tutti i record di --> from y_wdesk_user_function A where action_type=1 
	const haveMainMenu = () => {
		//return sessionInfo?.homeMenu.length>1; 
	    return false;
	}	
	const isAuthorized = (aMenu) => {
		try{
			return sessionInfo.abilitazioni.includes(aMenu);
		} catch(e){
			return false;
		}	
	 }
	 const drawLottoHeads = (aLotto) => {
		try {
		 let hInfo=sessionInfo.lotti.find(el => String(el.lotto) === String(aLotto));
		 return [hInfo.phead,hInfo.mhead];
		} catch(e){ return [null,null];}
	 }
	 
	return (
		<SessionContext.Provider value={{sessionInfo,setLoginData,isAuthorized,logOff,isLoginValid,drawLottoHeads,haveMainMenu}}>
		{children}
		</SessionContext.Provider>
	);
};

export const isUserActive = (sessionInfo ) => {
	return true;
}
