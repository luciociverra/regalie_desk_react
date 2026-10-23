import React, {Component} from "react";
import { AppRegalie } from "AppRegalie";
import "./App.css";
export var setSideBarMenuVisible;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layoutMode: "static",
	    	staticMenuInactive: false,
			goMenu : "",		 
		};
	}

	isDesktop() {
		return window.innerWidth > 1024;
	}

	render() {
		return (
			<div className={"layout-static"}>
				<AppRegalie />
			</div>
		);
	}
}

export default App;
