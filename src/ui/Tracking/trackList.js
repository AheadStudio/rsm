import React from "react";
import Track from "./track";
import {IconClose, IconOpen} from "./item";
import {connect} from "react-redux";
import {showGeoZone} from "../../reducers/actions/geoZone";

@connect(
  null,
  dispatch => ({
    showGeoZone: (id) => dispatch(showGeoZone(id)),
  }))
export default class TrackList extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleGeoZone = this.toggleGeoZone.bind(this);
  }
  toggleGeoZone() {
    this.setState({
      open: !this.state.open
    }, () => {
      this.props.showGeoZone(this.props.id);
    });
  }
  render() {
    return (
      <div className="tracking-geoZone__item">
        <div
          className="tracking-geoZone__open"
          onClick={() => this.toggleGeoZone()}
        >
          <div className="tracking-geoZone__name">
            {this.props.name}
          </div>
          <div className="tracking-geoZone__icon">
            {this.state.open ? <IconOpen/> : <IconClose/>}
          </div>
        </div>
        {this.state.open ? (
          <div className="tracking-geoZone__list">
            {this.props.INOUT.map((track, index) =>
              <Track
                idTrack={this.props.id}
                idMachine={this.props.idMachine}
                detailTrack={this.props.detailTrack}
                key={index}
                {...track}
              />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}