import React from "react";
import Cropper from "react-cropper";
import { Slider } from "primereact/slider";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import "cropperjs/dist/cropper.css";

/**
 * Visualizzatore e modifica di nuove immagini (ritaglio e rotazione)
 * Proprietà valide:
 * 	image : immagine da visualizzare (blob)
 * Evento:
 * 	onChange(blob) -> al crop della nuova immagine
 */
class ImageCropper extends React.Component {
	static defaultProps = {
		onChange: () => {},
		noImageText: "- No Image -",
		imageOptions: {
			height: 800,
			width: 338,
			fillColor: "#fff",
			imageSmoothingEnabled: true,
			imageSmoothingQuality: "high"
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			confirmNullImage: false,
			croppedImage: null,
			uploadedImage: null,
			rotationAngle: 0,
			cropResult: null,
			cropResultBlob: null
		};
		this.cropper = React.createRef(null);
	}

	_crop() {
		let canvas = this.cropper.current ? this.cropper.current.getCroppedCanvas(this.props.imageOptions) : null;
		if (canvas) {
			canvas.toBlob(blob => {
				this.setState({
					cropResult: canvas.toDataURL(),
					cropResultBlob: blob
				});
			}, "image/png");
		}
	}

	handleSelection() {
		let newImageBlob = this.state.cropResultBlob;
		let newImage = this.state.cropResult;
		this.props.onChange(newImageBlob, newImage);
		this.setState({
			croppedImage: null,
			uploadedImage: null,
			rotationAngle: 0,
			cropResult: null,
			cropResultBlob: null
		});
	}

	setEmptyImage() {
		this.image = null;
		let newImageBlob = null;
		let newImage = null;
		this.props.onChange(newImageBlob, newImage);
		this.setState({
			croppedImage: null,
			uploadedImage: null,
			rotationAngle: 0,
			cropResult: null,
			cropResultBlob: null
		});
	}

	handleRotation(e) {
		if (this.cropper && this.cropper.current) {
			this.cropper.current.rotateTo(e.value);
		}
	}

	imageUploadHandler(e) {
		if (e.target.files && e.target.files[0]) {
			var reader = new FileReader();
			reader.onload = e => {
				this.setState({ uploadedImage: e.target.result });
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	onHide() {
		this.setState({
			croppedImage: null,
			uploadedImage: null,
			rotationAngle: 0,
			cropResult: null,
			cropResultBlob: null
		});
	}

	getDefaultView() {
		const pStyle = {
			minHeight: "78px",
			width: "140px",
			border: "black solid 1px"
		};

		try {
			if (this.props.image && this.props.image.size) {
				let urlCreator = window.URL || window.webkitURL;
				let urlImage = urlCreator.createObjectURL(this.props.image);
				this.image = urlImage;
			}
		} catch (error) {
			console.error(error);
		}

		return (
			<div>
				<table>
					<tbody>
						<tr>
							<td colSpan={2}>
								{this.image ? (
									<img style={pStyle} src={this.image} alt={this.props.noImageText} />
								) : (
									<div
										style={{
											...pStyle,
											display: "flex",
											justifyContent: "center",
											alignItems: "center"
										}}
									>
										<i className="huge icons">
											<i className="image icon"></i>
											<i className="top right corner x icon"></i>
										</i>
									</div>
								)}
							</td>
						</tr>
						<tr>
							<td>
								<Button
									type="button"
									label="Inserisci"
									icon="pi pi-plus"
									onClick={e => this.imgcrpselimgfile.click()}
								/>
							</td>
							<td style={{ textAlign: "right" }}>
								{this.props.image && this.props.image.size ? (
									<Button
										type="button"
										icon="pi pi-trash"
										onClick={e => {
											this.setState({
												confirmNullImage: true
											});
										}}
									/>
								) : null}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	getDialog() {
		return (
			<Dialog
				header="Image Editor"
				visible={true}
				style={{ textAlign: "center" }}
				modal={true}
				onHide={e => this.onHide()}
			>
				<table>
					<tbody>
						<tr>
							<td style={{ border: "black 1px solid" }}>
								<Cropper
									src={this.state.uploadedImage}
									zoomOnWheel={false}
									rotatable={true}
									movable={true}
									autoCrop={false}
									ref={this.cropper}
									style={{ height: 400, width: 711 }}
									aspectRatio={16 / 9}
									guides={true}
								/>
							</td>
							<td style={{ verticalAlign: "top" }}>
								{this.state.cropResult !== null && (
									<div>
										<img style={{ width: 400 }} src={this.state.cropResult} alt="cropped" />
										<br />
										Size: {this.state.cropResultBlob.size}
										bytes
									</div>
								)}
							</td>
						</tr>
						<tr>
							<td colSpan={2}>
								<table>
									<tbody>
										<tr>
											<td>
												Rotazione
												{this.state.rotationAngle}°
											</td>
											<td colSpan={5}></td>
										</tr>
										<tr>
											<td>
												<Slider
													min={-180}
													max={180}
													value={this.state.rotationAngle}
													onChange={e => {
														this.handleRotation(e);
														this.setState({
															rotationAngle: e.value
														});
													}}
													style={{
														width: 200,
														marginRight: ".75em"
													}}
												/>
											</td>
											<td>
												<Button
													type="button"
													label="Zoom"
													icon="pi pi-plus-circle"
													style={{
														marginRight: ".25em"
													}}
													onClick={e => this.cropper.current.zoom(0.1)}
												/>
											</td>
											<td>
												<Button
													type="button"
													label="Zoom"
													icon="pi pi-minus-circle"
													style={{
														marginRight: ".75em"
													}}
													onClick={e => this.cropper.current.zoom(-0.1)}
												/>
											</td>
											<td>
												<Button
													type="button"
													label="Open New"
													icon="pi pi-folder-open"
													style={{}}
													onClick={e => this.imgcrpselimgfile.click()}
												/>
											</td>
											<td>
												<Button
													type="button"
													label="Cut"
													icon="pi pi-images"
													style={{
														marginRight: ".75em"
													}}
													onClick={e => this._crop()}
												/>
											</td>

											<td>
												{this.state.cropResult !== null && (
													<Button
														type="button"
														label="Select"
														icon="pi pi-sign-in"
														className="p-button-success"
														onClick={e => this.handleSelection()}
													/>
												)}
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</Dialog>
		);
	}

	render() {
		const confirmNullFooter = (
			<div>
				<Button
					type="button"
					label="Yes"
					icon="pi pi-check"
					onClick={() => {
						this.setEmptyImage();
						this.setState({ confirmNullImage: false });
					}}
				/>
				<Button
					type="button"
					label="No"
					icon="pi pi-times"
					onClick={() => {
						this.setState({ confirmNullImage: false });
					}}
					className="p-button-secondary"
				/>
			</div>
		);
		return (
			<div>
				<Dialog
					header="Conferma"
					visible={this.state.confirmNullImage}
					footer={confirmNullFooter}
					onHide={() => {
						this.setState({ confirmNullImage: false });
					}}
				>
					Vuoi impostare l'immagine come vuota?
				</Dialog>
				{this.state.uploadedImage == null && this.getDefaultView()}
				{this.state.uploadedImage && this.getDialog()}
				<input
					id="imgcrpselimgfile"
					type="file"
					value=""
					ref={input => (this.imgcrpselimgfile = input)}
					onChange={e => {
						this.imageUploadHandler(e);
					}}
					style={{ visibility: "hidden" }}
				/>
			</div>
		);
	}
}

export default ImageCropper;
