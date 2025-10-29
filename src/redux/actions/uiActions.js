export const setLoading = loading => {
	return {
		type: "SET_LOADING",
		payload: loading
	};
};

export const setMessage = message => {
	return {
		type: "SET_MESSAGE",
		payload: { ...message, date: new Date(Date.now()) }
	};
};
