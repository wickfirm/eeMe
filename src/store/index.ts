import { createStore, combineReducers } from 'redux';

import themeReducer from './reducers/themeReducer';

const rootReducer = combineReducers({
    theme: themeReducer
});

const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default store;