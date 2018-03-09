import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {createAction} from 'redux-act';

const getEmojis = () => fetch('https://test.xlang.com/api/emojis').then((res) => res.json());

export const emojisAction = createActionAsync('Emojis', getEmojis);
export const emojisReducer = createReducerAsync(emojisAction);

export const addEmojiAction = createAction<any[]>('Add Emojis');
emojisReducer.on(addEmojiAction, (store, emojis) => ({...store, data: [...store.data, ...emojis]}));
