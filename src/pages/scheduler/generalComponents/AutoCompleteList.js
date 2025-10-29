import React, { useState, useEffect } from "react";
import { Input } from "semantic-ui-react";
import classNames from "classnames";
import _ from "lodash";

import "./autoCompleteList.css";

const defaultSortFunction = key => (a, b) => {
	if (a[key] < b[key]) return -1;
	if (a[key] > b[key]) return 1;
	return 0;
};

const AutoCompleteList = ({
	options,
	regExpTestKey = "name",
	renderItem,
	underInputItem,
	stickyItemsFunction,
	sortResultsFunction = defaultSortFunction(regExpTestKey),
	transformResultsFunction,
	onClearIconClick,
	maxListHeight,
	listClassName,
	inputClassName,
	...rest
}) => {
	const [results, setResults] = useState([]);
	const [value, setValue] = useState("");

	useEffect(() => {
		const re = new RegExp(_.escapeRegExp(value), "i");
		const isMatch = result => re.test(_.get(result, regExpTestKey));
		const results = _.filter(options, isMatch);
		setResults(results);
	}, [value, options, regExpTestKey]);

	function onChange(e) {
		setValue(e.target.value);
	}

	const defaultRenderItem = (item, idx) => {
		return <div key={idx}>{_.get(item, regExpTestKey)}</div>;
	};

	const renderResults = results => {
		if (transformResultsFunction) {
			results = results.map(transformResultsFunction);
		}
		if (sortResultsFunction) {
			results = results.sort(sortResultsFunction);
		}
		if (!value && stickyItemsFunction) {
			let stickyItems = stickyItemsFunction(options);
			if (sortResultsFunction) stickyItems = stickyItems.sort(sortResultsFunction);
			results.unshift(...stickyItems);
		}
		results = _.uniq(results);

		return results.map(renderItem || defaultRenderItem);
	};

	const clearIcon = (
		<i className="times icon" onClick={onClearIconClick} style={{ pointerEvents: "unset", cursor: "pointer" }}></i>
	);

	return (
		<div className="item-list-container">
			<Input
				className={classNames("search", inputClassName)}
				value={value}
				onChange={onChange}
				placeholder="Search..."
				spellCheck={false}
				icon={onClearIconClick ? clearIcon : null}
				{...rest}
			/>
			{underInputItem}
			<div className={classNames("list", listClassName)} style={{ maxHeight: maxListHeight }}>
				{renderResults(results)}
			</div>
		</div>
	);
};

export default AutoCompleteList;
