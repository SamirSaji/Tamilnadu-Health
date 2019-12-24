
import { GET_ENTRYPAGE_LANG } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ENTRYPAGE_LANG:
      return action.payload;
    default:
      return state;
  }
}