import { put, call, takeEvery } from "redux-saga/effects";
import _ from "lodash";

import { apiRequest } from "api";
import { capitalize } from "lodash";

export function* reqSaga(dispatchType, action) {
	try {
		const response = yield call(apiRequest, action.payload);
		yield put({
			type: dispatchType,
			payload: response.data || action.payload
		});
	} catch (e) {
		yield put({
			type: `${dispatchType}_ERROR`,
			payload: e.response || e
		});
	}
}

export function templateReducer(resourceName, mapKey = "id") {
	return function(state = {}, action) {
		function dataReducer(state = {}, action) {
			switch (action.type) {
				case `GET_${resourceName}S`:
					return { ..._.mapKeys(action.payload, mapKey) };
				case `GET_${resourceName}`:
					return { ...state, [action.payload.id]: action.payload };
				case `POST_${resourceName}`:
					return { ...state, [action.payload.id]: action.payload };
				case `DELETE_${resourceName}`:
					return _.omit(state, action.payload.id);
				default:
					return state;
			}
		}
		function loadingReducer(state = false, action) {
			switch (action.type) {
				case `GET_${resourceName}S_REQUEST`:
				case `GET_${resourceName}_REQUEST`:
				case `POST_${resourceName}_REQUEST`:
				case `DELETE_${resourceName}_REQUEST`:
					return true;
				case `GET_${resourceName}S`:
				case `GET_${resourceName}`:
				case `POST_${resourceName}`:
				case `DELETE_${resourceName}`:
				case `GET_${resourceName}S_ERROR`:
				case `GET_${resourceName}_ERROR`:
				case `POST_${resourceName}__ERROR`:
				case `DELETE_${resourceName}_ERROR`:
					return false;
				default:
					return state;
			}
		}
		function errorReducer(state = {}, action) {
			switch (action.type) {
				case `GET_${resourceName}S_ERROR`:
				case `GET_${resourceName}_ERROR`:
				case `POST_${resourceName}_ERROR`:
				case `DELETE_${resourceName}_ERROR`:
					return action.payload;
				default:
					return state;
			}
		}
		return {
			error: errorReducer(state.error, action),
			loading: loadingReducer(state.loading, action),
			data: dataReducer(state.data, action)
		};
	};
}

export function templateLazyReducer(resourceName, mapKey = "id") {
	return function(state = { results: {} }, action) {
		function dataReducer(state, action) {
			switch (action.type) {
				case `GET_${resourceName}S`:
					return {
						...action.payload,
						results: _.mapKeys(action.payload.results, mapKey)
					};
				case `GET_${resourceName}`:
					return {
						...state,
						results: {
							...state.results,
							[action.payload.id]: action.payload
						}
					};
				case `POST_${resourceName}`:
					return {
						...state,
						results: {
							...state.results,
							[action.payload.id]: action.payload
						}
					};
				case `DELETE_${resourceName}`:
					return {
						...state,
						results: _.omit(state.results, action.payload.id)
					};
				default:
					return state;
			}
		}
		function loadingReducer(state = false, action) {
			switch (action.type) {
				case `GET_${resourceName}S_REQUEST`:
				case `GET_${resourceName}_REQUEST`:
				case `POST_${resourceName}_REQUEST`:
				case `DELETE_${resourceName}_REQUEST`:
					return true;
				case `GET_${resourceName}S`:
				case `GET_${resourceName}`:
				case `POST_${resourceName}`:
				case `DELETE_${resourceName}`:
				case `GET_${resourceName}S_ERROR`:
				case `GET_${resourceName}_ERROR`:
				case `POST_${resourceName}_ERROR`:
				case `DELETE_${resourceName}_ERROR`:
					return false;
				default:
					return state;
			}
		}
		function errorReducer(state = {}, action) {
			switch (action.type) {
				case `GET_${resourceName}S_ERROR`:
				case `GET_${resourceName}_ERROR`:
				case `POST_${resourceName}_ERROR`:
				case `DELETE_${resourceName}_ERROR`:
					return action.payload;
				default:
					return state;
			}
		}
		return {
			...dataReducer(state, action),
			error: errorReducer(state.error, action),
			loading: loadingReducer(state.loading, action)
		};
	};
}

export function templateSaga(resourceName) {
	return function*() {
		yield takeEvery(
			`GET_${resourceName}S_REQUEST`,
			reqSaga,
			`GET_${resourceName}S`
		);
		yield takeEvery(
			`GET_${resourceName}_REQUEST`,
			reqSaga,
			`GET_${resourceName}`
		);
		yield takeEvery(
			`POST_${resourceName}_REQUEST`,
			reqSaga,
			`POST_${resourceName}`
		);
		yield takeEvery(
			`DELETE_${resourceName}_REQUEST`,
			reqSaga,
			`DELETE_${resourceName}`
		);
	};
}

export function templateActions(resourceName, path = resourceName) {
	return {
		[`get${capitalize(resourceName)}s`]: config => {
			return {
				type: `GET_${resourceName.toUpperCase()}S_REQUEST`,
				payload: { method: "get", url: `/${path}`, ...config }
			};
		},

		[`get${capitalize(resourceName)}`]: (id, config) => {
			return {
				type: `GET_${resourceName.toUpperCase()}_REQUEST`,
				payload: {
					method: "get",
					url: `/${path}/${id}`,
					...config
				}
			};
		},

		[`post${capitalize(resourceName)}`]: (data, config) => {
			return {
				type: `POST_${resourceName.toUpperCase()}_REQUEST`,
				payload: {
					method: "post",
					url: `/${path}`,
					data,
					...config
				}
			};
		},

		[`delete${capitalize(resourceName)}`]: (id, config) => {
			return {
				type: `DELETE_${resourceName.toUpperCase()}_REQUEST`,
				payload: {
					method: "delete",
					url: `/${path}/${id}`,
					id,
					...config
				}
			};
		}
	};
}
