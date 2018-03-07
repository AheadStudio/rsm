import {
  ACTIVE_WATCH,
  CHANGE_UNIT,
  DATA_ALL_MACHINES,
  DELETE_ALL_DETAIL_TRACK,
  DELETE_TRACK,
  PUSH_DETAIL_DATA,
  PUSH_DETAIL_TRACK,
  PUSH_MARKERS,
  PUSH_TRACK,
  SET_TYPE_TRACK,
  SHOW_MARKERS,
  SHOW_TRACK,
  START_LOAD_TRACK,
  STOP_LOAD_TRACK,
  SUCCES_REQUEST_UNITS,
  SUCCES_REQUEST_USERS,
  TOGGLE_ANPHYSIS,
  SET_TIME
} from "../constants";
import _ from "lodash";
import {List, Map} from "immutable";

const initialState = Map({
  users: List([]),
  dataAllMachines: Map({}),
});

export default function users(state = initialState, action) {
  switch (action.type) {
    case SUCCES_REQUEST_USERS:
      const newStateUsers = state.get("users").toJS();
      const watch = localStorage.getItem("users-watch");
      if (watch) {
        JSON.parse(watch).map((item) => {
          action.payload.map((user) => {
            user.units.units.map((unit) => {
              if (unit.id === item) {
                unit.watch = true;
                unit.main = true;
              }
            });
          });
        });
      }
      if (newStateUsers.length) {
        newStateUsers.map((user) => {
          user.units.units.map((unit) => {
            action.payload.map((nUser) => {
              const findUnit = nUser.units.units.find((u) => u.id === unit.id);
              unit = _.mergeWith(unit, findUnit, (prev, next) => {
                if (unit.track && unit.track.static && unit.track.activeTrack && next[unit.track.type]) {
                  unit.track.activeTrack[unit.track.type] = next[unit.track.type];
                }
                return next;
              });
            });
            return unit;
          });
        });
        return state.set("users", List(newStateUsers));
      } else {
        action.payload.map((user) => {
          user.units.units.map((unit) => {
            unit.main = user.name;
          });
        });
        return state.set("users", List(action.payload));
      }
    case SUCCES_REQUEST_UNITS:
      const staticUser = [
        {
          id: null,
          name: "Мои машины",
          parent: null,
          type: null,
          units: {
            units: action.payload
          },
        },
      ];
      return state.set("users", List(staticUser));
    case CHANGE_UNIT:
      return state.set("users", state.get("users").map((user) => {
        if (user.units.units.find((unit) => unit.id === action.payload.id)) {
          const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
          for (let key in action.payload) {
            findUnit[key] = action.payload[key];
          }
        }
        return user;
      }));
    case TOGGLE_ANPHYSIS:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        if (findUnit) {
          const watch = localStorage.getItem("users-watch");
          if (findUnit.watch) {
            findUnit.watch = !findUnit.watch;
          } else {
            findUnit.watch = true;
          }
          if (watch) {
            if (JSON.parse(watch).find((num) => num === findUnit.id)) {
              localStorage.setItem("users-watch", JSON.stringify(JSON.parse(watch).filter((num) => num !== findUnit.id)));
            } else {
              localStorage.setItem("users-watch", JSON.stringify([...JSON.parse(watch), findUnit.id]));
            }
          } else {
            localStorage.setItem("users-watch", JSON.stringify([findUnit.id]));
          }
        }
        return user;
      }));
    case ACTIVE_WATCH: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        const watch = localStorage.getItem("users-watch");
        if (findUnit) {
          findUnit.watch = true;
          if (watch) {
            if (!JSON.parse(watch).find((num) => num === findUnit.id)) {
              localStorage.setItem("users-watch", JSON.stringify([...JSON.parse(watch), findUnit.id]));
            }
          } else {
            localStorage.setItem("users-watch", JSON.stringify([findUnit.id]));
          }
        }
        return user;
      }));
    }
    case SHOW_TRACK:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        if (findUnit) {
          findUnit.track = {
            type: "TRACK_HARVEST",
            static: true,
            loadData: true,
            activeTrack: {
              TRACK_HARVEST: findUnit.data.TRACK_HARVEST,
              TRACK_LOAD: findUnit.data.TRACK_LOAD,
              TRACK_SPEED: findUnit.data.TRACK_SPEED
            }
          };
        }
        return user;
      }));
    case SET_TYPE_TRACK:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit) {
          if (findUnit.track) {
            findUnit.track.type = action.payload.type;
          } else {
            findUnit.track = {
              type: "TRACK_HARVEST"
            };
          }
        }
        return user;
      }));
    case DELETE_TRACK:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        if (findUnit) {
          delete findUnit.track.activeTrack;
          delete findUnit.detailTrack;
          delete findUnit.timeTrack;
          delete findUnit.markers;
          delete findUnit.showTypesMarkers;
          if (findUnit.detailData && findUnit.detailData.DATA_GEO) {
            findUnit.detailData.DATA_GEO = [];
          }
        }
        return user;
      }));
    case START_LOAD_TRACK:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        if (findUnit) {
          findUnit.loadTrack = true;
        }
        return user;
      }));
    case STOP_LOAD_TRACK:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        if (findUnit) {
          findUnit.loadTrack = false;
        }
        return user;
      }));
    case PUSH_TRACK:
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit) {
          findUnit.loadTrack = false;
          if (findUnit.track) {
            findUnit.loadData = true;
            findUnit.track.track = action.payload.track;
            findUnit.track.activeTrack = action.payload.track;
          } else {
            findUnit.track = {
              loadData: true,
              static: false,
              track: action.payload.track,
              activeTrack: action.payload.track,
              type: "TRACK_HARVEST"
            };
          }
        }
        return user;
      }));
    case DELETE_ALL_DETAIL_TRACK: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload);
        if (findUnit) {
          findUnit.detailTrack = [];
        }
        return user;
      }));
    }
    case PUSH_DETAIL_DATA: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit) {
          findUnit.detailData = action.payload.data;
          findUnit.dateData = action.payload.date;
        }
        return user;
      }));
    }
    case PUSH_DETAIL_TRACK: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit && findUnit.detailTrack) {
          const findZone = findUnit.detailTrack.find((item) => item === action.payload.track);
          if (findZone) {
            findUnit.detailTrack = findUnit.detailTrack.filter((item) => item !== action.payload.track);
          } else {
            findUnit.detailTrack = [...findUnit.detailTrack, action.payload.track];
          }
        } else {
          if (findUnit) {
            findUnit.detailTrack = [action.payload.track];
          }
        }
        return user;
      }));
    }
    case DATA_ALL_MACHINES:
      return state.set("dataAllMachines", Map(action.payload));
    case PUSH_MARKERS: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit) {
          findUnit.markers = action.payload.data;
        }
        return user;
      }));
    }
    case SHOW_MARKERS: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit) {
          if (findUnit.showTypesMarkers) {
            if (findUnit.showTypesMarkers.find((mark) => mark === action.payload.data)) {
              findUnit.showTypesMarkers = findUnit.showTypesMarkers.filter((mark) => mark !== action.payload.data);
            } else {
              findUnit.showTypesMarkers = [...findUnit.showTypesMarkers, action.payload.data];
            }
          } else {
            findUnit.showTypesMarkers = [action.payload.data];
          }
        }
        return user;
      }));
    }
    case SET_TIME: {
      return state.set("users", state.get("users").map((user) => {
        const findUnit = user.units.units.find((unit) => unit.id === action.payload.id);
        if (findUnit){
          findUnit.timeTrack = action.payload.time;
        }
        return user;
      }));
    }
    default:
      return state;
  }
}