import { combineReducers } from 'redux';
import user from './user';
import lobby from './lobby';

export default combineReducers({ user, lobby });
