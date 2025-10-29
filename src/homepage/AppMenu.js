import React from "react";
import { NavLink } from "react-router-dom";
import { __RouterContext } from 'react-router';
import classNames from "classnames";
import { SessionContext } from "components/SessionContext";

export const AppSub = ({ className, items, onMenuItemClick }) => {

	const routerContext = React.useContext(__RouterContext);


	const [activeIndex, setActiveIndex] = React.useState(0)
	const {sessionInfo, logOff ,isAuthorized} = useContext(SessionContext);
	const onMenuItemClickHandler = (event, item, index) => {
		if (item.disabled) {
			event.preventDefault();
			return true;
		}

		//execute command
		if (item.command) {
			item.command({ originalEvent: event, item: item });
		}
		if (!item.items) {
		} else if (index === activeIndex) setActiveIndex(null);
		else setActiveIndex(index);

		if (onMenuItemClick) {
			onMenuItemClick({
				originalEvent: event,
				item: item
			});
		}
	}

	const renderLinkContent = (item, active) => {
		let submenuIcon = item.items && item.items.length > 0 && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
		let badge = item.badge && <span className="menuitem-badge">{item.badge}</span>;
		let icon = typeof item.icon === "function" ? item.icon(active) : item.icon;
		return (
			<React.Fragment>
				<div style={{width:"100%",textAlign:"center",color:'white'}}> 
				<i className={icon} style={{paddingLeft:6}}></i></div>
				<div style={{width:"100%",textAlign:"center",color:'white'}}>{item.label}</div>
				{submenuIcon}
				{badge}
			</React.Fragment>
		);
	}

	const renderLink = (item, i, active) => {
		let content = renderLinkContent(item, active);

		if (item.to && item.isAuth) {
			return (
				<NavLink
					activeClassName="active-route"
					to={item.to}
					onClick={e => onMenuItemClickHandler(e, item, i)}
					exact
					target={item.target}
				>
				</NavLink>
			);
		} else {
			return (
				<a href={item.url} onClick={e => onMenuItemClickHandler(e, item, i)} target={item.target}>
					{content}
				</a>
			);
		}
	}

	let itemsRender =
		items &&
		items.map((item, i) => {
			if (! item.isAuth) return null;
			let active = activeIndex === i || routerContext.location.pathname === item.to;
			let styleClass = classNames(item.badgeStyleClass, { "active-menuitem": active && !item.to });
			return (
				<li className={styleClass} key={item.label + i}>
					{item.items && item.items.length > 0 && routerContext.root === true && <div className="arrow">{item.items.length}</div>}
					{renderLink(item, i, active)}
					<AppSub items={item.items} onMenuItemClick={onMenuItemClick} />
				</li>
			);
		});

	return itemsRender ? <ul className={className}>{itemsRender}</ul> : null;

}

// const AppSub = withRouter(AppSubmenu);

export const AppMenu = ({ onMenuItemClick, model }) => {
	return (
		<div className="layout-menu-container">
			<AppSub
				items={model}
				className="layout-menu"
				onMenuItemClick={onMenuItemClick}
				root={true}
			/>
		</div>
	);
}
