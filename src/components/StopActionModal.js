import React from "react";
import { Button, Modal } from "semantic-ui-react";

const StopActionModal = ({
	header,
	content,
	open,
	setOpen
}) => {
	return (
		<Modal size="mini" open={open} onClose={() => setOpen(false)}>
			<Modal.Header>{header}</Modal.Header>
			<Modal.Content>{content}</Modal.Content>
			<Modal.Actions>
				<Button negative onClick={() => {
					setOpen(false)
				}}>Close</Button>
			</Modal.Actions>
		</Modal>
	);
}

export default StopActionModal;

