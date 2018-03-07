import { TOGGLE_SIDEBAR } from '../constants';
import { Map } from 'immutable';

const initialState = Map({
  open: false,
});

export default function sidebar(state = initialState, action) {
  switch(action.type) {
    case TOGGLE_SIDEBAR:
      return state.set("open", !state.get("open"));
    default:
      return state;  
  }
}