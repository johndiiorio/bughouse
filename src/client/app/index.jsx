import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import RouteComponent from './components/RouteComponent';
import reducers from './reducers';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

// Creates and applies thunk middleware to the Redux store, which is defined from the Redux reducers
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

// Renders the entire application, starting with RouteComponent, into the root div
// Provides the Redux store to all child components
render(
	<Provider store={store}>
		<RouteComponent />
	</Provider>,
	document.getElementById('root')
);