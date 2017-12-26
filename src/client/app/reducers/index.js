import { combineReducers } from 'redux';
import user from './user';
import lobby from './lobby';
import game from './game';
import topLevel from './topLevel';
import leaderboard from './leaderboard';

export default combineReducers({ user, lobby, game, topLevel, leaderboard });
