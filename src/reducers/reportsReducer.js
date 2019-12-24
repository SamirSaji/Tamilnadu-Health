import {
  GET_ENTRYPAGE_LANG,
  NO_ERRORS_DOWNLOAD_REPORT,
  NO_ERRORS_DOWNLOAD_LINELIST,
  NO_ERRORS_DOWNLOAD_LAB_REPORT,
  DRUG_INVENTORY_SUBMIT_STATUS
} from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ENTRYPAGE_LANG:
      return action.payload;
    case NO_ERRORS_DOWNLOAD_REPORT:
      return action.payload;
    case NO_ERRORS_DOWNLOAD_LINELIST:
      return action.payload;
    case NO_ERRORS_DOWNLOAD_LAB_REPORT:
      return action.payload;
    case DRUG_INVENTORY_SUBMIT_STATUS:
    return {drug:action.payload};
    default:
      return state;
  }
}
