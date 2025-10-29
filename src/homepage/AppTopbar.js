import React, { useState,useEffect,useContext } from "react";
import { NavLink } from "react-router-dom";
import { __RouterContext } from 'react-router';
import {SessionContext} from "components/SessionContext";
import {ReportController} from "./ReportController";
import "./homepage.css";
import { log,apiRequest,jAlert } from "api";
 
 

export const AppTopbar = ({onMenuItemClick}) => {  
	const [activeIndex, setActiveIndex] = useState(0)
	const [menuVisual,setMenuVisual] = useState(menu)
	const [exitPath,setExitPath] = useState("/");
	const [reportOpen,setReportOpen] = useState(false);

	const routerContext = React.useContext(__RouterContext);
	const {sessionInfo, logOff ,isAuthorized,haveMainMenu} = useContext(SessionContext);
	const menu = [
		{
			label: 'Lavagna',
			icon: 'clipboard outline icon',
			isAuth: isAuthorized("MNU_LAVAGNA"),
			to: '/desk',
			items: [],
		},
		{
			label: 'Sonia design',
			icon: 'clipboard outline icon',
			isAuth: isAuthorized("MNU_LAVAGNA"),
			to: '/design',
			items: [],
		},
		{
			label: 'Tracciabilità',
			icon: 'search icon',
			isAuth: isAuthorized("MNU_TRACCIABILITA"),
			to: '/tracciab',
			items: [],
		},
		{
			label: 'Mes',
			icon: 'industry icon',
			isAuth: isAuthorized("MNU_MES"),
			to: '/mes',
			items: [],
		},
		{
			label: 'Tempistiche',
			icon: 'list ol icon',
			isAuth: isAuthorized("MNU_TEMPISTICHE"),
			to: '/tempistiche',
			items: [],
		},
		{
			label: 'Report',
			icon: 'print icon',
			isAuth: isAuthorized("MNU_REPORT"),
			command: "openReport",
		},
		{
			label: 'Logs',
			icon: 'hdd icon',
			isAuth: isAuthorized("MNU_LOGS"),
			to: '/logs',
			items: [],
		},
		{
			label: 'Settings',
			icon: 'cog alternate icon',
			isAuth: isAuthorized("MNU_SETTINGS"),
			to: '/users',
			items: [],
		},
		{
			label: 'Turni',
			icon: 'phone icon',
			isAuth: isAuthorized("MNU_TURNI"),
			//isAuth: false,
			to: '/emp',
			items: [],
		},
	];
	 
	useEffect(() => {
		// se è pubblicato sul server
		process.env.REACT_APP_ENV==="prod" && setExitPath(process.env.REACT_APP_PATH);
		log( process.env.NODE_ENV +" - "+process.env.REACT_APP_ENV +" "+isAuthorized("MNU_UTENTI")+
		" MNU_DEVEL???---> "+isAuthorized("MNU_DEVEL"))
	 	let itemsRender =
		menu &&
		menu.filter((aItemMenu) => aItemMenu.isAuth).map((item, i) => {
			let active=false;
			return (
				 
				<li style={{display:'inline'}}
				    key={i}>
					{renderLink(item, i, active)}
				</li>
				 
			);
		});
		setMenuVisual(itemsRender);
		window.addEventListener('scroll', handleScrollBox)
		return () => {
		  window.removeEventListener('scroll', () => handleScrollBox);
		};
	  }, [])
	  /*  */
	  const handleScrollBox = () => {
		try 
		{
		   	// document.querySelector(".layout-topbar").style.setProperty("display","none");
		}
	   catch(err) {}
	  };
	 /* */ 

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
		if (item.command && item.command==="openReport") {
			setReportOpen(true);
			return;
		}
 
		if (index === activeIndex) 
			setActiveIndex(null);
		else 
		 	setActiveIndex(index);
		routerContext.location.pathname = item.to;
	    }


	  const renderLinkContent = (item, active) => {
		let icon = typeof item.icon === "function" ? item.icon(active) : item.icon;
		return (
			<>
				<div style={{marginRight:40,textAlign:"left",display:'inline',color:'white'}}>
				<i className={icon} style={{paddingLeft:10,color:'white',fontSize:22}}/>
				<span style={{marginLeft:10,fontSize:"1.3em"}}>{item.label}</span>
			   </div>
			</>
		);
	}
	const openReport = () => {
		 
		/*
		setLoading(true);
		MyUtils.exportXlsx(reportTabIndex[tabIndex].filename, getReportParam(), () => {
			setLoading(false);
		});*/
	};
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
				<div className="layout-topbar-exit">{exitLink}</div>
				<ReportController reportOpen={reportOpen} setReportOpen={setReportOpen}/>
 			</div>
		 
	)
}