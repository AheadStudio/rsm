import {PUSH_NOTIFICATION, SET_NUMBER_LOAD, CLEAR_NOTIFICATION, SET_RESULT_LOAD, COMPLETE_LOAD} from "../constants";
import {successNotifications} from "../../queries/socket";

export const pushNotification = (date) => (dispatch) => {
  dispatch({type: PUSH_NOTIFICATION, payload: date});
};

const statusStr = {
  "Прочие": 1,
  "Важные": 2,
  "Критические": 4,
};
export const startLoadNotifications = (dispatch, data) => {
  let status = 0;
  data.status.map((value) => {
    status = status + statusStr[value];
  });
  if(!data.status.length){
    status = 6;
  }
  const datailLoad = data.machine;
  datailLoad.map((item) => {
    item.from = data.time[0].from;
    item.to = data.time[0].to;
    item.mask = status;
  });
  dispatch({type: SET_NUMBER_LOAD, payload: data.machine});
  data.machine
    .filter((n, i) => i <= 5)
    .map((item) => {
      successNotifications({
        id: item.id,
        from: data.time[0].from,
        to: data.time[0].to,
        mask: status,
      });
    });
};
export const clearNotification = (dispatch) =>  dispatch({type: CLEAR_NOTIFICATION});
export const setResultLoad = (id) => (dispatch) => dispatch({type: SET_RESULT_LOAD, payload: id});
export const completeLoad = () => (dispatch) => dispatch({type: COMPLETE_LOAD});