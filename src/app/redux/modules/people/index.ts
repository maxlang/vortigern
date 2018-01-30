import { IPeople, IPeopleAction, IPerson } from 'models/people';

/** Action Types */
export const GET_REQUEST: string = 'people/GET_REQUEST';
export const GET_SUCCESS: string = 'people/GET_SUCCESS';
export const GET_FAILURE: string = 'people/GET_FAILURE';

/** Initial State */
const initialState: IPeople = {
  isFetching: false,
};

/** Reducer */
export function peopleReducer(state = initialState, action: IPeopleAction) {
  switch (action.type) {
    case GET_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case GET_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        people: action.payload.people,
      });

    case GET_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.payload.message,
        error: true,
      });

    default:
      return state;
  }
}

/** Async Action Creator */
export function getPeople() {
  console.log('called get ppl');
  return (dispatch) => {
    dispatch(peopleRequest());
    console.log('HEREEE!!');
    return fetch('https://test.xlang.com/api/users')
      .then((res) => {
        if (res.ok) {
          return res.json()
            .then((res) => dispatch(peopleSuccess(res)));
        } else {
          return res.json()
            .then((res) => dispatch(peopleFailure(res)));
        }
      })
      .catch((err) => dispatch(peopleFailure(err)));
  };
}

/** Action Creator */
export function peopleRequest(): IPeopleAction {
  return {
    type: GET_REQUEST,
  };
}

/** Action Creator */
export function peopleSuccess(people: IPerson[]): IPeopleAction {
  return {
    type: GET_SUCCESS,
    payload: {
      people,
    },
  };
}

/** Action Creator */
export function peopleFailure(message: any): IPeopleAction {
  return {
    type: GET_FAILURE,
    payload: {
      message,
    },
  };
}
