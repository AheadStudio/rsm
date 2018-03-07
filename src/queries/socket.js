import io from "socket.io-client";
import moment from "moment";
import {pushNotification, setResultLoad} from "../reducers/actions/notification";
import {preLoaderStart, userLogin, userLogout} from "../reducers/actions/loginizaion";
import {centerTrack, pushGeoZone} from "../reducers/actions/map";
import {deleteGeoZone, newGeoZone} from "../reducers/actions/geoZone";
import {logIn} from "./autorization";
import {
  changeUnit,
  pushDataAllMachines,
  pushDetailData,
  pushMarkers,
  pushTrack,
  stopLoadTrack
} from "../reducers/actions/users";
import {finishLoadExport, progressReportExport, pushReport, pushTrackReport} from "../reducers/actions/reports";
import {SOCKED_ACTION, SOCKED_EVENTS} from "./constants";

const host = "https://agrotronic.rostselmash.com:8443";
const host_socked = (window.location.pathname.indexOf('newui') === -1) && window.location.hostname !== "localhost" ? "https://agrotronic.rostselmash.com:19011" : "https://agrotronic.rostselmash.com:19021";
const generationToken = () => {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
};
export let socket = null;

export const trackGeoZone = (data) => {
  socket.emit("get", {entity: "HISTORY", options: {id: data.id, from: data.from, to: data.to, geoObjects: ""}});
};

export const succesTrack = (data) => {
  let from, to;
  if (data.week) {
    from = data.from;
    to = data.to;
    socket.emit("get", {entity: "TRACK", options: {id: data.id, from: from, to: to}});
  } else {
    from = `${data.time[0].date.format("YYMMDD").toString()}${data.time[0].time.hourse}${data.time[0].time.minute}00000`;
    to = moment(data.time[1].date.valueOf() - 500).format("YYMMDDHHmmss000");
    socket.emit("get", {entity: "TRACK", options: {id: data.id, from: from, to: to}});
  }
};

export const successFuel = (data) => {
  socket.emit("reportFuel", {
    id: data.id,
    from: data.from,
    to: data.to,
    needEvents: true,
  });
};

export const successTime = (data) => {
  socket.emit("reportTime", {
    ids: data.ids,
    from: data.from,
    to: data.to,
  });
};

export const succesDetail = (data) => {
  socket.emit("get", {
    entity: "HISTORY",
    options: {
      id: data.id,
      from: data.from,
      to: data.to,
      regsStd: "ACTIVE,FIRST_MOTOR,LAST_MOTOR,FIRST_MOVE,LAST_MOVE,TIME_MOVE_NO_HARVEST,TIME_STOP,AVER_SPEED_MOVE,FIRST_COMBINE,LAST_COMBINE,TIME_HARVEST,AVER_SPEED_COMBINE,INC_SUMM_MOLOT,INC_SUMM_AREA,INC_SUMM_FUEL,INC_SUMM_AREA_NO_IZM,AREA_PER_TIME,INC_SUMM_MOTOR,INC_SUMM_CHASSIS,INC_SUMM_UPLOAD,INC_SUMM_FUEL_COMB,INC_SUMM_FUEL_MOVE,AVER_LOAD_COMBINE,MAX_LOAD,MAX_TMP_MOTOR,MAX_TMP_GST_MOVE,MAX_TMP_GST_ROTOR,MIN_TO_10,MIN_TO_250,MIN_TO_500,NUM_MESSAGES_MAIN,NUM_MESSAGES_CRIT,TIME_NO_LINK,MAX_SUMM_MOTOR,MAX_SUMM_MOLOT,MAX_SUMM_CHASSIS,MAX_SUMM_AREA,MAX_SUMM_UPLOAD,MAX_SUMM_FUEL,MAX_SUMM_FUEL_COMB,MAX_SUMM_FUEL_MOVE"
    }
  });
};

export const successMarkers = (data) => {
  socket.emit("get", {
    entity: "MARKERS",
    options: {
      id: data.id,
      from: data.from,
      to: data.to,
    }
  });
};

export const successIndicators = (data) => {
  socket.emit("get", {
    entity: "INDICATORS",
    options: {
      id: data.id,
      from: data.from,
      to: data.to,
    }
  });
};

export const successExport = (data) => {
  socket.emit("report", {
    options: {
      typeReport: data.typeReport,
      from: data.from,
      to: data.to,
      id: data.id,
      flag: data.flag,
      idProgress: data.idProgress,
    }
  });
};

export const addGeoZone = (data) => {
  socket.emit("create", {entity: "GEO", options: {name: data.name, location: data.zone}});
};

export const deleteGeoZoneWS = (id) => {
  socket.emit("delete", {entity: "GEO", options: {idObj: id}});
};

export const successNotifications = (data) => {
  socket.emit("get", {
    entity: "MESSAGES",
    options: {
      id: data.id,
      from: data.from,
      to: data.to,
      mask: data.mask
    }
  });
};

export const successUnloading = (data) => {
  socket.emit("reportUnloads", {
    ids: [data.id],
    from: data.from,
    to: data.to,
  });
};

export const successCleaning = (data) => {
  socket.emit("reportHarvest", {
    ids: [data.id],
    from: data.from,
    to: data.to,
  });
};

export const successMachine = (data) => {
  socket.emit("reportMachine", {
    id: data.id,
    from: data.from,
    to: data.to,
  });
};

export const successReportTrack = (data, type) => {
  socket.emit("get",
    {
      entity: "TRACK_EMPTY",
      options: {
        id: data.id,
        from: data.from,
        to: data.to,
        type: "report",
        report: type,
      }
    });
};

export const updateGeoZone = (data) => {
  socket.emit("update", {
    entity: "GEO",
    options: {
      idObj: data.idObj,
      name: data.name,
      location: data.location
    }
  });
};

