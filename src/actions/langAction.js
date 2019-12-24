//library imports
import axios from 'axios';

//types import
import { GET_ENTRYPAGE_LANG } from './types'
import config from '../config';
export const getEntryPageLang = (myLang) => dispatch => {
    axios
        .get(`${config.apiURL}/api/language/${myLang}/entryPage`)
        .then(res =>{
            console.info('ENTRYPAGE', res)
            dispatch({
                type: GET_ENTRYPAGE_LANG,
                payload: res.data
            })
        })
        .catch(err =>
            dispatch({
                type: GET_ENTRYPAGE_LANG,
                payload: {}
            })
        );
};
