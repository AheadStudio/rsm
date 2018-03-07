import { combineReducers } from "redux";
import sidebar from "./reducers/sidebar";
import users from "./reducers/users";
import notification from "./reducers/notification";
import user from "./reducers/user";
import geoZone from "./reducers/geoZone";
import storageAwareReducer from "./reducers/storage";
import reports from "./reducers/reports";
import map from "./reducers/map";
import Intl from "./reducers/translate";

export default combineReducers({
  Intl,
  user,
  map,
  sidebar,
  users,
  notification,
  geoZone,
  reports,
  storageAwareReducer,
});