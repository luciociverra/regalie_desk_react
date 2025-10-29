import React , {Component,useContext} from "react";
import moment from "moment";
import Scheduler from "react-big-scheduler";
//import _ from "lodash";

import ItemTemplate from "./templateComponents/ItemTemplate";
import Header from "./Header";
import ViewSelector from "./ViewSelector";
import WeekHeaderSelector from "./WeekHeaderSelector";
import WrappedDialog from "./generalComponents/WrappedDialog";
import SlotItemTemplate from "./templateComponents/SlotItemTemplate";
import {apiRequest,jAlert,log,jLog} from "api";
import {SessionContext} from "components/SessionContext";

import "./scheduler.css";
import "react-big-scheduler/lib/css/style.css";
import "antd/dist/antd.css";
import withDragDropContext from "./util/withDragDropContext";
 
import {OrderMovePanel} from "./OrderMovePanel";
import {OrderNewPanel} from "./OrderNewPanel";
import {OrderEditPanel} from "./OrderEditPanel";
import {OrderSortPast} from "./OrderSortPast";
import Utils from "./Utils";
import { Alert } from "react-bootstrap";
const START_END_FORMAT = "YYYY-MM-DD HH:mm:00"

//Questo è il componente dove viene usata la libreria react-big-scheduler, è simile ai file di esempio che ci sono nella documentazione
//In sostanza viene inserito schedulerData nel componente scheduler e poi vengono inseriti i prop giusti e le funzioni per muovere/creare etc i turni
class DeskScheduler extends Component {
	static contextType = SessionContext;
	constructor(props) {
		super(props);
		this.state = {
			//Stato che controlla il dialog
			dialog: {
				visible: false,
				header: "",
				message: "",
				onConfirm: () => {
				},
				onAbort: () => {
				}
			},
			//stato che tiene l'evento copiato tramite il bottone su itemTemplate
			clipboardEvent: null,
			//turni cancellati, servono per controllo asincrono errori con il server
			deletedIds: [],
			//stato che mi dice se la validazione asincrona è in corso
			asyncValidating: false,

			overlayMovePanel:false, // Apre OrderMainPanel
			overlayNewPanel:false,  // Apre OrderNewPanel
			overlayEditPanel:false, // Apre OrderEditPanel
			overlaySortPanel:false, // Apre OrderEditPanel
			digitLavagna:false,
			prodotti:[], // Lista prodotti per categoria merceologica
			overlayContext:undefined,
			eventState:undefined,  // struttura base prodotto / lotto
			lastEventState:undefined, // struttura base prodotto / lotto x modifica
			error:"",
			confirmUnfinaliseModalOpen:false
		};
		this.opRef = React.createRef();
		// this.onRowEditInit = this.onRowEditInit.bind(this);

		this.eventUpdate=this.eventUpdate.bind(this);
		this.eventDelete=this.eventDelete.bind(this);
		this.showOverlayMove=this.showOverlayMove.bind(this);
		this.showOverlayEdit=this.showOverlayEdit.bind(this);
		this.setState=this.setState.bind(this);
	}

