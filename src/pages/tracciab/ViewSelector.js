import React, {useEffect, useRef, useState} from "react";
import {Checkbox, Label, Menu, Popup} from "semantic-ui-react";
import moment from "moment";

import "./viewSelector.css";

// import DeskFunctions from "../util/Rostering";

//Questo componente si occupa della parte destra appena sopra la tabella
//Day/Week etc...
const ViewSelector = ({
	schedulerMode,
	schedulerData,
	setSchedulerData,
	rosteringData,
	windowHeight,
	windowWidth
}) => {
	const [active, setActive] = useState(schedulerData.viewType);

	useEffect(() => {
		setActive(schedulerData.viewType);
		// imposto l'attivazione dell'editing col radio
		schedulerData.config.startResizable= true;
							schedulerData.config.endResizable= true;
							schedulerData.config.movable= true;
							schedulerData.config.creatable= true;
							setSchedulerData(schedulerData);
	}, [schedulerData.viewType]);


	return (
		<>
		<div className="custom-menu" style={{ marginRight: 1 }}>
			
			{/*
			MENEU A DX Locations ! employee  
			<Menu size="small" items={createPerspectiveSelectItems()} style={{ marginRight: 7 }} />
			<Menu size="small" items={createViewSelectItems()} />
			{windowWidth +"x"+windowHeight}
			*/}
			
		</div>
		</>
	);
};

export default ViewSelector;
