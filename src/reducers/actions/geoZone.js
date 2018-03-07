import {
  CENTER_POLYGON,
  CHANGE_NEW_GEOZONE,
  DELETE_GEOZONE,
  DELETE_NEW_GEOZONE,
  NEW_GEOZONE,
  WATCH_GEOZONE,
  SHOW_GEOZONE,
  HIDE_ALL_GEOZONE,
  UPDATE_GEOZONE
} from "../constants";

export const watchGeoZone = (id) => (dispatch) => dispatch({type: WATCH_GEOZONE, payload: id});
export const centerPolygon = (id) => (dispatch) => dispatch({type: CENTER_POLYGON, payload: id});
export const newGeoZone = (data) => (dispatch) => dispatch({type: NEW_GEOZONE, payload: data});
export const changeNewGeoZone = (data) => (dispatch) => dispatch({type: CHANGE_NEW_GEOZONE, payload: data});
export const deleteNewGeoZone = () => (dispatch) => dispatch({type: DELETE_NEW_GEOZONE});
export const deleteGeoZone = (id) => (dispatch) => dispatch({type: DELETE_GEOZONE, payload: id});
export const showGeoZone = (id) => (dispatch) => dispatch({type: SHOW_GEOZONE, payload: id});
export const hideAllGeoZone = () => (dispatch) => dispatch({type: HIDE_ALL_GEOZONE});
export const updateGeoZone = (data) => (dispatch) => dispatch({type:UPDATE_GEOZONE, payload: data});