	render() {
		const {
			schedulerMode,
			schedulerData,
			setSchedulerData,
			deskData,
			dataSaved,
			windowWidth,
			windowHeight
		} = this.props;
		const {dialog, asyncValidating} = this.state;
		//log(" fie principale --src pages scheduler Scheduler.js -"+windowWidth);
		// console.log(schedulerData);
		return (
			<div className={schedulerMode}>
				{/* AVVISO AUTOMATICO SU OGNI RELOAD
				<Prompt
					when={!dataSaved}
					message="You have unsaved DATA. Are you sure you want to leave?"
				/>
		        */}
				<WrappedDialog
					visible={dialog.visible}
					setVisible={isVisible => this.setState({dialog: {visible: isVisible}})}
					header={dialog.header}
					onConfirm={dialog.onConfirm}
					onAbort={dialog.onAbort}
				>
					{dialog.message}
				</WrappedDialog>
				{/*Il componente scheduler della libreria react-big-scheduler */}
				<Scheduler
					schedulerData={schedulerData}
					prevClick={this.prevClick}
					onSelectDate={this.props.onSelectDate}
					nextClick={this.nextClick}
					//
					updateEventStart={this.updateEventStart}
					updateEventEnd={this.updateEventEnd}
					moveEvent={this.moveEvent}
					newEvent={this.newEvent}
					//non serve ma è obbligatorio
					onViewChange={() => {}}
					//
					eventItemTemplateResolver={this.eventItemTemplateResolver}
					//PRIMA COLONNA SX
					slotItemTemplateResolver={this.slotItemTemplateResolver} 
					//TESTATA colonne
					nonAgendaCellHeaderTemplateResolver={this.headerResolver}
					//VIENE MOSTRATO E NASCOSTO TRAMITE CSS IN SELETTORE "#RBS-Scheduler-root thead ..."
					leftCustomHeader={
						// al posto del calendario a sinistra
						<WeekHeaderSelector
							schedulerMode={schedulerMode}
							schedulerData={schedulerData}
							setSchedulerData={setSchedulerData}
							deskData={deskData}
							onSelectDate={this.props.onSelectDate}
						/>
					}
					//SELEZIONATORE VIEW DI DEFAULT VIENE NASCOSTO TRAMITE CSS COME SOPRA
					rightCustomHeader={
						//Questo è il componente che visualizza gli elementi a destra appena sopra la tabella
						//Selezionatore Day/week, location/employee e il label con la data/nome template che visualizza gli errori
						<ViewSelector
							schedulerMode={schedulerMode}
							schedulerData={schedulerData}
							setSchedulerData={setSchedulerData}
							deskData={deskData}
							dataSaved={dataSaved}
							windowHeight={windowHeight}
							windowWidth={windowWidth}
						/>
					}
				/>
				<OrderMovePanel  scheduler={this}  reloadDesk={this.reloadDesk}/>
				<OrderNewPanel   scheduler={this}  reloadDesk={this.reloadDesk} deskData={deskData}/>
				<OrderEditPanel  scheduler={this}  reloadDesk={this.reloadDesk} movePanelTo={this.movePanelTo} 
				                 colorChange={this.colorChange} colorReset={this.colorReset} />
				<OrderSortPast   scheduler={this}  reloadDesk={this.reloadDesk}/>
			
			</div>
		);
	}

	//EVENTS
	eventUpdate() {
		alert("eventUpdate"); 
	}
	//funzione che cancella l'evento dallo scheduler e inserisce l'id dell'evento cancellato in deleteIds (stato tenuto in scheduler)
	//deleteIds serve per la richeista di validazione asincrona
	eventDelete(event) {
		alert("evenDelete");
	}
	
	setLoading=(aFlag)=>{
		this.setLoading(aFlag);
	}
	 
	//DIALOG
	showDialog = (dlgHeader, dlgMessage, dlgOnConfirm, dlgOnAbort) => {
		this.setState({
			dialog: {
				visible: true,
				header: dlgHeader,
				message: dlgMessage,
				onConfirm: dlgOnConfirm,
				onAbort: dlgOnAbort
			}
		});
	};
	// popup modifica vecchia struttura - nuova struttura
	showOverlayMove(lastEvent,newEvent,foundInWeek) {
		this.setState({
			overlayMovePanel:true,  // tipologia visualizzazione
			digitLavagna:true,
			lastEventState: lastEvent, //vecchio
			eventState: newEvent,  // nuovo
			foundInWeek: foundInWeek
		})
    }
	// 
	showOverlaySort(headList) {
		this.setState({
			overlaySortPanel:true,  // tipologia visualizzazione
			eventState: headList    // lista lotto/past da riordinare
		})
    }

