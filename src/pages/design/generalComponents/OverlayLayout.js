import React from "react";

const OverlayLayout = ({ header, children, onHide, onConfirm, isConfirmDisabled, shiftInfo}) => {
	return (
		<>
			<div className="header" style={{padding:5,backgroundColor:"#f2f2f2"}}>
				<div className="header-text">{header}&nbsp;&nbsp;&nbsp;{shiftInfo}</div>
				{onConfirm && (
					<button
						style={{width: 24, fontSize: 20}}
						className="confirm-button"
						onClick={onConfirm}
						disabled={isConfirmDisabled}
						title="Confirm edit"
					>
						<i className="ui check fitted green clickable icon"/>
					</button>
				)}
				{onHide && (
					<button className="hide-button" style={{width: 24, fontSize: 20}} onClick={onHide} title="Cancel edit">
						<i className="ui x fitted red clickable icon"/>
					</button>
				)}
			</div>
			{children}
		</>
	);
};

export default OverlayLayout;

