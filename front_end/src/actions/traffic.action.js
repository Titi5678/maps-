import * as types from '../constants/type-constant';

export function getMapData() {
    return {
        type:types.GET_ALL_DATA
    }
}

export function saveAllData(mapdata) {
	return {
		type: types.SAVE_ALL_DATA,
		payload: mapdata
	}
}

export function errors(data) {
	return {
		type: types.GET_ERRORS,
		data: data
	}
}