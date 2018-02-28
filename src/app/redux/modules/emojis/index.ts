import {createActionAsync, createReducerAsync} from 'redux-act-async';

const getEmojis = () => fetch('https://test.xlang.com/api/emojis').then((res) => res.json());

export const emojisAction = createActionAsync('Emojis', getEmojis);
export const emojisReducer = createReducerAsync(emojisAction);
