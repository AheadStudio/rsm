import { TOGGLE_FULL_MAP, CENTER_MAP, PUSH_GEOZONE, CENTER_TRACK} from "../constants";

export const toggleFullMap = () => (dispatch) => dispatch({ type: TOGGLE_FULL_MAP });
export const centerMap = (center) => (dispatch) => dispatch({ type: CENTER_MAP, payload: center });
export const pushGeoZone = (list) => (dispatch) => dispatch({ type: PUSH_GEOZONE, payload: list });
export const centerTrack = (track) => (dispatch) => dispatch({type: CENTER_TRACK, payload: track});