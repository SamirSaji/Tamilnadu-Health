import {LINE_ENTRY_LIST, FETCH_FAMILY_MEMBER_LIST} from '../actions/types';

const initial = {};

export default function(state = initial , action){
    switch(action.type){
        case LINE_ENTRY_LIST: 
            return action.payload;
        case FETCH_FAMILY_MEMBER_LIST:
            return { usersList : action.payload };
        default:
            return state;
    }
}