import { combineReducers } from 'redux';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers for combine
import traffic from './traffic.reducer';


const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['traffic']
}

const rootReducer = combineReducers({
	traffic
});

export default persistReducer(persistConfig, rootReducer);