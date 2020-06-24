import * as types from '../constants/type-constant';

const initialState = {
  mapData: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.SAVE_ALL_DATA:
            return {
                ...state,
                mapData: action.payload
            };
        default:
            return state;
    }
}