const INITIAL_STATE = {
	loading: false,
	message: {}
};

export const uiReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_MESSAGE":
			return { ...state, message: action.payload };
		default:
			return state;
	}
};

export const dlgMsgReducer = (state = { message: {} }, action) => {
	switch (action.type) {
		case "SET_DLG_MESSAGE":
			return { ...state, message: action.payload };
		default:
			return state;
	}
};