export const changeUser = (data) => {
  socket.emit("update", {
    entity: "USER",
    options: {
      email: data.email,
      phone: data.phone,
    }
  });
};

const GMT = (-(new Date()).getTimezoneOffset()) / 60;

const initSocked = (tgt) => (dispatch) => {
  let token = localStorage.getItem("rsm-agrotronic-token");
  socket = io.connect(host_socked);

  socket.emit("isready");
  dispatch(preLoaderStart());

  socket.on(SOCKED_EVENTS.CONNECT, () => {
    if (!token) {
      token = generationToken();
      localStorage.setItem("rsm-agrotronic-token", token);
    }
  });

  socket.on("isready", (data) => {
    if (data.result === "server ready") {
      dispatch(logIn(tgt, (st) => {
        socket.emit(SOCKED_ACTION.CONNECT_USER, {
          service: `${host}/data/user`,
          ticket: st,
          GMT,
          lang: "RU",
          token: token
        });
        socket.emit("get", {entity: "GEO", options: {}});
      }));
    } else {
      setTimeout(17000, socket.emit("isready"));
    }
  });

  socket.on(SOCKED_EVENTS.ERROR, () => {
    dispatch(userLogout());
  });

  socket.on(SOCKED_EVENTS.LOGIN_USERS, (users) => {
    const filterData = users.users.filter((user) => user.type === 28 || user.type === 27 || user.type === 29 || user.type === 17 || user.type === 35);
    dispatch(userLogin(filterData, "users"));
    const data = {};
    for (let key in users) {
      if (key !== "users") {
        data[key] = users[key];
      }
    }
    dispatch(pushDataAllMachines(data));
  });

  socket.on(SOCKED_EVENTS.CHANGE_STATE, (unit) => {
    dispatch(changeUnit(unit));
  });


  socket.on("get", (data) => {
    switch (data.entity) {
      case "GEO": {
        dispatch(pushGeoZone(data.data));
        break;
      }
      case "TRACK": {
        if (data.options.type !== "report") {
          if (data.data.TRACK_HARVEST) {
            dispatch(pushTrack({
              id: data.options.id,
              track: data.data,
            }));
            dispatch(centerTrack(data.data.TRACK_HARVEST));
          } else {
            dispatch(stopLoadTrack(data.options.id));
          }
        } else {
          // dispatch(pushTrackReport({type: data.options.report, data: data.data.TRACK_HARVEST}));
        }
        break;
      }
      case "TRACK_EMPTY": {
        if (data.options.type === "report") {
          if (data.data.TRACK_EMPTY) {
            dispatch(pushTrackReport({type: data.options.report, data: data.data.TRACK_EMPTY}));
          }
        }
        break;
      }
      case "HISTORY": {
        if (data.data) {
          dispatch(pushDetailData({
            id: data.options.id,
            data: data.data,
            date: [data.options.from, data.options.to],
          }));
        }
        break;
      }
      case "MESSAGES": {
        if (data.data) {
          const newData = data.data;
          newData.map((item) => item.idMachine = data.options.id);
          dispatch(setResultLoad(data.options.id));
          dispatch(pushNotification(newData));
        }
        break;
      }
      case "MARKERS": {
        if (data.data) {
          dispatch(pushMarkers({data: data.data, id: data.options.id}));
        }
        break;
      }
      case "INDICATORS": {
        dispatch(pushReport({data: data.data, type: "performanceIndicators", resultLoad: data.options.id}));
        break;
      }
      default: {
        break;
      }
    }
  });

  socket.on("delete", (data) => {
    switch (data.entity) {
      case "GEO" : {
        if (data.data === "OK") {
          dispatch(deleteGeoZone(data.options.idObj));
        }
        break;
      }
      default: {
        break;
      }
    }
  });

  socket.on("create", (data) => {
    switch (data.entity) {
      case "GEO": {
        if (typeof data.data === "number") {
          const geoZone = {
            location: data.options.location,
            name: data.options.name,
            id: data.data,
            type: data.options.location.type,
          };
          dispatch(newGeoZone(geoZone));
        }
      }
      default: {
        break;
      }
    }
  });

  socket.on(SOCKED_EVENTS.LOGIN_UNITS, (units) => {
    dispatch(userLogin(units.units, "units"));
    const data = {};
    for (let key in units) {
      if (key !== "units") {
        data[key] = units[key];
      }
    }
    dispatch(pushDataAllMachines(data));
  });

  socket.on("update", (data) => {
    switch (data.entity) {
      case "GEO": {
        if(data.data === "OK") {
          updateGeoZone(data.options);
        }
        break;
      }
      case "USER": {
        break;
      }
    }
  });

  socket.on("reportFuel", (data) => {
    dispatch(pushReport({data: data, type: "fueling", resultLoad: data.id}));
  });

  socket.on("reportTime", (data) => {
    dispatch(pushReport({data: data, type: "time", resultLoad: []}));
  });

  socket.on("reportUnloads", (data) => {
    if (data[0]) {
      dispatch(pushReport({data: data[0], type: "unloading", resultLoad: data[0].id}));
    }
  });

  socket.on("reportHarvest", (data) => {
    if (data[0]) {
      dispatch(pushReport({data: data[0], type: "cleaning", resultLoad: data[0].id}));
    }
  });

  socket.on("reportMachine", (data) => {
    dispatch(pushReport({data: data, type: "machine", resultLoad: data.id}));
  });

  socket.on("report", (data) => {
    dispatch(finishLoadExport({src: data.data, id: data.options.idProgress}));
  });

  socket.on("progress", (data) => {
    dispatch(progressReportExport(data));
  });
};

export default initSocked;