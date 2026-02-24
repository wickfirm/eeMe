// export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_THEME = 'SET_THEME';

// export interface LangState {
//     language: string;
// }
//
// interface SetLanguageAction {
//     type: typeof SET_LANGUAGE;
//     payload: string;
// }

export interface ThemeState {
    theme: string;
}

interface SetThemeAction {
    type: typeof SET_THEME;
    payload: string;
}

export type ThemeAction = SetThemeAction;