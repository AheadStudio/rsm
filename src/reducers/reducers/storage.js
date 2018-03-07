import { LOAD, SAVE } from 'redux-storage';

export default function storageAwareReducer(state = { loaded: false }, action) {
  switch (action.type) {
    case LOAD:
      return { ...state, loaded: true };
    case SAVE:
      return state;
    default:
      return state;
  }
}