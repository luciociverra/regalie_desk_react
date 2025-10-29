import React, {useEffect, useState} from "react";
import {Button, Checkbox, Dropdown, Input, Label} from "semantic-ui-react";

import WrappedDialog from "./WrappedDialog";
import LoadingOverlay from "components/LoadingOverlay";

import "./templateDialog.css";
import moment from "moment";
import Utils from "../Utils";
 
 

//In questo file ci sono tutti i dialog che controllano creazione, caricamento, management, rotazione dei template
//vengono aperti a seconda di che templateDialog.visible c'è tramite lo switch renderContent
const TemplateDialog = ({
	rosteringData,
	schedulerData,
	templateDialog,
	setTemplateDialog,
	getTemplates,
	loadTemplate,
	saveTemplate,
	deleteTemplate
}) => {
	const { visible } = templateDialog;

	function initialSelected() {
		const { tplReg } = rosteringData;
		return tplReg ? tplReg.id : null;
	}

	function renderContent(type) {
		switch (type) {
			case "load":
				return (
					<LoadTemplate
						rosteringData={rosteringData}
						templateDialog={templateDialog}
						setTemplateDialog={setTemplateDialog}
						getTemplates={getTemplates}
						loadTemplate={loadTemplate}
						initialSelected={initialSelected}
					/>
				);
			case "save":
				return (
					<SaveAsTemplate
						templateDialog={templateDialog}
						setTemplateDialog={setTemplateDialog}
						getTemplates={getTemplates}
						saveTemplate={saveTemplate}
						initialSelected={initialSelected}
					/>
				);
			case "copyto":
				return (
					<CopyWeekTemplate
						rosteringData={rosteringData}
						schedulerData={schedulerData}
						templateDialog={templateDialog}
						setTemplateDialog={setTemplateDialog}
					/>
				);
			case "edit":
				return (
					<ManageTemplates
						templateDialog={templateDialog}
						setTemplateDialog={setTemplateDialog}
						getTemplates={getTemplates}
						saveTemplate={saveTemplate}
						deleteTemplate={deleteTemplate}
					/>
				);
			case "rotating":
				return (
					<RotatingTemplates
						templateDialog={templateDialog}
						setTemplateDialog={setTemplateDialog}
						getTemplates={getTemplates}
					/>
				);
			default:
				break;
		}
	}

	return <>{renderContent(visible)}</>;
};
//**********************************************************************************************************************
//
//**********************************************************************************************************************
const CopyWeekTemplate = ({ templateDialog, setTemplateDialog,schedulerData,rosteringData }) => {
	const { visible } = templateDialog;
	const [payPeriod, setPayPeriod] = useState();

	function onCopy(){
 	 

	}

	return (
		<WrappedDialog
			 
		>
			 
		</WrappedDialog>
	);
};

