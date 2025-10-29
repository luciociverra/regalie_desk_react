import React, { useState,useEffect,useContext } from "react";
import { NavLink } from "react-router-dom";
import { __RouterContext } from 'react-router';
import {SessionContext} from "components/SessionContext";
import { AppUserMenu } from "./AppUserMenu";
 
import "./homepage.css";
import { log,apiRequest,jAlert } from "api";

export const AppTopbarSetting = ({onMenuItemClick}) => {  
	const [activeIndex, setActiveIndex] = React.useState(0)
	const [menuVisual,setMenuVisual] = React.useState(menu)
	const [exitPath,setExitPath] = React.useState("/");
	const routerContext = React.useContext(__RouterContext);
	const {sessionInfo, logOff ,isAuthorized, haveMainMenu} = useContext(SessionContext);
	const menu = [
		{
			label: 'Settings',
			icon: 'cog alternate icon',
			isAuth: isAuthorized("MNU_SETTINGS"),
			to: '/users',
			items: [],
		},
	];

	 
	useEffect(() => {
	
		// se è pubblicato sul server
		process.env.REACT_APP_ENV==="prod" && setExitPath(process.env.REACT_APP_PATH);
		log( process.env.NODE_ENV +" - "+process.env.REACT_APP_ENV)
	 	let itemsRender =
		menu &&
		menu.filter((aItemMenu) => aItemMenu.isAuth).map((item, i) => {
			let active=false;
			return (
				 
				<li style={{display:'inline'}} key={i}>
					{renderLink(item, i, active)}
				</li>
				 
			);
		});
		setMenuVisual(itemsRender);
		 
	  }, [])

	  const onMenuItemClickHandler = (event, item, index) => {
		if (item.disabled) {
			event.preventDefault();
			return true;
		}
		onMenuItemClick({
			originalEvent: event,
			item: item
		});

		//execute command
		if (item.command) {
			item.command({ originalEvent: event, item: item });
		}
		if 
		 (index === activeIndex) setActiveIndex(null);
		else 
		 setActiveIndex(index);
		routerContext.location.pathname = item.to;
	    }

	  const renderLinkContent = (item, active) => {
		let icon = typeof item.icon === "function" ? item.icon(active) : item.icon;
		return (
			<>
				<div style={{marginRight:70,textAlign:"left",display:'inline',color:'white'}}>
				<i className={icon} style={{paddingLeft:10,color:'white',fontSize:22}}/>
				<span style={{marginLeft:10,fontSize:"1.3em"}}>{item.label}</span>
			   </div>
			</>
		);
	}

	const renderLink = (item, i, active) => {
		let content = renderLinkContent(item, active);
		if (item.to) {
			return (
				<NavLink
					activeClassName="active-route"
					to={item.to}
					onClick={e => onMenuItemClickHandler(e, item, i)}
					exact
					target={item.target}
				>{content}
				</NavLink>
			);
		} else { // non usato
			return (
				<a href={item.url} onClick={e => onMenuItemClickHandler(e, item, i)} target={item.target}>
					{content}
				</a>
			);
		}
	}

	const exitLink =  
	     <a onClick={e => doLogout(e)} title="Torna alla pagina di login">
				<div style={{display:'inline-block',color:'white'}}>
				<i className="pi pi-sign-out" style={{color:'white',fontSize:"1.8em"}}/>
				<span style={{marginLeft:10, fontSize: "1.3em"}}>Exit</span>
			   </div>
	     </a>			 
 
	const doLogout =(e)=> {
		if (haveMainMenu()) {
			window.location.replace(exitPath); //provoca il ritorno a index.html
		}
		else {
		e.preventDefault();
		 // SessionContext reset
		let currentUser ={ user: sessionInfo.user};
	 
		apiRequest({ 
			method: "POST",
			url: "/logout",
			data: currentUser}).then(()=>{
				logOff();
				window.location.replace(exitPath); //provoca il ritorno a index.html
		});
	}
	}
	 
	 
	return (
			<div className="layout-topbar clearfix">
				<ul>{menuVisual}</ul>
				 
			 	<div className="layout-topbar-username" >
					<div className="show-username">{useContext(SessionContext).sessionInfo.userName}</div>
				</div>
				<div className="layout-topbar-exit">
					{exitLink}
				</div>
			</div>
		 
	)
}