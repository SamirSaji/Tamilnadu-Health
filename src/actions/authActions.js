import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import config from '../config';
import { jwt_decode } from '../utils/Common';
import { clearStore } from '../indexeDB/addData';
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post(`${config.apiURL}/api/users`, userData)
    .then(res => {
      if (res.data.status === 200) {
        // Save to localStorage
        const { token } = res.data;
        // Set token to ls
        localStorage.setItem('jwtToken', token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded =jwt_decode(token);
        
        // Set current user
        dispatch(setCurrentUser(decoded));
      }

    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      });
    }
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  // localStorage.setItem('usersdata', decoded);
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => async dispatch => {
  // Remove token from localStorage
  await clearStore(['lineList', 'lineEntryVitals']);
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
