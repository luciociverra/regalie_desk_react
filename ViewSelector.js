import React, {useEffect, useState} from "react";

import "./viewSelector.css";
//Questo componente si occupa della parte destra appena sopra la tabella
//Day/Week etc...
const ViewSelector = ({
	schedulerData,
	setSchedulerData,
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
		<div className="custom-menu" style={{ marginRight: 1 }}></div>
	);
};

export default ViewSelector;
