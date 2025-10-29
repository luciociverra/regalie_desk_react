import {CellUnits, ViewTypes} from "react-big-scheduler";
import moment from "moment";
import WrappedSchedulerData from "./WrappedSchedulerData";
import {DATE_FORMAT_REST} from "../../util/constant";
import SummaryPos from './SummaryPos'
//Funzione che crea schedulerData, usata in DeskController
export default function schedulerSetup({resources = [], events = [], config = {}}) {
	const schedulerData = new WrappedSchedulerData(
		moment().format(DATE_FORMAT_REST), //DATA "YYYY-MM-DD"
		ViewTypes.Custom1, //VIEW
		false, //SHOW AGENDA
		true, //IS EVENT PERSPECTIVE
		{...schedulerDataConfig, ...config}, //SCHEDULER CONFIG
		behaviors, //BEHAVIOURS
		moment.localeMoment //LOCALE MOMENT
	);
	schedulerData.setResources(resources);
	schedulerData.setEvents(events);
	// schedulerData.config.calendarPopoverEnabled = false;
	return schedulerData;
}

const schedulerDataConfig = {
	schedulerMaxHeight: 0,
	
	agendaResourceTableWidth: 100,
	agendaMaxEventWidth: 100,

	dayResourceTableWidth: 160,
	weekResourceTableWidth: 500,
	monthResourceTableWidth: 160,
	quarterResourceTableWidth: 160,
	yearResourceTableWidth: 160,
	customResourceTableWidth: 160,

	dayCellWidth: 30,
	weekCellWidth: 80,
	monthCellWidth: 80, 
	quarterCellWidth: 80,
	yearCellWidth: 80,
	customCellWidth: 80,

	dayMaxEvents: 99,
	weekMaxEvents: 99,
	monthMaxEvents: 99,
	quarterMaxEvents: 99,
	yearMaxEvents: 99,
	customMaxEvents: 99,

	tableHeaderHeight: 60,  //*loi altezza prima riga date
	eventItemHeight: 45,  /*loi altezza singolo box elemnto */
	eventItemLineHeight: 49, /*loi altezza sopra +4 */
	nonAgendaSlotMinHeight: 75, /*loi altezza minima cella ex 90  se cambia la prima riga a sx rimane+ grande*/
	 
	defaultEventBgColor: "#80C5F6",
	selectedAreaColor: "#fff8c033",
	nonWorkingTimeHeadColor: "unset",
	nonWorkingTimeHeadBgColor: "unset",
	nonWorkingTimeBodyBgColor: "unset",
	summaryColor: "#666",
	groupOnlySlotColor: "#F8F8F8",

	startResizable: false,
	endResizable: false,
	movable: false,
	creatable: false,
	crossResourceMove: true,
	checkConflict: false,
	scrollToSpecialMomentEnabled: true,
	eventItemPopoverEnabled: false,
	calendarPopoverEnabled: true,
	recurringEventsEnabled: true,
	headerEnabled: true,
	displayWeekend: true,
	relativeMove: true,
	defaultExpanded: false,
	resizing: true,

	resourceName: "",
	taskName: "",
	agendaViewHeader: "Agenda",
	addMorePopoverHeaderFormat: "MMM D, YYYY dddd",
	eventItemPopoverDateFormat: "MMM D",
	nonAgendaDayCellHeaderFormat: "HH:mm",
	nonAgendaOtherCellHeaderFormat: "dddd DD",
	minuteStep: 30,

	views: [
		{
			viewName: "Day",
			viewType: ViewTypes.Custom,
			showAgenda: false,
			isEventPerspective: true //QUESTO 'INTERFACCIA CHE CAMBIA QUESTO PARAMETRO
			//isEventPerspective decide se la prima colonna a sinistra visualizza le location (groupId) o gli employee (resourceId)
		},
		{
			viewName: "Week",
			viewType: ViewTypes.Custom1,
			showAgenda: false,
			isEventPerspective: true
		}
	]
};

const behaviors = {
	getCustomDateFunc: getCustomDate,
	isNonWorkingTimeFunc: isNonWorkingTime,
	// getNonAgendaViewBodyCellBgColorFunc: getNonAgendaViewBodyCellBgColorFunc
};

function getCustomDate(schedulerData, num, date = undefined) {
	let customStartOfWeek = 1;
	const {viewType} = schedulerData;
	let selectDate = schedulerData.startDate;
	if (date !== undefined) selectDate = date;

	let startDate = schedulerData.localeMoment(selectDate).add(4, "hours");
	startDate =
		num === 0
			? startDate.format("YYYY-MM-DD HH:mm:ss")
			: startDate.add(1 * num, "days").format("YYYY-MM-DD HH:mm:ss");

	let endDate = schedulerData
		.localeMoment(startDate)
		.add(0, "hours")
		.format("YYYY-MM-DD HH:mm:ss");

	schedulerData.config.customResourceTableWidth = "14%";
	schedulerData.config.customCellWidth = "1.8%";
	schedulerData.config.startResizable = true;
	schedulerData.config.endResizable = true;

	let cellUnit = CellUnits.Hour;
    //!!!!!!!!!!!!!!!!!!!!!  uso QUESTO
	if (viewType === ViewTypes.Custom1) {
		let startWeek = schedulerData
			.localeMoment(selectDate)
			.days(customStartOfWeek)
			.format(DATE_FORMAT_REST);
		startDate =
			num === 0
				? startWeek
				: schedulerData
					.localeMoment(startWeek)
					.add(num, "weeks")
					.format(DATE_FORMAT_REST);
		endDate = schedulerData
			.localeMoment(startDate)
			.add(5, "days")              //loi* 6+1 colonne   5 tolgo la domenica
			.format(DATE_FORMAT_REST);
		cellUnit = CellUnits.Day;
		// con 6 5%
		schedulerData.config.customResourceTableWidth = "6%"; //loi* larghezza prima colonna
		// con 6 13.8%
		schedulerData.config.customCellWidth = "16.0%";
		schedulerData.config.startResizable = false;
		schedulerData.config.endResizable = false;
		schedulerData.config.summaryPos = SummaryPos.BottomRight;
	}

	return {
		startDate, //: "2019-10-10",7
		endDate, //: "2019-10-25",
		cellUnit //: CellUnits.Day
	};
}

function isNonWorkingTime(schedulerData, time) {
	/* const { localeMoment } = schedulerData;
	if (schedulerData.cellUnit === CellUnits.Hour) {
		let hour = localeMoment(time).hour();
		if (hour < 1) return true;
	} else {
		let dayOfWeek = localeMoment(time).weekday();
		if (dayOfWeek === 0 || dayOfWeek === 6) return true;
	} */
	return false;
}
