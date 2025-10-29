import React from 'react';
import {Route} from 'react-router-dom';
import DeskController from 'pages/scheduler/DeskController';
import DesignController from 'pages/design/DeignController';
import TracController from 'pages/tracciab/TraccController';
import MesController from 'pages/vasche_mes';
import { AppHome } from "homepage/AppHome";
import {IndexVasche} from 'pages/vasche';
import IndexUser from 'pages/users';
import IndexReport from 'pages/reports';
import IndexLogs from 'pages/logs';
import IndexEmp from 'pages/emp';
import IndexDev from 'pages/dev';
const routes = () => {
	return (
		<>
		    <Route path="/" exact        render={() => <AppHome/>}/>
			<Route path="/users" exact   render={() => <IndexUser/>}/>
			<Route path="/reports" exact render={() => <IndexReport/>}/>
			<Route path="/logs" exact    render={() => <IndexLogs/>}/>
			<Route path="/tempistiche" exact render={() => <IndexVasche/>} />
			<Route path="/tracciab" exact 	 render={() => <TracController/>} />
			<Route path="/desk" exact 	 render={() => <DeskController/>} />
			<Route path="/design" exact 	 render={() => <DesignController/>} />
			<Route path="/emp" exact 	 render={() => <IndexEmp/>} />
			<Route path="/mes" exact 	 render={() => <MesController/>} />
			<Route path="/devin" exact 	 render={() => <IndexDev/>} />
		</>
	);
};

export default routes