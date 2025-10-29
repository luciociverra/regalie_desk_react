import React from "react";
const defaultDimension = {
	width: 0,
	height: 0,
	viewHeight: 0,
	viewWidth: 0,
	windowHeight: window.innerHeight,
	windowWidth: window.innerWidth,
}
export const LayoutContext = React.createContext(defaultDimension);
export const LayoutProvider= ({children}) => {
	const divRef = React.useRef(null);
	const [divDimensionState, setDivDimensionState] = React.useState(defaultDimension)

	React.useEffect(() => {
		setDivDimensionState({
			...divDimensionState,
			windowHeight: window.innerHeight,
			windowWidth: window.innerWidth
		})
	}, [window.innerHeight,window.innerWidth])

	React.useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			// console.log(entries[0]);
			setDivDimensionState({
				...divDimensionState,
				height: entries[0].target.clientHeight,
				width: entries[0].target.clientWidth,
				viewHeight: entries[0].contentRect.height,
				viewWidth: entries[0].contentRect.width,
			})
		});
		resizeObserver.observe(divRef.current);
		return () => {
			resizeObserver && resizeObserver.disconnect();
		}
	}, [])

	return <LayoutContext.Provider value={divDimensionState}>
		<div id="layout-main" ref={divRef} className="layout-main" style={divDimensionState.style}>
			{children}
		</div>
	</LayoutContext.Provider>
}