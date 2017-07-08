import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { Provider } from 'react-redux';
import RouteContainer from './containers/RouteContainer';
import reducers from './reducers';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
	reducers,
	composeEnhancers(
		applyMiddleware(thunkMiddleware), autoRehydrate()
	)
);

persistStore(store);

render(
	<Provider store={store}>
		<RouteContainer />
	</Provider>,
	document.getElementById('root')
);

export default store;
