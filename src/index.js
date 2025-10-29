import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import {HashRouter} from "react-router-dom";

import {applyMiddleware, compose, createStore} from "redux";
import {Provider} from "react-redux";
import createSagaMiddleware from "redux-saga";

import {SessionContextProvider} from "./components/SessionContext"
import reducers from "./redux/reducers";

import "semantic-ui-css/semantic.min.css";

import App from "./App";

 
// gestione timeoutimport {SessionTimeout} from "./components/SessionTimeout";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, composeEnhancers(applyMiddleware(sagaMiddleware)));

 

ReactDOM.render(
	<Provider store={store}>
		<HashRouter>
				<SessionContextProvider>
				<App/>
				</SessionContextProvider>
		</HashRouter>
	</Provider>,
	document.getElementById("root")
);

export {store};