//**********************************************************************************************************************
//
//**********************************************************************************************************************
const LoadTemplate = ({ initialSelected, templateDialog, setTemplateDialog, getTemplates, loadTemplate }) => {
	const { visible } = templateDialog;
	const [selected, setSelected] = useState(initialSelected);
	const [templates, setTemplates] = useState();

	function renderContent(templates) {
		if (templates && !templates.length) {
			return "No templates available";
		} else {
			return (
				<>
					<div className="save-template-label">Select a template:</div>
					<TemplateSelectDropdown
						selected={selected}
						setSelected={setSelected}
						getTemplates={getTemplates}
						setTemplates={setTemplates}
					/>
				</>
			);
		}
	}

	return (
		<WrappedDialog
			visible={visible === "load"}
			setVisible={visible => setTemplateDialog({ visible })}
			header="Load Template"
			yesText="Load"
			noText="Cancel"
			onConfirm={() => loadTemplate(selected)}
			disabled={!selected}
			style={{ width: 500 }}
		>
			{renderContent(templates)}
		</WrappedDialog>
	);
};
//**********************************************************************************************************************
//
//**********************************************************************************************************************
const SaveAsTemplate = ({ initialSelected, templateDialog, setTemplateDialog, getTemplates, saveTemplate }) => {
	const { visible } = templateDialog;
	const [templates, setTemplates] = useState();
	const [selected, setSelected] = useState(initialSelected);
	const [override, setOverride] = useState(false);
	const [sameName, setSameName] = useState(false);
	const [name, setName] = useState("");

	useEffect(() => {
		getTemplates().then(data => {
			setTemplates(data);
		});
	}, [getTemplates, setTemplates]);

	const sameNameCheck = (name) => {
		templates?.find(e => e.name === name) ? setSameName(true) : setSameName(false);
	}

	async function onConfirm() {
		if (override) {
			await saveTemplate({
				id: selected,
				saveas: true,
				...templates.find(e => e.id === selected)
			});
		} else {
			await saveTemplate({ saveas: true, name: name });
		}
	}

	const renderContent = override => {
		if (override) {
			return (
				<>
					<div className="save-template-label">Select template to override</div>
					<TemplateSelectDropdown
						selected={selected}
						setSelected={setSelected}
						getTemplates={getTemplates}
						setTemplates={setTemplates}
					/>
				</>
			);
		} else {
			return (
				<>
					<div className="save-template-label">Insert template name</div>
					<Input
						placeholder="Insert template name"
						value={name}
						onChange={(e, { value }) => { setName(value); sameNameCheck(value); }}
						error={sameName}
					/>
					{sameName ? <div style={{ color: "red" }}>There's a template with the same name!</div> : <div/>}
				</>
			);
		}
	};

	return (
		<WrappedDialog
			visible={visible === "save"}
			setVisible={visible => setTemplateDialog({ visible })}
			header="Save as Template"
			yesText="Save"
			noText="Cancel"
			onConfirm={onConfirm}
			disabled={override ? !selected : !name || sameName}
		>
			<div>
				<Checkbox
					label="Override existing template"
					checked={override}
					onChange={() => setOverride(prev => !prev)}
					style={{ marginBottom: 10 }}
				/>
				{renderContent(override)}
			</div>
		</WrappedDialog>
	);
};
//**********************************************************************************************************************
//
//**********************************************************************************************************************
const ManageTemplates = ({ templateDialog, setTemplateDialog, getTemplates, saveTemplate, deleteTemplate }) => {
	const { visible } = templateDialog;
	const [loading, setLoading] = useState();
	const [templates, setTemplates] = useState();
	const [editing, setEditing] = useState();
	const [newName, setNewName] = useState("");

	useEffect(() => {
		setLoading(true);
		getTemplates().then(data => {
			setTemplates(data);
			setLoading(false);
		});
	}, [getTemplates, setTemplates]);

	function renderContent(templates) {
		if (!templates) {
			return <LoadingOverlay />;
		} else if (!templates.length) {
			return <span className="empty-text">No templates available</span>;
		} else {
			return templates.map(templ => <TemplateItem key={templ.id} templ={templ} />);
		}
	}

	async function onTemplateDelete(id) {
		try {
			setLoading(true);
			await deleteTemplate(id);
			const templates = await getTemplates();
			setTemplates(templates);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.error(e);
		}
	}

	const renderTemplateName = templ => {
		if (editing !== templ.id) {
			return <div>{templ.name}</div>;
		} else {
			return (
				<input
					className="edit-name-input"
					autoFocus
					spellCheck={false}
					placeholder="Insert template name"
					value={newName}
					onChange={e => setNewName(e.target.value)}
					onBlur={() => {
						setTimeout(() => {
							setEditing(null);
							setNewName("");
						}, 200);
					}}
				/>
			);
		}
	};

	const TemplateItem = ({ templ }) => {
		const isEditing = editing === templ.id;
		return (
			<div className="rostering-template-item">
				<div>{renderTemplateName(templ)}</div>
				<div>
					{isEditing ? (
						<i
							className={`ui green check icon clickable hoverable`}
							onClick={async () => {
								if (newName !== templ.name) {
									await saveTemplate({
										...templ,
										name: newName
									});
									const templates = await getTemplates();
									setTemplates(templates);
								}
								setEditing(null);
								setNewName("");
							}}
							title="Save template"
						/>
					) : (
							<i
								className={`ui green pencil icon clickable hoverable`}
								onClick={() => {
									setEditing(templ.id);
									setNewName(templ.name);
								}}
								title="Edit template"
							/>
						)}
				</div>
				<div>
					<i
						className="ui red trash alternate icon clickable hoverable"
						title="Delete template"
						onClick={() => !loading && onTemplateDelete(templ.id)}
						disabled={loading}
						style={{ paddingLeft: 5 }}
					/>
				</div>
			</div>
		);
	};

	return (
		<WrappedDialog
			visible={visible === "edit"}
			setVisible={visible => setTemplateDialog({ visible })}
			header="Manage Templates"
			noButtons={true}
		>
			<div className="manage-templates-dialog-content">{renderContent(templates)}</div>
		</WrappedDialog>
	);
};
//**********************************************************************************************************************
//
//**********************************************************************************************************************
const RotatingTemplates = ({ templateDialog, setTemplateDialog, getTemplates, initialSequence = [null] }) => {
	const { visible } = templateDialog;
	const [sequence, setSequence] = useState(getSequence);
	const [templates, setTemplates] = useState([]);

	useEffect(() => {
		getTemplates().then(setTemplates);
	}, [getTemplates]);

	function mapTemplatesForDropdown(templates) {
		return templates.map(templ => ({
			key: templ.id,
			value: templ.id,
			text: templ.name
		}));
	}

	function setSequenceIndex(e, idx) {
		setSequence(prev => {
			const newSequence = [...prev];
			newSequence[idx] = e;
			return newSequence;
		});
	}

	function addToSequence() {
		if (sequence[sequence.length - 1]) {
			setSequence(prev => [...prev, null]);
		}
	}

	function removeIndexFromSequence(idx) {
		setSequence(prev => prev.filter((e, i) => idx !== i));
	}

	function saveSequence() {
		const currentWeekOfYear = moment().week();
		const toStore = {
			startingWeek: currentWeekOfYear,
			templateSequence: sequence
		};
		sessionStorage.setItem("templateSequence", JSON.stringify(toStore));
	}

	function getSequence() {
		let templateSequence = sessionStorage.getItem("templateSequence");
		if (templateSequence) {
			templateSequence = JSON.parse(templateSequence).templateSequence;
			return templateSequence;
		}
		return [null];
	}

	return (
		<WrappedDialog
			visible={visible === "rotating"}
			setVisible={visible => setTemplateDialog({ visible })}
			header="Templates rotation"
			yesText="Save"
			noText="Cancel"
			disabled={!sequence.length}
			onConfirm={saveSequence}
		>
			<div className="rotating-templates-dialog-content">
				<h2>Select template sequence</h2>
				{sequence.map((item, idx) => (
					<div key={idx} className="week-template-container">
						<Label>Week {idx + 1}</Label>
						<Dropdown
							value={sequence[idx]}
							onChange={(e, { value }) => {
								if (!value) {
									removeIndexFromSequence(idx);
								} else {
									setSequenceIndex(value, idx);
								}
							}}
							clearable
							selection
							options={mapTemplatesForDropdown(templates)}
							style={{ height: 20 }}
							placeholder="Select template"
						/>
					</div>
				))}
				<div>
					<Button fluid basic icon="plus" content="Add" onClick={addToSequence}/>
				</div>
			</div>
		</WrappedDialog>
	);
};
//**********************************************************************************************************************
//
//**********************************************************************************************************************
const TemplateSelectDropdown = ({ selected, setSelected, getTemplates, setTemplates: setTemplatesProps }) => {
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getTemplates().then(data => {
			if (setTemplatesProps) setTemplatesProps(data);
			setTemplates(data);
			setLoading(false);
			if (data.length) setSelected(prev => (prev ? prev : data[0].id));
		});
	}, [getTemplates, setSelected, setTemplates, setTemplatesProps]);

	function mapTemplatesForDropdown(templates) {
		return templates.map(templ => ({
			key: templ.id,
			value: templ.id,
			text: templ.name,
			content: <div style={{ display: "flex" }}>
				<div>{templ.name}</div>
				<div style={{ marginLeft: "auto" }}>{Utils.formatRemoteDate(templ.lstupd)}</div>
			</div>
		}));
	}

	return (
		<Dropdown
			value={selected}
			onChange={(e, { value }) => setSelected(value)}
			selection
			placeholder={templates.length ? "Select a template" : "No templates available"}
			disabled={!templates.length}
			loading={loading}
			options={mapTemplatesForDropdown(templates)}
			style={{ height: 20, width: "100%" }}
			header={<div style={{ display: "flex", padding: "0 20px 0 15px", fontWeight: "bold", color: "#44d" }}>
				<div>Template Name</div>
				<div style={{ marginLeft: "auto" }}>Last Update</div>
			</div>}
		/>
	);
};

export default TemplateDialog;
