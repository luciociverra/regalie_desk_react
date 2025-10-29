import React, {Component,useContext} from 'react';
import {apiRequest,log,jAlert,jLog} from 'api';
import _ from 'lodash';
import Scheduler from './Scheduler';
import moment from "moment";
import LoadingOverlay from 'components/LoadingOverlay';
import schedulerSetup from './schedulerSetup';
 
import {LayoutContext} from 'components/LayoutProvider'; 
import {SessionContext} from "components/SessionContext";
import Utils from "./Utils";
const DesignController = (props) => {
	const layoutInfo = useContext(LayoutContext); 
	const {sessionInfo} = useContext(SessionContext);
	return <DesignControllerInt 
	         layoutInfo={layoutInfo}
			 sessionInfo={sessionInfo}
	         windowHeight={layoutInfo.windowHeight} 
			 windowWidth={layoutInfo.windowWidth} 
			 {...props} />;
};

class DesignControllerInt extends Component {
	 
	constructor(props) {
		super(props);
		this.state = {
			schedulerData: null, //Oggetto react-big-scheduler
			deskData: null, //Dati lavagna
			templateDialog: {}, //Questo controlla il dialog per i template (open, etc...)
			dataSaved: true, //Questo indica se i dati sono salvati o no
			loading: false,
			saving: false, //Questi due servono quando carico o salvo per far apparire le icone di caricamento/disabilitare bottoni
			errors: {},
			warnings: {}, //Questi due vengono ricreati da "validateScheduler" ogni volte che c'è un cambiamento negli events e vengono visualizzati sopra
			shiftErrors: {}, //Come sopra ma vengono visualizzati all'interno dei singoli blocchetti/shifts
			asyncShiftErrors: {}, //Questi sono gli errori asincroni provenienti dal server (al momento solo overlap di turni con altri workgroup), vengono visualizzati sia come errors sopra lo scheduler che nei blocchetti come shiftErrors
			shiftWarnings: {}, //Come shiftErrors per i warnings
			employeeStats: {}, //Questo è un oggetto che tiene in memoria diverse informazioni divise per employee, generato da validateScheduler come gli errori
			blocked: false, //Questo prop viene usato per impedire la modifica dello scheduler, non ancora usato ma funzionante (probabilmente con qualche bug)
		};
	}

	componentDidMount() {
		// appena il componente viene montato viene creato schedulerData  
		const {schedulerData,   blocked} = this.state;
		this.initializeScheduler().then(()=>{
			this.loadDesk(this.state.schedulerData)
		});
		;
	}

	componentDidUpdate(prevProps, prevState) {
		const {isMenuOpen} = this.props;
		const {schedulerData,   blocked} = this.state;

		//Questo server per ridimensionare lo scheduler quando la barra laterale viene aperta o chiusa
		/*
		if (schedulerData && isMenuOpen !== prevProps.isMenuOpen) {
			schedulerData.config.besidesWidth = 130;
			this.setState({schedulerData});
		}*/
  	    //Questo serve perchè quando cambia blocked tutti gli eventi vengono impostati non trascinabili e non ridimensionabili
		if (prevState.blocked !== blocked && schedulerData) {
			schedulerData.setEvents(schedulerData.events.map(e => ({
				...e,
				movable: !blocked && !e.isFinalised,
				resizable: !blocked && !e.isFinalised,
			})));
			this.setState({schedulerData});
		}
	}

	setSchedulerData = schedulerData => {
	 	this.setState({schedulerData});
	};

	setDeskData = deskData => {
		this.setState({deskData});
	};

	setLoading = loading => {
		this.setState({loading});
	};

	setSaving = saving => {
		this.setState({saving});
	};

	setDataSaved = dataSaved => {
		this.setState({dataSaved});
	};

	setTemplateDialog = templateDialog => {
		this.setState(prev => ({
			templateDialog: {...prev.templateDialog, ...templateDialog},
		}));
	};

	//Molto importante, la funzione pickBy restituisce un oggetto con solo le chiavi che non sono falsy "e => e"
	//per esempio se una chiave è undefined o null viene tolta
	setAsyncErrors = errors => {
		this.setState(prevState => ({
			asyncShiftErrors: _.pickBy({...prevState.asyncShiftErrors, ...errors},
				e => e),
		}));
	};
 //loi*
 	getSummary = (schedulerData, headerEvents, slotId, slotName, headerStart, headerEnd) => {
		let text = "SUMMARY";
		let color = '#d9d9d9';
		return {text: text, color: color, fontSize: '12px'};
	}

