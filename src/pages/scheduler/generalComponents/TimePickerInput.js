import React, {useImperativeHandle, useRef, useState} from "react";
import moment from "moment";

import "./timePickerInput.css";
import {Input} from "semantic-ui-react";
import {DATE_FORMAT_REST, DEFAULT_DATETIME_FORMAT} from "../../../util/constant";

const TimePickerInput = ({value, onChange, name, label = name, disabled, onInputCompleted, inputRef, ...rest}) => {
	const [hours, setHours] = useState(getHoursFromValue());
	const [minutes, setMinutes] = useState(getMinutesFromValue());
	const hoursRef = useRef();
	const minutesRef = useRef();

	useImperativeHandle(inputRef, () => ({
		focus: () => hoursRef.current.focus(),
		reset: () => {
			setHours(getHoursFromValue());
			setMinutes(getMinutesFromValue());
		}
	}));

	function onHoursChange(value) {
		let checkedValue;
		if (!/[0-9]/.test(value) && value !== "") return;
		if (value[0] && /^(0[0-9]|1[0-9]|2[0-3])/.test(value)) {
			minutesRef.current.focus();
			checkedValue = value;
		} else if (value.length === 1 && /[0-2]/.test(value)) {
			checkedValue = value;
		} else if (!value[1] && /[3-9]/.test(value)) {
			minutesRef.current.focus();
			checkedValue = `0${value}`;
		} else if (hours.length > value.length) {
			checkedValue = value;
		}
		if (checkedValue || checkedValue === "") {
			setHours(checkedValue);
			fromHoursGetValue(checkedValue);
		}
	}

	function onMinutesChange(value) {
		let checkedValue;
		if (!/[0-9]/.test(value) && value !== "") return;
		if (value[0] && /^([0-5][0-9])/.test(value)) {
			onInputCompleted ? onInputCompleted() : hoursRef.current.focus();
			checkedValue = value;
		} else if (value.length === 1 && /[0-5]/.test(value)) {
			checkedValue = value;
		} else if (!value[1] && /[6-9]/.test(value)) {
			onInputCompleted ? onInputCompleted() : hoursRef.current.focus();
			checkedValue = `0${value}`;
		} else if (minutes.length > value.length) {
			checkedValue = value;
		}
		if (checkedValue || checkedValue === "") {
			setMinutes(checkedValue);
			fromMinutesGetValue(checkedValue);
		}
	}

	function getHoursFromValue() {
		return value ? moment(value).format("HH") : "";
	}

	function getMinutesFromValue() {
		return value ? moment(value).format("mm") : "";
	}

	function fromHoursGetValue(hours) {
		const time = `${moment(value).format(DATE_FORMAT_REST)} ${hours}:${moment(value).format("mm:ss")}`;
		const formattedTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
		onChange({target: {name: name, value: formattedTime}});
	}

	function fromMinutesGetValue(minutes) {
		const time = `${moment(value).format("YYYY-MM-DD HH")}:${minutes}:00`;
		const formattedTime = moment(time).format("YYYY-MM-DD HH:mm:ss");
		onChange({target: {name: name, value: formattedTime}});
	}

	return (
		<div className={["time-picker-container", disabled ? "disabled" : ""].join(" ")}>
			<div className="time-picker-input" name={name} title={moment(value).format(DEFAULT_DATETIME_FORMAT)}>
				<Input
					ref={hoursRef}
					value={hours}
					label={{content: label}}
					className="hours"
					onKeyDown={e => {
						const {selectionStart, selectionEnd} = e.target;
						if (e.key === "ArrowRight" && (selectionStart !== selectionEnd || selectionStart === 2)) {
							e.preventDefault();
							minutesRef.current.focus();
						}
					}}
					onFocus={e => e.target.setSelectionRange(0, 2)}
					onBlur={e => {
						const value = e.target.value;
						if (!value) {
							setHours("00");
						} else if (value.length === 1 && !/[3,9]/.test(value)) {
							setHours(prev => "0" + prev);
						}
					}}
					maxLength={2}
					onChange={e => onHoursChange(e.target.value)}
					disabled={disabled}
					{...rest}
				/>
				<Input
					ref={minutesRef}
					value={minutes}
					label={{content: ":"}}
					className="minutes"
					onKeyDown={e => {
						if (e.key === "Backspace" && e.target.value === "" && minutes === "") {
							e.preventDefault();
							hoursRef.current.focus();
						} else if (e.key === "ArrowLeft" && e.target.selectionStart === 0) {
							e.preventDefault();
							hoursRef.current.focus();
						}
					}}
					onFocus={e => e.target.setSelectionRange(0, 2)}
					onBlur={e => {
						const value = e.target.value;
						if (!value) {
							setMinutes("00");
						} else if (value.length === 1 && !/[6,9]/.test(value)) {
							setMinutes(prev => "0" + prev);
						}
					}}
					maxLength={2}
					onChange={e => onMinutesChange(e.target.value)}
					disabled={disabled}
					{...rest}
				/>
			</div>
		</div>
	);
};

export default TimePickerInput;
