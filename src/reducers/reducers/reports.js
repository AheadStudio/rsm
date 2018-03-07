import {List, Map} from "immutable";
import {
  CLEAR_RESULT,
  FINISH_LOAD_EXPORT,
  FINISH_LOAD_REPORT, PROGRESS_REPORT_EXPORT,
  PUSH_REPORT,
  PUSH_TRACK_REPORT,
  START_LOAD_EXPORT,
  START_LOAD_REPORT
} from "../constants";

const initialState = Map({
  time: Map({
    time: List([]),
    numberLoad: 0,
    resultLoad: List([]),
    detailLoad: List([])
  }),
  fueling: Map({
    fueling: List([]),
    numberLoad: 0,
    resultLoad: List([]),
    detailLoad: List([]),
    track: null,
    markers: null,
  }),
  performanceIndicators: Map({
    performanceIndicators: List([]),
    numberLoad: 0,
    resultLoad: List([]),
    detailLoad: List([])
  }),
  machine: Map({
    machine: List([]),
    numberLoad: 0,
    resultLoad: List([]),
    detailLoad: List([]),
    track: null
  }),
  cleaning: Map({
    cleaning: List([]),
    numberLoad: 0,
    resultLoad: List([]),
    detailLoad: List([])
  }),
  unloading: Map({
    unloading: List([]),
    numberLoad: 0,
    resultLoad: List([]),
    detailLoad: List([])
  }),
  exportReport: List([])
});

export default function reports(state = initialState, action) {
  switch (action.type) {
    case PUSH_REPORT: {
      if (action.payload.resultLoad) {
        return state
          .setIn([action.payload.type, action.payload.type], List([...state.getIn([action.payload.type, action.payload.type]).toJS(), action.payload.data]))
          .setIn([action.payload.type, "resultLoad"], List([...state.getIn([action.payload.type, "resultLoad"]).toJS(), action.payload.resultLoad]));
      } else {
        return state.setIn([action.payload.type, action.payload.type], List([...state.getIn([action.payload.type, action.payload.type]).toJS(), action.payload.data]));
      }
    }
    case START_LOAD_REPORT: {
      return state
        .setIn([action.payload.type, "numberLoad"], action.payload.detail.length)
        .setIn([action.payload.type, "detailLoad"], List(action.payload.detail));
    }
    case FINISH_LOAD_REPORT: {
      return state
        .setIn([action.payload, "resultLoad"], List([]))
        .setIn([action.payload, "detailLoad"], List([]));
    }
    case CLEAR_RESULT: {
      if (action.payload !== "machine" && action.payload !== "fueling") {
        return state.setIn([action.payload, action.payload], List([]));
      } else {
        return state.setIn([action.payload, action.payload], List([]))
          .setIn([action.payload, "track"], null)
          .setIn([action.payload, "markers"], null);
      }
    }
    case PUSH_TRACK_REPORT: {
      return state.setIn([action.payload.type, "track"], action.payload.data);
    }
    case START_LOAD_EXPORT: {
      return state.set("exportReport", List([action.payload, ...state.get("exportReport")]));
    }
    case FINISH_LOAD_EXPORT: {
      const finish = state.get("exportReport").toJS();
      const findFinish = finish.find((report) => report.idProgress === action.payload.id);
      if (findFinish) {
        findFinish.linkSrc = action.payload.src;
      }
      window.location = findFinish.linkSrc;
      return state.set("exportReport", List(finish));
    }
    case PROGRESS_REPORT_EXPORT: {
      const newProgress = state.get("exportReport").toJS();
      const findExport = newProgress.find((report) => report.idProgress === action.payload.id);
      if (findExport) {
        findExport.progress = action.payload.value;
      }
      return state.set("exportReport", List(newProgress));
    }
    default: {
      return state;
    }
  }
}