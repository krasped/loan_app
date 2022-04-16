import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import autorizationReducer from "./autorizationReducer.js";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
    autorization : autorizationReducer
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
