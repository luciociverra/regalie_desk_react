import React from 'react';
import {Route} from 'react-router-dom';
import { AppHome } from "homepage/AppHome";
const routes = () => {
	return (
		<>
		    <Route path="/" exact        render={() => <AppHome/>}/>
		</>
	);
};

export default routes