import axios from "axios";
 
export const host =  process.env.REACT_APP_HOST;

export const api = axios.create({
	baseURL: process.env.REACT_APP_HOST+"/api"
});
 
export function log(aVal){
	console.log(aVal);
};
export function jLog(aVal){
	console.log(JSON.stringify(aVal));
};
export function jAlert(aVal){
	alert(JSON.stringify(aVal));
};

export const apiRequest = async (config) => {
	try {
		 
		if (! config.headers) config.headers = {};
		config.headers["Authorization"] = `Bearer ${config.user}`;
		jLog(config);
		// dati di config {"method":"get","url":"desk/11","params":{}}
		const response = await api.request(config);
		
		if (config._messageOnComplete) {
			//Notifier.showInfoMessage(config._messageOnComplete, null);
		}

		switch (config._type) {
			case "SAVE":
			//	Notifier.showInfoMessage("Saved", null);
				break;
			case "DELETE":
			//	Notifier.showWarningMessage("Deleted", null);
				break;
			default:
		}

		return response;
	} catch (e) {
		//Notifier.showWarningMessage("Server remoto", e.message);
    	throw e;
	}
};
export const remoteTest = async () => {
    log("remoteTest to "+process.env.REACT_APP_HOST+"/api/hello")
    try {
        await axios({
            method: 'get',
            url: process.env.REACT_APP_HOST+"/api/hello",
            timeout: 2000 // only wait for 2s
        })
		return true;
    }
    catch (err) {
		return false;
    }
}
export const addettiVerify = async () => {
    log("addettiVerify");
    try {
        await axios({
            method: 'get',
            url: process.env.REACT_APP_HOST+"/api/hello",
            timeout: 2000 // only wait for 2s
        })
		return true;
    }
    catch (err) {
		return false;
    }
}