    // CARICAMNETO LAVAGNA CON DATA
	loadDesk = async (schedulerData) => {
		try {
			const {startDate, endDate} = schedulerData;
			log("LOAD DESK....."+startDate);
			//startDate="2022-06-20";			endDate="2022-06-26";
			/*
			if (! dates)
			{    log("DeskController dates non impostate");
				 dates = {startDate, endDate};
				 log("dates.startDate-end LUN-DOm :"+dates.startDate+" "+dates.endDate);
		    }
			*/
			this.setLoading(true);

         	const weekNumber= moment(startDate).isoWeeks();
			const currentYear = moment(startDate).format('YY');
			 
			const params= {
				from: startDate,
				to: endDate,
				weekNumber: currentYear+""+Utils.putTwo(weekNumber),
		    };
			
			let response = await apiRequest({
				method: 'POST',
				url: 'desk',
				data: params,
				user: this.props.sessionInfo.user,
				timeout: 15000 // only wait for 2s
			});
			  
            schedulerData.setEvents(response.data.deskItems);
			//
			//jLog(response.data.deskItems[0]);
			// 
			schedulerData.setEventGroups(response.data.resources);
			this.props.sessionInfo.lotti=response.data.lotti;
			this.props.sessionInfo.deskParam=params;
			this.props.sessionInfo.lottiToPrint=[];
        	this.setState({
				schedulerData,
				deskData: response.data,
				loading: false,
				dataSaved: true,
				errors: {},
				asyncShiftErrors: {},
			});
		} catch (err) {
			this.setLoading(false);
			console.error(err);
		}
	};
	onSelectDate = (schedulerData, date) => {
		this.loadDesk(schedulerData);
	};
	//funzione usata in componentDidMount
	initializeScheduler = async () => {
		//creo tramite la funzione definita nell'apposito file il mio schedulerData, facendo attenzione allo stato della barra laterale
		const schedulerData = schedulerSetup({
			events: [],
			resources: [],
			config: {
				customStartOfWeek: 1,
				// besidesWidth: this.props.isMenuOpen ? 280 : 30
			},
		});
		schedulerData.localeMoment.locale("it");
		this.setSchedulerData(schedulerData);
	};

	 

	renderScheduler() {
		const {
			schedulerData,
			deskData,
			dataSaved,
		 	loading,
			saving,
			errors,
			warnings,
			shiftErrors,
			asyncShiftErrors,
			shiftWarnings,
			blocked,
		} = this.state;
		const {schedulerMode} = this.props;

		if (schedulerData?.config) {
			schedulerData.config.schedulerWidth = this.props.layoutInfo.width <
			1000 ? 1000 : this.props.layoutInfo.width - 10;
		}
		//condizione affinchè lo scheduler (la parte della tabella) appaia sullo schermo
		const renderSchedulerCondition =schedulerData;
		if (renderSchedulerCondition) {
			return (
				<div className="scheduler-card jstar comp card"  >
				<Scheduler
					schedulerMode={schedulerMode}
					deskData={deskData}
					schedulerData={schedulerData}
					setSchedulerData={this.setSchedulerData}
					dataSaved={dataSaved}
					setDataSaved={this.setDataSaved}
					loadDesk={this.loadDesk}
					onSelectDate={this.onSelectDate}
					setLoading={this.setLoading}
					errors={errors}
					warnings={warnings}
					shiftErrors={shiftErrors}
					asyncShiftErrors={asyncShiftErrors}
					shiftWarnings={shiftWarnings}
					blocked={blocked}
					setAsyncErrors={this.setAsyncErrors}
					windowWidth={this.props.windowWidth}
					windowHeight={this.props.windowHeight}
					user={this.props.sessionInfo.user}
				/>
				</div>
			);
			}
	}

	render() {
		const {
			saving,
			loading,
			dataSaved,
			templateDialog,
			deskData,
			errors,
			asyncShiftErrors,
			schedulerData,
		} = this.state;
		const {schedulerMode} = this.props;

		// console.log(schedulerData);

		return (
			<>
			{loading && (<LoadingOverlay mode={'large'} windowHeight={this.props.windowHeight}/>) }	
			<div className={"rost-sched loc week"}>
				{this.renderScheduler()}
			</div>
			</>
		);
	}
}

export default DeskController;
