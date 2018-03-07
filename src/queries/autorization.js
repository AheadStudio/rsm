import { pushUserTgt,  userLogout } from "../reducers/actions/loginizaion";
import { userInfo } from "../reducers/actions/users";
import initSocked from "./socket";
import $ from "jquery";
import "whatwg-fetch";

const host = "https://agrotronic.rostselmash.com:8443";

export const logIn = (tgt, callback) => (dispatch) => {
  function *succesData() {
    const stForUser = yield succesST(tgt);
    const dataUser = yield succesUserData(stForUser);
    dispatch(userInfo(dataUser));
    const stForSocket = yield succesST(tgt);
    yield callback(stForSocket);
  }

  function succesST(tgt) {
    $.ajax({
      url: `${host}/cas/v1/tickets/${tgt}`,
      method: "POST",
      data: {
        service: `${host}/data/user`,
      },
      dataType: "html",
      crossDomain: true,
      error: () => {
        dispatch(userLogout());
      },
      success: (data) => {
        it.next(data);
      },
    });
  }

  function succesUserData(st){
    $.ajax({
      url: `${host}/data/user?ticket=${st}`,
      method: "GET",
      dataType: "html",
      crossDomain: true,
      error: () => {
        dispatch(userLogout());
      },
      success: (data) => {
        it.next(JSON.parse(data));
      },
    });
  }

  const it = succesData();
  it.next();
};

export const succesAutorization = (param) => (dispatch) => {
  $.ajax({
    url: `${host}/cas/v1/tickets`,
    method: "POST",
    data: {
      username: param.username,
      password: param.password,
    },
    dataType: "html",
    crossDomain: true,
    error: () => {
      dispatch(userLogout());
    },
    success: (data) => {
      const link = data.split("https")[1].split(" ")[0].substring(0, data.split("https")[1].split(" ")[0].length - 1);
      const tgt = link.split("://agrotronic.rostselmash.com:8443/cas/v1/tickets/")[1];
      dispatch(pushUserTgt(tgt));
      dispatch(initSocked(tgt));
    },
  });
};