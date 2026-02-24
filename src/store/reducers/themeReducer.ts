import { SET_THEME, ThemeAction, ThemeState } from '../types';

const localStorageTheme = localStorage.getItem('theme');

const initialState: ThemeState = {
    theme: localStorageTheme ? localStorageTheme : 'dark'
}

const langReducer = (state = initialState, action: ThemeAction) => {
    switch(action.type) {
        case SET_THEME:
            return {
                ...state,
                theme: action.payload
            }
        default:
            return state;
    }
}

export default langReducer;