	// apertura popup nuovo ordine
	showOverlayNew(newEvent) {
		 
 		this.setState({
			overlayNewPanel:true,  // tipologia visualizzazione
			overlayMovePanel:false,
			overlayEditPanel:false,
			overlaySortPanel:false,
			digitLavagna:this.canDigitLavagna(newEvent),
		    eventState: newEvent
		})
    }
	// apertura popup edit ordine
	showOverlayEdit(newEvent) {
		this.setState({
		   overlayNewPanel:false,
		   overlayMovePanel:false,
		   overlaySortPanel:false,
		   overlayEditPanel:true,  // tipologia visualizzazione
		   digitLavagna:this.canDigitLavagna(newEvent),
		   eventState: newEvent
	   })
   }
	canDigitLavagna =(item)=>{
		if(item) { 
		  if(item.cp !== "") return false;
		}
		const {isAuthorized} =this.context ;
		return isAuthorized("DGT_LAVAGNA");
	}
	
	canDigitItem = (currentLotto)=>{
		const lottoToday=moment().format('YY')+""+Utils.putTwo(moment().isoWeeks())+""+moment().day();
		if(parseInt(lottoToday) > parseInt(currentLotto))
		   return false;
		return true;   
	}
	
	editEvent = async (item) => {
		const {setLoading} = this.props;
		//jAlert(item);
		setLoading(true);
 		// recupero resa e nota testata
		// ho dotes e dorig
		let requestDataResa = {"resourceId": item.resourceId,"lotto": item.lotto};
	 	const datiResa = await apiRequest({
			method: 'POST',
			url: 'resa',
			user: this.props.user,
			data: requestDataResa,
		}) ;
	    if(parseInt(datiResa.data.resa)===0){
			alert("Impossibile recuperare la resa prodotto");
			setLoading(false);
			return;
		} else {
			item.resa=parseInt(datiResa.data.resa);
			item.nota=datiResa.data.notaTestata;
		}

		let requestData = {"resourceId": item.resourceId,lotto:item.lotto};
		const prodottiList = await apiRequest({
			method: 'POST',
			url: 'productedit',
			user: this.props.user,
			data: requestData,
		}) ;
	    this.setState({prodotti: prodottiList.data});
		// attenzione recupero tutti i meccanici usati o no 
		// accodo le informazioni come se le aspetta il programma di scrittura
		item.details=prodottiList.data.details;
		item.data=item.start;
		item.codice=item.resourceId;
		item.canDigit=this.canDigitItem(item.lotto);
		setLoading(false);
	    this.showOverlayEdit(item);
    };

	newEvent = async (schedulerData, event,groupId, slotName, start, end, type, item) => {
		 
		//alert(event); //Panettoni - Focacce
		const {setLoading} = this.props;
		if(!this.canDigitLavagna(null)) {alert('Funzione non permessa');return;}
		if(groupId.indexOf("tot")===0) { log("cliccato su riga tot"); return; };
		// tutte le tipologie di prima colonna sx
		let resourceType = schedulerData.eventGroups.find(e => String(e.id) === String(event));
		if(resourceType.type==='T') { log("cliccato su riga tot"); return; };

		setLoading(true);
		let endWeekNumber = moment(start).isoWeek();
	    let endYearNumber = moment(start).format("YY");
		let endWeekDay    = moment(start).isoWeekday();
		let lotto=endYearNumber+""+Utils.putTwo(endWeekNumber)+""+endWeekDay;
		 
		if(! this.canDigitItem(lotto)){
			setLoading(false);
			alert('Funzione non permessa');
			return;
		} 
		const prodottiList = await apiRequest({
			method: 'GET',
			url: 'productlist/'+groupId,
			user: this.props.user,
		}) ;
		this.setState({	prodotti: prodottiList.data	});
		//alert("newEvent -> " + groupId+" "+start+"  "+lotto +" "+this.state.prodotti.length);
		let newEvent ={"groupId": groupId,"lotto":lotto,"data":start,"tipologia":resourceType.tipologia}
		setLoading(false);
		this.showOverlayNew(newEvent);
    };
	
