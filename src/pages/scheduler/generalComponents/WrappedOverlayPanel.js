import React from "react";
import {Popup} from "semantic-ui-react";

import "./wrappedOverlayPanel.css";

const WrappedOverlayPanel = React.forwardRef(({children, header, trigger, hide, ...rest}, ref) => {
	const popperModifiers = [
		{
			name: 'preventOverflow',
			options: {
				boundariesElement: "window"
			},
		},
	];

	function onContextMenu(e) {
		e.preventDefault();
		hide();
	}

	return (
		<Popup
			ref={ref}
			className="ksc-overlay-panel"
			positionFixed
			basic
			trigger={trigger}
			on={["click"]}
			onClose={() => hide()}
			poppermodifiers={popperModifiers}
			{...rest}
		>
			<div className="content" onContextMenu={onContextMenu} onScroll={e => e.stopPropagation()}>
				{children}
			</div>
		</Popup>
	);
});

export default WrappedOverlayPanel;
