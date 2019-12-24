
import { PATIENT_LIST_LOADING } from '../actions/types';

const initialState = {
    isPatientSearchLoading:true
};

export default function (state = initialState, action) {
    switch (action.type) {
        case PATIENT_LIST_LOADING: 
            return {
                isPatientSearchLoading:action.payload
            }
        default:
            return state;
    }
}