	moveEvent = async (schedulerData, event, slotId, slotName, start, end) => {
		// event= l'oggetto che sto spostando  
		// event.id articolo.. event.title descriz articolo etc... es943/P
		// slotId=la famiglia es: Panettoni 
		// slotName=la famiglia es: Panettoni 
		// start-end la data di arrivo
		if(!this.canDigitLavagna(event)) return;
		if(! this.canDigitItem(event.lotto)){
			return;
		} 
		const {setLoading} = this.props;
		let foundInWeek=false;
        // calcolo lotto arrivo
		let endWeekNumber=moment(start).isoWeek();
	    let endYearNumber=moment(start).format("YY");
		//// returns 1-7 where 1 is Monday and 7 is Sunday
		let endWeekDay=moment(start).isoWeekday();
		let lottoPartenza=event.lotto;
		let lottoDestinazione=endYearNumber+""+Utils.putTwo(endWeekNumber)+""+endWeekDay;
		if(! this.canDigitItem(lottoDestinazione)){
			return;
		} 
		//alert(start+"  "+lottoDestinazione);
	    // non sposto su classi merceologiche diverse	
		if(slotId!==event.groupId) return;
		/* NB ||| oggetto event  o schedulerData.events
		{"tipologia":"Ls","resourceId":"994/P","groupId":"Panettoni","prog_view":1,"id":"994/P",
		"title":"PT TOP MAGNUM LATTE 500","qta":1,"oi":"OI 253","ndoc":"253","stp":"N","bgColor":"#FBF0B7",
		"start":"2022-07-01 09:00:00","end":"2022-07-01 18:00:00","wkday":4,"groupName":"Panettoni"}
		data-2023-02-17 00:00:02, end: 2023-02-16 00:00:02 , lottoEnd: 23074, fgColor bgColor
		*/
		event.data=event.start;
		event.end=start;
		event.lottoEnd=lottoDestinazione;
		//partenza arrivo uguali
	 	if(lottoPartenza==lottoDestinazione) {  
			//
			//let pastEvents=schedulerData.events.filter((e) => 
			//               e.groupId === event.groupId && e.lotto===event.lotto)
	        // tutti i lievitati e non lievitati 
			let pastEvents=schedulerData.events.filter((e) => 
			    e.tipologia === event.tipologia && e.lotto===event.lotto)
	      
		   if(pastEvents.length>1) {
              this.showOverlaySort(pastEvents);
		      return;
			} else {
			  return;
			}
		}
		// inizio elaborazione
		setLoading(true);
        //
		let requestDataResa = {"resourceId": event.resourceId,"lotto": event.lotto};
	 	const datiResa = await apiRequest({
			method: 'POST',
			url: 'resa',
			user: this.props.user,
			data: requestDataResa,
		}) ;
	    if(parseInt(datiResa.data.resa)===0){
			alert("Impossibile recuperare la resa prodotto");
			setLoading(false);
			return;
		} else {
			event.resa=parseInt(datiResa.data.resa);
			event.nota=datiResa.data.notaTestata;
		}
		// carico vecchio item codice prodotto + lotto sicuramente esiste
		let requestDataExist = {"resourceId": event.resourceId,"lotto":event.lottoEnd};
		const requestExist = await apiRequest({
			method: 'POST',
			url: 'productexist',
			user: this.props.user,
			data: requestDataExist,
		});

		let nuovoInDestinazione=parseInt(requestExist.data.rc)===0;
		 
		// carico vecchio item codice prodotto + lotto sicuramente esiste
		let requestData = {"resourceId": event.resourceId,lotto:event.lotto};
		const prodottiList = await apiRequest({
			method: 'POST',
			url: 'productedit',
			user: this.props.user,
			data: requestData,
		}) ;
		event.details=prodottiList.data.details;
		    // Attenzione clono oggetto
	    let eventNew=Object.assign( {}, event );  
		eventNew.data=event.end;		
		eventNew.lotto=event.lottoEnd;
		eventNew.codice=event.resourceId; //attenzione
	 	// carico l'arrivo coi dati già presenti
		// fine vecchio cerco nell'arrrivo il mesdesimo articolo
		let newPosItem=schedulerData.events
					.filter((item) => item.resourceId === event.id && item.lotto===event.lottoEnd);
		if(newPosItem && newPosItem.length===1)  
		{
			eventNew=newPosItem[0];
			eventNew.data=newPosItem[0].end;		
			eventNew.lotto=event.lottoEnd;
		 	eventNew.codice=eventNew.resourceId; //attenzione
			eventNew.qta=newPosItem[0].qta;
			eventNew.mustDelete=true;
	    // esiste nel nuovo lotto gia' una produzione per il medesimo articolo?
		let requestDataArrivo = {"resourceId": eventNew.resourceId,lotto:newPosItem[0].lotto};
		const prodottiListArrivo = await apiRequest({
			method: 'POST',
			url: 'productedit',
			user: this.props.user,
			data: requestDataArrivo,
		}) ;
		 
		eventNew.details=prodottiListArrivo.data.details;
		 
		//jAlert(prodottiListArrivo.data.details);
	    }
	    
		if(nuovoInDestinazione){

			let cColor=this.props.deskData.customsColor.find(e => (String(e.lotto) === String(lottoPartenza) && e.articolo===event.id));
			if(cColor){
				eventNew.fg_color=cColor.fgColor;
				eventNew.bg_color=cColor.bgColor;
			}
		    
			const response = await apiRequest({
			   method: "POST",
			   url: "/pocreate",
			   data: eventNew,
			   user: this.props.user,
		   });
		   
		   if(parseInt(response.data.rc)===0) 
		   {
			   const deleteInfo ={
				   lotto:lottoPartenza,
				   articoli:[]	  
			   }
			   deleteInfo.articoli.push(event.resourceId);
			   event.details.map((item) => { deleteInfo.articoli.push(item.codice)});
			   const responseDel = await apiRequest({
				   method: "DELETE",
				   url: "/podelete",
				   data: deleteInfo,
				   user: this.props.user,
			   });

			   setLoading(false);
			   if(parseInt(responseDel.data.rc)===1) {
				   alert("Attenzione OI originale non eliminato-consultare l'assistenza !");
			   } else {
				   this.reloadDesk();
				   return;
			   }
		   } else {
			   setLoading(false);
			   alert("Attenzione nuovo OI non creato  consultare l'assistenza !");
		   }
		   return;
	   }
        // NON FACCIO TUTTO MA APRO FINESTRA SPOSTAMENTO 
		setLoading(false);
		this.showOverlayMove(event,eventNew,true);
	};

