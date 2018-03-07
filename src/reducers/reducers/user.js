import {Map} from "immutable";
import {DELETE_TGT, USER_TGT, USER_INFO, PRELOADER_START, PRELOADER_STOP} from "../constants";
import {LOAD} from "redux-storage";

const initialState = Map({
  tgt: "",
  preLoaded: false,
  info: Map({}),
});

export default function sidebar(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      if (action.payload.user) {
        return state.set("tgt", action.payload.user.tgt);
      }
      return state;
    case PRELOADER_START:
      return state.set("preLoaded", true);
    case PRELOADER_STOP:
      return state.set("preLoaded", false);
    case USER_INFO:
      return state.set("info", action.payload);
    case USER_TGT:
      return state.set("tgt", action.payload);
    case DELETE_TGT:
      return state.set("tgt", "");
    default:
      return state;
  }
}