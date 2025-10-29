import moment from "moment";

export const DATE_FORMAT_REST = "YYYY-MM-DD"
export const DATETIME_FORMAT_REST = "YYYY-MM-DD HH:mm:ss"


export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY"
export const DEFAULT_DATETIME_FORMAT = "DD/MM/YYYY HH:mm:ss"


export const BODY_DATATABLE_DATETIME = (rowData , colData ) => {
	// console.log({rowData, colData})
	return rowData[colData.field] && moment(rowData[colData.field]).format(DEFAULT_DATETIME_FORMAT)
}


