import React , {Component,useContext} from "react";
import moment from "moment";
import Scheduler from "react-big-scheduler";

import ItemTemplate from "./templateComponents/TraccTemplate";
import Header from "./Header";
import ViewSelector from "./ViewSelector";
import WeekHeaderSelector from "./WeekHeaderSelector";
import WrappedDialog from "pages/scheduler/generalComponents/WrappedDialog";
import LeftItemTemplate from "./templateComponents/LeftItemTemplate";
import {apiRequest,jAlert,log,jLog} from "api";
import {SessionContext} from "components/SessionContext";

import "./scheduler.css";
import "react-big-scheduler/lib/css/style.css";
import "antd/dist/antd.css";
import withDragDropContext from "../scheduler/util/withDragDropContext";
import {TraccEditPanel} from "./TraccEditPanel";
import {TraccViewPanel} from "./TraccViewPanel";
import Utils from "pages/scheduler/Utils";
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
			//stato che mi dice se la validazione asincrona è in corso
			asyncValidating: false,
			overlayEditPanel:false, // Apre OrderEditPanel
			overlayEditView :false, // Apre OrderEditPanel
			digitLavagna:false,
			prodotti:[], // Lista prodotti per categoria merceologica
			overlayContext:undefined,
			eventState:undefined,  // struttura base prodotto / lotto
			lastEventState:undefined, // struttura base prodotto / lotto x modifica
			error:"",
			confirmUnfinaliseModalOpen:false
		};
		this.opRef = React.createRef();
	 	this.showOverlayEdit=this.showOverlayEdit.bind(this);
		 this.showOverlayView=this.showOverlayView.bind(this);
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
					
					//non serve ma è obbligatorio
					onViewChange={() => {}}
					//
					eventItemTemplateResolver={this.eventItemTemplateResolver}
					//PRIMA COLONNA SX
					slotItemTemplateResolver={this.leftItemTemplateResolver} 
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
				<TraccEditPanel  scheduler={this}  reloadDesk={this.reloadDesk}/>
				<TraccViewPanel  scheduler={this}  reloadDesk={this.reloadDesk}/>
				
			</div>
		);
	}

	//EVENTS
	//eventUpdate() {	}
	//eventDelete(event) {}
	setLoading=(aFlag)=>{
		this.setLoading(aFlag);
	}
	//DIALOG
	showDialog = (dlgHeader, dlgMessage, dlgOnConfirm, dlgOnAbort) => {
		 
	};
 	// apertura popup edit CP
	showOverlayEdit(newEvent) {
		this.setState({
		   overlayEditPanel:true,  // tipologia visualizzazione
		   overlayViewPanel:false,  
		   digitLavagna:true,
		   eventState: newEvent
	   })
   }
 	// apertura popup view CP
	 showOverlayView(newEvent) {
		 
		this.setState({
		   overlayViewPanel:true,  // tipologia visualizzazione
		   overlayEditPanel:false, 
		   digitLavagna:true,
		   eventState: newEvent
	   })
   }

   canDigitLavagna =()=>{
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
		const {setLoading,deskData} = this.props;
		if(item.cp!=="") {
			this.viewEvent(item);
			return;
		  }
		if(item.qtaEv===0)
		{
			
			return;
		}
		
		setLoading(true);
		var resaReale= item.qta  * item.resa;
		// recupero resa e nota testata
		// ho dotes e dorig
		let flagLiev=item.tipologia==="Ls"?"S":"N";
		let requestData = {"resourceId": item.resourceId,"lotto": item.lotto,
		                   "lievitato":flagLiev,"resa":resaReale };
		// RIGHE MATERIE PRIME 
	 	const prodottiList = await apiRequest({
			method: 'POST',
			url: 'traccedit',
			user: this.props.user,
			data: requestData,
		}) ;
	    this.setState({prodotti: prodottiList.data});
		// attenzione recupero tutti i meccanici usati o no 
	
		item.details=prodottiList.data.details;
		item.materiePrime=prodottiList.data.materiePrime;
		item.lottiSparati=prodottiList.data.lottiSparati;
		//jAlert(item.lottiSparati);
		item.data=item.start;
		item.codice=item.resourceId;
		item.canDigit=this.canDigitItem(item.lotto);
		setLoading(false);
		//jAlert(item);
	    this.showOverlayEdit(item);
    };


	viewEvent = async (item) => {
		 
		const {setLoading,deskData} = this.props;
		setLoading(true);
		var resaReale= item.qta  * item.resa;
		let flagLiev=item.tipologia==="Ls"?"S":"N";
		let requestData = {"resourceId": item.resourceId,"lotto": item.lotto,
		                   "lievitato":flagLiev,"resa":resaReale,"dotes":item.cpIdtes };
						   
		// RIGHE MATERIE PRIME INSERITE (SOLO VIEW)
	 	const prodottiList = await apiRequest({
			method: 'POST',
			url: 'traccview',
			user: this.props.user,
			data: requestData,
		}) ;
	    item.details=prodottiList.data.details;
		item.data=item.start;
		item.codice=item.resourceId;
		
		setLoading(false);
	    this.showOverlayView(item);
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
		 	blocked,
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
	leftItemTemplateResolver = (schedulerData, slot, slotClickedFunc, width, clsName) => {
		const {deskData} = this.props;
		return (
			<LeftItemTemplate
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
