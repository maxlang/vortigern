import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { counterReducer } from './modules/counter';
import { starsReducer } from './modules/stars';
import { peopleReducer } from './modules/people';
import { IStore } from './IStore';
import { emojisReducer } from 'redux/modules/emojis';
import { userLocationsReducer } from 'redux/modules/persontimelapse';

const { reducer } = require('redux-connect');

const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  counter: counterReducer,
  stars: starsReducer,
  people: peopleReducer,
  reduxAsyncConnect: reducer,
  emojis: emojisReducer,
  userlocations: userLocationsReducer,
});

export default rootReducer;
