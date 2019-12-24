import { EMPTY_ERRORS } from '../actions/types';
const emptyErrors = () => dispatch => {
    dispatch({
        type:EMPTY_ERRORS,
        payload:{}
    });
};

export { emptyErrors };