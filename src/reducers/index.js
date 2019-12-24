import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import successReducer from './successReducer';
import languageReducer from './languageReducer';
import reportsReducer from './reportsReducer';
import lineEntrylistReducer from './lineEntrylistReducer';
import loadingReducer from './loadingReducer';
import commonLoadingReducer from './commonLoading';
import lineListReducer from './lineListReducer'; 

export default combineReducers({
  auth: authReducer,
  errors:errorReducer,
  language:languageReducer,
  reports:reportsReducer,
  successMessage:successReducer,
  lineEntrylist:lineEntrylistReducer,
  globalLoading:loadingReducer,
  commonLoading:commonLoadingReducer,
  lineListData : lineListReducer
});
