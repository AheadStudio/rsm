import React from "react";
import PropTypes from "prop-types"; // eslint-disable-line no-unused-vars
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { Link } from "react-router";
import { link } from "../../router";
import MapComponent from "../../ui/Map";

@connect (state => ({
  users: state.users,
  geoZone: state.geoZone,
  map: state.map,
}))
@withTranslate
export default class Tracking extends React.Component {
  constructor() {
    super();
    this.state = {
      newGeoZone: []
    };
    this.setGeoZone = this.setGeoZone.bind(this);
  }
  setGeoZone(zone) {
    this.setState({
      newGeoZone: zone
    });
  }
  render() {
    let number = 0;
    const { children } = this.props;
    this.props.users.get("users").map((user) => number = number + user.units.units.length);
    const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, { users: this.props.users, geoZone: this.props.geoZone, setGeoZone: this.setGeoZone }));
    return (
      <div className={this.props.map.get("full") ? "tracking-page full" : "tracking-page"}>
        <div className="tracking-page__list">
          <div className="tracking-page__title">
            <h1>{this.props.translate("map")}</h1><p>{number} машины</p>
          </div>
          <div className="tracking-page__nav">
            <Link to={link.tracking} className={this.props.location.pathname === link.tracking || this.props.location.pathname === link.households ? "active" : null}>Хозяйства</Link>
            <Link to={link.geoZone} className={this.props.location.pathname === link.geoZone ? "active" : null}>Геозоны</Link>
          </div>
          {childrenWithProps}
        </div>
        <div className="tracking-page__map">
          <MapComponent
            setNewGeoZone={this.state.newGeoZone}
          />
        </div>
      </div>
    );
  }
}
Tracking.PropTypes = {
  users: ImmutablePropTypes.map,
};