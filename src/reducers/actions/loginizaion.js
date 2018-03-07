import { browserHistory } from "react-router";
import { link } from "../../router";
import { pushUsers, pushUnits } from "./users";
import { USER_TGT, DELETE_TGT, PRELOADER_START, PRELOADER_STOP } from "../constants";


export const pushUserTgt = (tgt) => (dispatch) => {
  dispatch({ type: USER_TGT, payload: tgt });
};

export const preLoaderStart = () => (dispatch) => {
  dispatch({ type: PRELOADER_START });
};

export const preLoaderStop = () => (dispatch) => {
  dispatch({ type: PRELOADER_STOP });
};

export const deleteUserTgt = () => (dispatch) => {
  dispatch({ type: DELETE_TGT });
};

export const userLogin = (data, type) => (dispatch) => {
  if (type === "users") {
    dispatch(pushUsers(data));
  } else {
    dispatch(pushUnits(data));
  }
  if(window.location.pathname === link.autorizacion){
    browserHistory.push(link.home);
  }
};

export const userLogout = () => (dispatch) => {
  dispatch(deleteUserTgt());
  window.location.pathname = link.autorizacion;
};
