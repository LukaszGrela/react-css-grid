import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import dataReducer from '../reducers/dataReducer';
import thunk from 'redux-thunk';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Store creation
const configureStore = () => {
    const store = createStore(
        combineReducers({
            data: dataReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
};

export const store = configureStore();