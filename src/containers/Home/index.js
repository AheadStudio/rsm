import React from "react";
import AllMachinesMap from "../../ui/Map/allMachines";
import Activity from "../../ui/Activity";
import Analytics from "../../ui/Analytics";
import {connect} from "react-redux";
import {withTranslate} from 'react-redux-multilingual';
import ImmutablePropTypes from "react-immutable-proptypes";
import Tracking from "../Tracking";

@connect(state => ({
    users: state.users,
  })
)
@withTranslate
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div className="content__title">
          <h1>{this.props.translate("desctope")}</h1>
        </div>
        <div className="widget__map">
          <AllMachinesMap/>
        </div>
        <Activity data={this.props.users.get("users")}/>
        <Analytics/>
      </div>
    );
  }
}

Tracking.PropTypes = {
  users: ImmutablePropTypes.map,
};
