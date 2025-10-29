import React from "react";
import { Button, Modal } from "semantic-ui-react";

const ConfirmationModal = ({
	header,
	content,
	onYes,
	onNo,
	open,
	setOpen
}) => {
	return (
		
		<Modal size="mini" open={open} onClose={() => setOpen(false)}>
			<Modal.Header>{header}</Modal.Header>
			<Modal.Content>{content}</Modal.Content>
			<Modal.Actions>
				<Button negative onClick={() => {
					onNo && onNo();
					setOpen(false)
				}}>No</Button>
				<Button
					positive
					icon='checkmark'
					labelPosition='right'
					content='Yes'
					onClick={() => {
						onYes && onYes();
						setOpen(false)
					}}
				/>
			</Modal.Actions>
		</Modal>
		
	);
}

export default ConfirmationModal;