	colorChange = async (lotto,articolo,bg_color,fg_color) => {
	   let requestData = {"lotto": lotto,"articolo": articolo,"bgColor":bg_color,"fgColor":fg_color};
	   await apiRequest({
		   method: 'POST',
		   url: 'custom_color',
		   user: this.props.user,
		   data: requestData,
	   }) ;
    };
   colorReset = async (lotto,articolo) => {
	  let requestData = {"lotto": lotto,"articolo": articolo};
	  await apiRequest({
		  method: 'DELETE',
		  url: 'custom_color',
		  user: this.props.user,
		  data: requestData,
	  });
    }; 
    
	updateEventStart = (schedulerData, event, newStart) => {
		schedulerData.updateEventStart(event, newStart);
	};

	updateEventEnd = (schedulerData, event, newEnd) => {
		schedulerData.updateEventEnd(event, newEnd);
	};
    
	prevClick = schedulerData => {
		 alert("prevClick");
		 this.props.loadDesk(this.props.schedulerData);
	};

	reloadDesk = () => {
		log("reloadDesk");
		this.props.loadDesk(this.props.schedulerData);
   };
   //-----------------------------------------------------------------------
   //  
   movePanelTo = async (event,dataPartenza,dataArrivo,lottoArrivo) => {
	   
	    const {setLoading,schedulerData} = this.props;
	    event.end=dataArrivo;
		event.lottoEnd=lottoArrivo;
	 	// inizio elaborazione
	 
	    setLoading(true);
        // clono
		let eventNew=Object.assign( {}, event );  
		eventNew.data=event.end;		
		eventNew.lotto=event.lottoEnd;
		eventNew.codice=event.resourceId; //attenzione

        let foundInWeek=false;  
		let newPosItem=schedulerData.events
		.filter((item) => item.resourceId === event.id && item.lotto===event.lottoEnd);
		if(newPosItem && newPosItem.length===1)  
		{
			log("Found in same week");
			foundInWeek=true;
			eventNew=newPosItem[0];
			eventNew.data=newPosItem[0].end;		
			eventNew.lotto=event.lottoEnd;
			eventNew.codice=eventNew.resourceId; //attenzione
			eventNew.qta=newPosItem[0].qta;
			eventNew.mustDelete=true;
			let requestDataArrivo = {"resourceId": eventNew.resourceId,"lotto":newPosItem[0].lotto};
			const prodottiListArrivo = await apiRequest({
				method: 'POST',
				url: 'productedit',
				user: this.props.user,
				data: requestDataArrivo,
		    }) ;
		    eventNew.details=prodottiListArrivo.data.details;
		}
	
	    // esiste nel nuovo lotta gia' una produzione per il medesimo articolo?
		if(! foundInWeek) 
		{
		 let requestDataArrivo = {"resourceId": eventNew.resourceId,"lotto":lottoArrivo};
		  
		 const existResponse = await apiRequest({
			method: 'POST',
			url: 'productfind',
			user: this.props.user,
			data: requestDataArrivo,
		 });
		
		 setLoading(false);
	 
	 	 if(existResponse.data) {
			foundInWeek=true;
			eventNew=existResponse.data;
			eventNew.data=dataArrivo;
			eventNew.tipologia=event.tipologia;
		 } 
	    }
		setLoading(false);
	    this.showOverlayMove(event,eventNew,foundInWeek);
    };
	//-----------------------------------------------
	nextClick = schedulerData => {
		alert("nextClick ");
	};

