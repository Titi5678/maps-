import { takeLatest, call, put, all, takeEvery } from 'redux-saga/effects';
import * as types from '../constants/type-constant';
import * as api from '../connectivility/api.traffic';
import * as trafficAction from '../actions/traffic.action';

export function* doGetMapData() {
    try {
        // get all map data from backend
        const responsebody = yield call(api.getAllData);

        // save all map data
        yield put(trafficAction.saveAllData(responsebody.data));
    } catch (err) {
        yield put(trafficAction.errors(err.response.data));
    }
}

export function* watchMapData() {
    yield takeLatest(types.GET_ALL_DATA, doGetMapData)
}

export default function* rootSaga() {
    yield all([
        watchMapData()
    ]);
}