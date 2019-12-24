
import { LINEENTRY_SUCCESS } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case LINEENTRY_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}