import {
  CHANGE_UNIT,
  DATA_ALL_MACHINES,
  SUCCES_REQUEST_UNITS,
  SUCCES_REQUEST_USERS,
  TOGGLE_ANPHYSIS,
  USER_INFO,
  SHOW_TRACK,
  SET_TYPE_TRACK,
  DELETE_TRACK,
  PUSH_TRACK,
  START_LOAD_TRACK,
  STOP_LOAD_TRACK,
  PUSH_DETAIL_DATA,
  PUSH_DETAIL_TRACK,
  DELETE_DETAIL_TRACK,
  DELETE_ALL_DETAIL_TRACK,
  PUSH_MARKERS, SHOW_MARKERS,
  SET_TIME,
  ACTIVE_WATCH,
} from "../constants";

export const pushUsers = (list) => (dispatch) => dispatch({type: SUCCES_REQUEST_USERS, payload: list});
export const userInfo = (user) => (dispatch) => dispatch({type: USER_INFO, payload: user});
export const pushUnits = (list) => (dispatch) => dispatch({type: SUCCES_REQUEST_UNITS, payload: list});
export const changeUnit = (unit) => (dispatch) => dispatch({type: CHANGE_UNIT, payload: unit});
export const toggleWatch = (id) => (dispatch) => dispatch({type: TOGGLE_ANPHYSIS, payload: id});
export const activeWatch = (id) => (dispatch) => dispatch({type: ACTIVE_WATCH, payload: id});
export const pushDataAllMachines = (data) => (dispatch) => dispatch({type: DATA_ALL_MACHINES, payload: data});
export const showTrack = (id) => (dispatch) => dispatch({type: SHOW_TRACK, payload: id});
export const setTypeTrack = (param) => (dispatch) => dispatch({type: SET_TYPE_TRACK, payload: param});
export const deleteTrack = (id) => (dispatch) => dispatch({type: DELETE_TRACK, payload: id});
export const startLoadTrack = (id) => (dispatch) => dispatch({type: START_LOAD_TRACK, payload: id});
export const stopLoadTrack = (id) => (dispatch) => dispatch({type: STOP_LOAD_TRACK, payload: id});
export const pushTrack = (data) => (dispatch) => dispatch({type: PUSH_TRACK, payload: data});
export const pushDetailData = (data) => (dispatch) => dispatch({type: PUSH_DETAIL_DATA, payload: data});
export const pushDetailTrack = (data) => (dispatch) => dispatch({type: PUSH_DETAIL_TRACK, payload: data});
export const deleteDetailTrack = (data) => (dispatch) => dispatch({type: DELETE_DETAIL_TRACK, payload: data});
export const deleteAllDetailTrack = (id) => (dispatch) => dispatch({type: DELETE_ALL_DETAIL_TRACK, payload: id});
export const pushMarkers = (data) => (dispatch) => dispatch({type: PUSH_MARKERS, payload: data});
export const showMarkers = (data) => (dispatch) => dispatch({type: SHOW_MARKERS, payload: data});
export const setTime = (data) => (dispatch) => dispatch({type: SET_TIME, payload: data});