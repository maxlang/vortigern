import {createActionAsync, createReducerAsync} from 'redux-act-async';
import * as moment from 'moment';
// import {createReducer, Action} from 'redux-act';

// NOTE: redux-act-async appends dispatch and state to the args
const userLocationsFetch = (user, start, end, dispatch, state) => {
  const times = [];
  if (start && dispatch) {
    times.push('start=' + moment(start).toISOString());
  }
  if (end && state) {
    console.log('eeend', end);
    times.push('end=' + moment(end).toISOString());

  }
  return fetch(`https://test.xlang.com/api/${user}/locations?${times.join('&')}`).then((res) => res.json());
};

export const getUserLocations = createActionAsync('Get all user locations', userLocationsFetch);
export const userLocationsReducer = createReducerAsync(getUserLocations);

// NOTE: currently only allows you to pull in one user - that's desired, but this is bugging me
// TODO: fix up createReducerAsync
// export const userLocationsReducer = createReducer({}, {})
//   .on(getUserLocations.request,
//     (store, action: Action<any, string>) => ({...store, [action.meta]: userLocationsReducerHelper(store, action)}))
//   .on(getUserLocations.ok,
//     (store, action: Action<any, string>) => ({...store, [action.meta]: userLocationsReducerHelper(store, action)}))
//   .on(getUserLocations.error,
//     (store, action: Action<any, string>) => ({...store, [action.meta]: userLocationsReducerHelper(store, action)}))
//   .on(getUserLocations.reset,
//     (store, action: Action<any, string>) => ({...store, [action.meta]: userLocationsReducerHelper(store, action)}))
//   .options({payload: false});
