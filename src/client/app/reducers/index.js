import { combineReducers } from 'redux';
import user from './user';
import lobby from './lobby';
import topLevel from './topLevel';

export default combineReducers({ user, lobby, topLevel });
