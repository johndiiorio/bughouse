import { combineReducers } from 'redux';
import user from './user';
import lobby from './lobby';
import game from './game';
import topLevel from './topLevel';
import leaderBoard from './leaderBoard';

export default combineReducers({ user, lobby, game, topLevel, leaderBoard });
