
import {apiRequest,jAlert,log} from "api";
import moment from "moment";

class ReportUtils {
	static capitalize(string ) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static trunk(string , maxlenght ) {
		if (!string || !string.length || string.length <= maxlenght) {
			return string;
		}
		return string.substring(0, maxlenght);
	}

	static trunkDotted(string , maxlenght ) {
		if (!string || !string.length || string.length <= maxlenght - 3) {
			return string;
		}
		return string.substring(0, maxlenght) + "...";
	}

	static formatRemoteDate(datestring) {
		return datestring && moment(datestring).format('YYYY-MM-DD HH:mm')
	}


	static exportXlsx(filename, data, endProcessCallback) {
		this.openBackendData("xlsx", false, filename + '.xlsx', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", data, endProcessCallback)
	}

	static exportXls(filename, data, endProcessCallback) {
		this.openBackendData("xls", false, filename + '.xls', "application/xls", data, endProcessCallback)
	}

	static print(filename, data, endProcessCallback) {
		this.openBackendData("pdf", false, filename + '.pdf', "application/pdf", data, endProcessCallback)
	}

	static downloadPdf(apicmd,data, endProcessCallback) {
		this.openBackendData("pdf", true, 'stampi_pdf', "application/pdf", data, endProcessCallback)
	}

	static async openBackendData(apicmd, download, filename, mimetype, data, endProcessCallback) {
		log("  "+apicmd) 
		apiRequest({
			method: "post",
			url: "/"+apicmd,
			headers: {
				Accept: mimetype + ", text/plain, */*",
				"Content-Type": "application/json",
				mode: "no-cors",
			},
			data: data,
			user: "report",
			responseType: "blob",
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data], {type: mimetype}));
			if (download) {
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', filename); //or any other extension
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else {
				const w = window.open(
					url,
					// "_blank",
					"scrollbars=no,menubar=no,height=" +
					window.screen.availHeight +
					",width=" +
					window.screen.availWidth +
					",resizable=yes,toolbar=no,status=no"
				); //"width="+screen.availWidth+",height="+screen.availHeight

				if (w) {
					setTimeout(() => {
						const d = w.document
						d.title = filename;
						const h = d.getElementsByTagName('html')[0]
							.getElementsByTagName('head')[0];
						if (!h.getElementsByTagName('title').length) {
							h.appendChild(document.createElement('title'))
						}
						h.getElementsByTagName('title')[0].innerText = filename
					}, 300)
				}

			}
		}).finally(() => endProcessCallback && endProcessCallback());
	}
}

export default ReportUtils;