	//TEMPLATE RESOLVERS

	eventItemTemplateResolver = (
		schedulerData,
		event,
		bgColor,
		isStart,
		isEnd,
		mustAddCssClass,
		mustBeHeight,
		agendaMaxEventWidth
	) => {
		const {
			schedulerMode,
			deskData,
			setSchedulerData,
			setDataSaved,
			shiftErrors,
			asyncShiftErrors,
			shiftWarnings,
			blocked,
			employeeAction,
			forceConfirmRoster
		} = this.props;
		return (
			<ItemTemplate
				//BIG SCHEDULER PROPS
				scheduler={this}
				schedulerMode={schedulerMode}
				schedulerData={schedulerData}
				event={event}
				bgColor={bgColor}
				isStart={isStart}
				isEnd={isEnd}
				mustAddCssClass={mustAddCssClass}
				mustBeHeight={mustBeHeight}
				agendaMaxEventWidth={agendaMaxEventWidth}
				deskData={deskData}
				setSchedulerData={setSchedulerData}
				blocked={blocked}
				deletedIds={this.state.deletedIds}
				editEvent={this.editEvent}
			/>
		);
	};
    //https://github.com/StephenChou1017/react-big-scheduler/blob/master/README.md
	slotItemTemplateResolver = (schedulerData, slot, slotClickedFunc, width, clsName) => {
		const {deskData} = this.props;
		return (
			<SlotItemTemplate
				schedulerData={schedulerData}
				slot={slot}
				slotClickedFunc={slotClickedFunc}
				width={width}
				clsName={clsName}
				deskData={deskData}
			/>
		);
	};

	headerResolver = (schedulerData,item, formattedDateItems, style ) => {
		const {setSchedulerData, schedulerMode,deskData} = this.props;
		return (
			<Header
				key={item.time}
				//prop base
				schedulerData={schedulerData}
				item={item}
				formattedDateItems={formattedDateItems}
				style={style}
				//prop aggiunte
				setSchedulerData={setSchedulerData}
				schedulerMode={schedulerMode}
			 />
		);
	};
	
	//OTHER
	addDeletedId = deletedId => {
		this.setState(prevState => ({deletedIds: [...prevState.deletedIds, deletedId]}));
	};

}

export default withDragDropContext(DeskScheduler);
