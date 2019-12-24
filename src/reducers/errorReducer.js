
import { GET_ERRORS,EMPTY_ERRORS } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case EMPTY_ERRORS:
      return action.payload;
    case GET_ERRORS:
      return action;
    default:
      return state;
  }
}