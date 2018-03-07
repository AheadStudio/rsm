import {Map} from "immutable";
import {CENTER_MAP, CENTER_POLYGON, TOGGLE_FULL_MAP, CENTER_TRACK} from "../constants";

const initialState = Map({
  full: false,
  center: null,
  centerPolygon: null,
  centerTrack: null,
});
export default function map(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FULL_MAP:
      return state.set("full", !state.get("full"));
    case CENTER_MAP:
      return state.set("center", action.payload);
    case CENTER_POLYGON:
      return state.set("centerPolygon", action.payload);
    case CENTER_TRACK:
      return state.set("centerTrack", action.payload);
    default:
      return state;
  }
}