// import { createStoreHook, } from 'react-redux';
// import {createStore} from 'redux';
// configureStore,
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { combineReducers} from 'redux';
import { legacy_createStore as createStore } from "redux";

const reducer = combineReducers({
    CollapsedReducer
});

const store = createStore(reducer);

export default store;