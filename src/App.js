import React, {Component} from "react";
import { AppRegalie } from "AppRegalie";
import {SessionContext} from "components/SessionContext";
import "./App.css";
export var setSideBarMenuVisible;

class App extends Component {
	static contextType = SessionContext;
	constructor(props) {
		super(props);
		this.state = {
			layoutMode: "static",
			layoutColorMode: "light",  //dark ??
			staticMenuInactive: false,
			goMenu : "",		 
		};
	}

	isDesktop() {
		return window.innerWidth > 1024;
	}
	componentDidMount() {
	}
	componentDidUpdate() {
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
