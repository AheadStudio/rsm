import {SET_NUMBER_LOAD, PUSH_NOTIFICATION, CLEAR_NOTIFICATION, SET_RESULT_LOAD, COMPLETE_LOAD} from '../constants';
import {List, Map} from 'immutable';

const initialState = Map({
  notification: List([]),
  numberLoad: 0,
  resultLoad: List([]),
  detailLoad: List([])
});

export default function notification(state = initialState, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION: {
      return state.set("notification", List([...state.get("notification").toJS(), ...action.payload]));
    }
    case CLEAR_NOTIFICATION: {
      return state
        .set("notification", List([]))
        .set("numberLoad", 0);
    }
    case SET_NUMBER_LOAD: {
      return state
        .set("numberLoad", action.payload.length)
        .set("detailLoad", List(action.payload));
    }
    case SET_RESULT_LOAD: {
      return state.set("resultLoad", List([...state.get("resultLoad").toJS(), action.payload]));
    }
    case COMPLETE_LOAD: {
      return state.set("resultLoad", List([]))
        .set("detailLoad", List([]));
    }
    default:
      return state;
  }
}