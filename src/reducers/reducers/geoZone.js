import {List, Map} from "immutable";
import {LOAD} from "redux-storage";
import {
  CHANGE_NEW_GEOZONE,
  DELETE_GEOZONE,
  DELETE_NEW_GEOZONE,
  NEW_GEOZONE,
  PUSH_GEOZONE,
  WATCH_GEOZONE,
  SHOW_GEOZONE,
  HIDE_ALL_GEOZONE,
  UPDATE_GEOZONE,
} from "../constants";

const initialState = Map({
  static: List([]),
  newGeoZone: null,
});

export default function geoZone(state = initialState, action) {
  switch (action.type) {
    case PUSH_GEOZONE: {
      const newStateGeoZone = state.get("static").toJS();
      if (newStateGeoZone.length) {
        newStateGeoZone.map((geoZone) => {
          action.payload.map((aGeoZone) => {
            if (geoZone.watch) {
              aGeoZone.watch = geoZone.watch;
            }
            if (geoZone.show) {
              geoZone.show = false;
              aGeoZone.show = false;
            }
          });
        });
        return state.set("static", List(newStateGeoZone));
      }
      return state.set("static", List(action.payload));
    }
    case LOAD: {
      if (action.payload.geoZone) {
        return state.set("static", List(action.payload.geoZone.static));
      }
      return state;
    }
    case WATCH_GEOZONE: {
      const newState = state.get("static").toJS();
      const findGeoZone = newState.find((geoZone) => geoZone.id === action.payload);
      if (findGeoZone.watch === undefined) {
        findGeoZone.watch = true;
      } else {
        findGeoZone.watch = !findGeoZone.watch;
      }
      return state.set("static", List(newState));
    }
    case NEW_GEOZONE: {
      return state.set("static", List([action.payload, ...state.get("static").toJS()]));
    }
    case CHANGE_NEW_GEOZONE: {
      return state.set("newGeoZone", action.payload);
    }
    case DELETE_NEW_GEOZONE: {
      return state.set("newGeoZone", null);
    }
    case DELETE_GEOZONE: {
      const deleteGeoZone = state.get("static").toJS();
      const newDeleteGeoZone = deleteGeoZone.filter((geoZone) => geoZone.id !== action.payload);
      return state.set("static", List(newDeleteGeoZone));
    }
    case SHOW_GEOZONE: {
      const showGeoZone = state.get("static").toJS();
      const findsShowGeoZone = showGeoZone.find((geoZone) => geoZone.id === action.payload);
      if (findsShowGeoZone) {
        findsShowGeoZone.show = !findsShowGeoZone.show;
      } else {
        if (findsShowGeoZone.show) {
          findsShowGeoZone.show = !findsShowGeoZone.show;
        } else {
          findsShowGeoZone.show = true;
        }
      }
      return state.set("static", List(showGeoZone));
    }
    case HIDE_ALL_GEOZONE:
      const hideAllGeoZone = state.get("static").toJS();
      hideAllGeoZone.map((geoZone) => {
        geoZone.show = false;
      });
      return state.set("static", List(hideAllGeoZone));
    case UPDATE_GEOZONE:
      const updateGeoZone = state.get("static").toJS();
      const findGeoZone = updateGeoZone.find((geoZone) => geoZone.id === action.payload.idObj);
      if (findGeoZone) {
        findGeoZone.location = action.payload.location;
        findGeoZone.name = action.payload.name;
      }
      return state.set("static", List(updateGeoZone));
    default: {
      return state;
    }
  }
};