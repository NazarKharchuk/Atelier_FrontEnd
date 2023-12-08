import { createStore, combineReducers } from "redux";
import headerReducer from "./header-reducer";

let redusers = combineReducers({
    header: headerReducer,
});

let store = createStore(redusers);

export default store;