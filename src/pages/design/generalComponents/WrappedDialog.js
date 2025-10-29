import React from "react";
import { Modal, Button } from "semantic-ui-react";

import "./wrappedDialog.css";

const WrappedDialog = ({
	visible,
	setVisible,
	children,
	onConfirm = async () => {},
	onAbort = async () => {},
	yesText = "Yes",
	noText = "No",
	disabled,
	loading,
	noButtons,
	header,
	...rest
}) => {
	async function onYesClick(e) {
		e.preventDefault();
		await onConfirm();
		setVisible(false);
	}

	async function onNoClick(e) {
		e.preventDefault();
		await onAbort();
		setVisible(false);
	}

	return (
		<Modal
			size="mini"
			open={Boolean(visible)}
			onClose={() => setVisible(false)}
			{...rest}
		>
			<Modal.Header>{header}</Modal.Header>
			<Modal.Content style={{ position: "relative" }}>
				{children}
			</Modal.Content>
			{!noButtons && (
				<Modal.Actions>
					<Button
						onClick={onYesClick}
						content={yesText}
						disabled={disabled}
						loading={loading}
						positive
					/>
					<Button onClick={onNoClick} content={noText} />
				</Modal.Actions>
			)}
		</Modal>
	);
};

export default WrappedDialog;
