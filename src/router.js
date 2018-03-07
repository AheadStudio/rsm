import React from "react";
import { IndexRoute, Route} from "react-router";
import AppWrap from "./ui/AppWrap";
import Autorization from "./containers/Autorization";
import Home from "./containers/Home";
import Machines from "./containers/Machines";
import MachineDetail from "./containers/MachineDetail";
import Notification from "./containers/Notification";
import Watch from "./containers/Watch";
import Time from "./containers/Watch/Time";
import Fueling from "./containers/Watch/Fueling";
import PerformanceIndicators from "./containers/Watch/PerformanceIndicators";
import MachineReports from "./containers/Watch/MachineReports";
import Cleaning from "./containers/Watch/Cleaning";
import Unloading from "./containers/Watch/Unloading";
import Export from "./containers/Watch/Export";
import Tracking from "./containers/Tracking";
import Login from "./containers/Login";
import Loginization from "./ui/Loginization";
import Registration from "./ui/Loginization/registration";
import ResetPassword from "./ui/Loginization/resetPassword";
import Households from "./containers/Tracking/households";
import GeoZone from "./containers/Tracking/geoZone";
import Settings from "./containers/Settings";

export const link = {
  autorizacion: `${process.env.PUBLIC_URL}/`,
  registration: `${process.env.PUBLIC_URL}/registration`,
  resetPassword: `${process.env.PUBLIC_URL}/reset-password`,
  home: `${process.env.PUBLIC_URL}/user`,
  machines: `${process.env.PUBLIC_URL}/user/machines`,
  tracking: `${process.env.PUBLIC_URL}/user/tracking`,
  households: `${process.env.PUBLIC_URL}/user/tracking/households`,
  geoZone: `${process.env.PUBLIC_URL}/user/tracking/geoZone`,
  watch: `${process.env.PUBLIC_URL}/user/watch`,
  watchTime: `${process.env.PUBLIC_URL}/user/watch/time`,
  watchFueling: `${process.env.PUBLIC_URL}/user/watch/fueling`,
  watchPerformanceIndicators: `${process.env.PUBLIC_URL}/user/watch/performanceIndicators`,
  watchMachineReports: `${process.env.PUBLIC_URL}/user/watch/machineReports`,
  watchCleaning: `${process.env.PUBLIC_URL}/user/watch/cleaning`,
  watchUnloading: `${process.env.PUBLIC_URL}/user/watch/unloading`,
  watchExport: `${process.env.PUBLIC_URL}/user/watch/export`,
  notifications: `${process.env.PUBLIC_URL}/user/notifications`,
  detail: `${process.env.PUBLIC_URL}/user/detail`,
  settings: `${process.env.PUBLIC_URL}/settings`,
};

export const RouterBlock = () => (
  <Route component={Autorization}>
    <Route
      key="login"
      path={link.autorizacion}
      component={Login}
    >
      <IndexRoute component={Loginization} />
      <Route path={link.registration} component={Registration} />
      <Route path={link.resetPassword} component={ResetPassword} />
    </Route>
    <Route
      key="home"
      path={link.home}
      component={AppWrap}
    >
      <IndexRoute component={Home} title={link.home.title} />
      <Route path={link.machines} component={Machines} />
      <Route path={link.detail} component={MachineDetail} />
      <Route path={link.notifications} component={Notification} />
      <Route path={link.watch} component={Watch}>
        <IndexRoute component={Time} />
        <Route path={link.watchTime} component={Time} />
        <Route path={link.watchFueling} component={Fueling} />
        <Route path={link.watchPerformanceIndicators} component={PerformanceIndicators} />
        <Route path={link.watchMachineReports} component={MachineReports} />
        <Route path={link.watchCleaning} component={Cleaning} />
        <Route path={link.watchUnloading} component={Unloading} />
        <Route path={link.watchExport} component={Export} />
      </Route>
      <Route path={link.tracking} component={Tracking}>
        <IndexRoute component={Households} />
        <Route path={link.households} component={Households} />
        <Route path={link.geoZone} component={GeoZone} />
      </Route>
      <Route path={link.settings} component={Settings} />
    </Route>
  </Route>
);