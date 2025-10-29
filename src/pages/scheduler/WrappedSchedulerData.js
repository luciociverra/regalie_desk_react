import {SchedulerData} from "react-big-scheduler";

//SORGENTE REACT BIG SCHEDULER MODIFICATO
class WrappedSchedulerData extends SchedulerData {
	_getSpan(start, end, headers) {
		//MODIFICA!!! AGGIUNTO IF PER FAR SI CHE NELLA VIEW WEEK UN BLOCCHETTO NON VADA AL GIORNO DOPO
		if (this.viewType === 6) {
			return 1;
		} else {
			return super._getSpan(start, end, headers);
		}
	}

	_createRenderData() {
		let initRenderData = this._createInitRenderData(
			this.isEventPerspective,
			this.eventGroups,
			this.resources,
			this.headers
		);

		let cellMaxEventsCount = this.getCellMaxEvents();
		const cellMaxEventsCountValue = 30;

		// aggiunto perchè dava problemi di sovrapposizione
		this.events.sort((a, b) => ('' + a.start).localeCompare(b.start))

		this.events.forEach((item, idx) => {
			let resourceEventsList = initRenderData.filter(
				x => x.slotId === this._getEventSlotId(item)
			);

			if (resourceEventsList.length > 0) {
				let resourceEvents = resourceEventsList[0];
				let span = this._getSpan(item.start, item.end, this.headers);
				let eventStart = this.localeMoment(item.start),
					eventEnd = this.localeMoment(item.end);
				let pos = -1;

				//MODIFICA NON VOGLIO MAI AVERE EVENTI CHE PARTONO PRIMA DELL'INIZIO DELLO SCHEDULER
				if (
					this.localeMoment(resourceEvents.headerItems[0].start).isAfter(eventStart)
				) {
					return;
				}
				//FINE MODIFICA
				resourceEvents.headerItems.forEach((header, index) => {
					let headerStart = this.localeMoment(header.start),
						headerEnd = this.localeMoment(header.end);

					if (headerEnd > eventStart && headerStart < eventEnd) {
						header.count = header.count + 1;
						if (header.count > resourceEvents.rowMaxCount) {
							resourceEvents.rowMaxCount = header.count;
							let rowsCount =
								cellMaxEventsCount <= cellMaxEventsCountValue &&
								resourceEvents.rowMaxCount > cellMaxEventsCount
									? cellMaxEventsCount
									: resourceEvents.rowMaxCount;
                                                        //lciv sempre largo + 20                        
							let newRowHeight =
								rowsCount * this.config.eventItemLineHeight +
								(this.config.creatable &&
								this.config.checkConflict === false
									? 20
									: 20);
							if (newRowHeight > resourceEvents.rowHeight)
								resourceEvents.rowHeight = newRowHeight;
						}

						if (pos === -1) {
							let tmp = 0;

							while (header.events[tmp] !== undefined) {
								tmp++;
							}

							pos = tmp;
						}
						let render = headerStart <= eventStart || index === 0;

						if (render === false) {
							//MODIFICA!!! SE NON RENDERIZZA RIDUCO IL TOTALE EVENTI DELL'HEADER
							if (this.viewType === 6) {
								header.count = header.count - 1;
							}
							//FINE MODIFICA
							let previousHeader =
								resourceEvents.headerItems[index - 1];
							let previousHeaderStart = this.localeMoment(
								previousHeader.start
								),
								previousHeaderEnd = this.localeMoment(
									previousHeader.end
								);

							if (
								previousHeaderEnd <= eventStart ||
								previousHeaderStart >= eventEnd
							) {
								render = true;
							}
						}
						//MODIFICA!!! AGGIUNTO IF PER FAR SI CHE NELLA VIEW WEEK UN BLOCCHETTO NON VADA AL GIORNO DOPO

						if (render || this.viewType !== 6) {
							header.events[pos] = this._createHeaderEvent(
								render,
								span,
								item
							);
						}

						// rimosso , messo ordinamento per tutti gli eventi senno' problemi di visualizzazione
						//ORDINO IN MODO DA AVERE GLI EVENTI SENZA ROLE DOPO
						// header.events = header.events.sort((a, b) => {
						// 	if (
						// 		a.eventItem.idRostRole &&
						// 		b.eventItem.idRostRole
						// 	) {
						// 		return 0;
						// 	} else if (
						// 		a.eventItem.idRostRole &&
						// 		!b.eventItem.idRostRole
						// 	) {
						// 		return -1;
						// 	} else {
						// 		return 1;
						// 	}
						// });

						//FINE MODIFICA
					}
				});
			}
		});

		if (
			cellMaxEventsCount <= cellMaxEventsCountValue ||
			this.behaviors.getSummaryFunc !== undefined
		) {
			initRenderData.forEach(resourceEvents => {
				let hasSummary = false;
				resourceEvents.headerItems.forEach(headerItem => {
					if (cellMaxEventsCount <= cellMaxEventsCountValue) {
						let renderItemsCount = 0,
							addMoreIndex = 0,
							index = 0;
						while (index < cellMaxEventsCount - 1) {
							if (headerItem.events[index] !== undefined) {
								renderItemsCount++;
								addMoreIndex = index + 1;
							}

							index++;
						}

						if (headerItem.events[index] !== undefined) {
							if (renderItemsCount + 1 < headerItem.count) {
								headerItem.addMore =
									headerItem.count - renderItemsCount;
								headerItem.addMoreIndex = addMoreIndex;
							}
						} else {
							if (renderItemsCount < headerItem.count) {
								headerItem.addMore =
									headerItem.count - renderItemsCount;
								headerItem.addMoreIndex = addMoreIndex;
							}
						}
					}

					if (this.behaviors.getSummaryFunc !== undefined) {
						let events = [];
						headerItem.events.forEach(e => {
							if (!!e && !!e.eventItem) events.push(e.eventItem);
						});

						headerItem.summary = this.behaviors.getSummaryFunc(
							this,
							events,
							resourceEvents.slotId,
							resourceEvents.slotName,
							headerItem.start,
							headerItem.end
						);
						if (
							!!headerItem.summary &&
							headerItem.summary.text !== undefined
						)
							hasSummary = true;
					}
				});

				resourceEvents.hasSummary = hasSummary;
				if (hasSummary) {
					let rowsCount =
						cellMaxEventsCount <= cellMaxEventsCountValue &&
						resourceEvents.rowMaxCount > cellMaxEventsCount
							? cellMaxEventsCount
							: resourceEvents.rowMaxCount;
					let newRowHeight =
						(rowsCount + 1) * this.config.eventItemLineHeight +
						(this.config.creatable &&
						this.config.checkConflict === false
							? 20
							: 20);
					if (newRowHeight > resourceEvents.rowHeight)
						resourceEvents.rowHeight = newRowHeight;
				}
			});
		}

		this.renderData = initRenderData;
	}
}

export default WrappedSchedulerData;
