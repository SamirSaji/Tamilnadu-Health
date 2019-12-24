
import { IS_LOADING } from '../actions/types';

const initialState = false;

export default function (state = initialState, action) {
    switch (action.type) {
        case IS_LOADING:
            return action.payload;
        default:
            return state;
    }
}