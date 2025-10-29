import { combineReducers } from "redux";

import { uiReducer, dlgMsgReducer } from "./uiReducer";

export default combineReducers({
	ui: uiReducer,
	dlg: dlgMsgReducer
});
