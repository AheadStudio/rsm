import {
  FINISH_LOAD_REPORT, PUSH_REPORT, START_LOAD_REPORT, CLEAR_RESULT, PUSH_TRACK_REPORT,
  START_LOAD_EXPORT,FINISH_LOAD_EXPORT, PROGRESS_REPORT_EXPORT
} from "../constants";
import {successTime, successExport} from "../../queries/socket";

export const pushReport = (data) => (dispatch) => {
  dispatch({type: PUSH_REPORT, payload: data});
};
export const startLoadReport = (type) => (dispatch) => dispatch({type: START_LOAD_REPORT, payload: type});
export const finishLoadReport = (type) => (dispatch) => dispatch({type: FINISH_LOAD_REPORT, payload: type});
export const clearReport = (dispatch, type) => dispatch({type: CLEAR_RESULT, payload: type});
export const progressReportExport = (data) => (dispatch) => dispatch({type: PROGRESS_REPORT_EXPORT, payload: data});

export const successReport = (dispatch, data, type, querie) => {
  const detailLoad = data.machine;
  detailLoad.map((item) => {
    item.from = data.time[0].from;
    item.to = data.time[0].to;
  });
  dispatch({
    type: START_LOAD_REPORT,
    payload: {
      type: type,
      detail: detailLoad
    }
  });
  detailLoad
    .filter((n, i) => i <= 5)
    .map((item) => {
      querie({
        id: item.id,
        from: item.from,
        to: item.to,
      });
    });
};

export const successReportAndTrack = (dispatch, data, type, querie) => {
  const detailLoad = data.machine;
  detailLoad.map((item) => {
    item.from = data.time[0].from;
    item.to = data.time[0].to;
    detailLoad.push({
      from: data.time[0].from,
      to: data.time[0].to,
      id: item.id,
      type: "track"
    });
  });
  dispatch({
    type: START_LOAD_REPORT,
    payload: {
      type: type,
      detail: detailLoad
    }
  });
  detailLoad
    .filter((n, i) => i <= 5)
    .map((item) => {
      querie({
        id: item.id,
        from: item.from,
        to: item.to,
      });
    });
};

export const pushTime = (dispatch, data, type) => {
  const ids = data.machine.map((item) => item.id);
  const querie = {
    ids,
    from: data.time[0].from,
    to: data.time[0].to,
  };
  dispatch({
    type: START_LOAD_REPORT,
    payload: {
      type: type,
      detail: [querie]
    }
  });
  successTime(querie);
};

export const pushTrackReport = (data) => (dispacth) => dispacth({type: PUSH_TRACK_REPORT, payload: data});
export const startLoadExport = (data) => (dispatch) => {
  successExport(data);
  dispatch({type: START_LOAD_EXPORT, payload: data});
};
export const finishLoadExport = (data) => (dispatch) => dispatch({type: FINISH_LOAD_EXPORT, payload: data});