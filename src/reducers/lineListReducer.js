import {LINE_LIST_DATA} from '../actions/types';

const initial = {};

export default function(state = initial , action){
    switch(action.type){
        case LINE_LIST_DATA: 
            return action.payload;
        default:
            return state;
    }
}