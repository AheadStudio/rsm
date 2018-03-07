import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import InformationPanel from "./informationPanel";
import ControlTrack from "./controlTrack";
import ControlMarker from "./controlMarker";
import ControlStop from "./controlStop";
import ControlNotification from "./controlNotification";
import ControlTime from "./controlTime";
import TrackList from "./trackList";
import {connect} from "react-redux";
import {Tooltip} from "antd";
import {
  deleteAllDetailTrack,
  deleteTrack,
  pushTrack,
  setTypeTrack,
  showMarkers,
  showTrack,
  toggleWatch,
} from "../../reducers/actions/users";
import {centerMap, centerTrack} from "../../reducers/actions/map";
import {hideAllGeoZone} from "../../reducers/actions/geoZone";


@connect(
  null,
  dispatch => ({
    toggleWatch: (id) => dispatch(toggleWatch(id)),
    centerMap: (data) => dispatch(centerMap(data)),
    centerTrack: (track) => dispatch(centerTrack(track)),
    showTrack: (track) => dispatch(showTrack(track)),
    setTypeTrack: (param) => dispatch(setTypeTrack(param)),
    deleteTrack: (id) => dispatch(deleteTrack(id)),
    pushTrack: (data) => dispatch(pushTrack(data)),
    hideAllGeoZone: () => dispatch(hideAllGeoZone()),
    deleteAllDetailTrack: (id) => dispatch(deleteAllDetailTrack(id)),
    showMarkers: (data) => dispatch(showMarkers(data)),
  }))
export default class ItemMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openSettings: false,
      openSettingsTrack: false,
      openSettingsZz: false,
      openSettingsNotification: false,
      timeZone: false,
      activeMarkers: {},
      trackType: "TRACK_HARVEST",
      openInfoGeoZone: false,
      openDate: false,
      time: ""
    };
    this.onWatch = this.onWatch.bind(this);
    this.toggleGetTrack = this.toggleGetTrack.bind(this);
    this.pushActiveMarker = this.pushActiveMarker.bind(this);
    this.setTrack = this.setTrack.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
    this.centerTrack = this.centerTrack.bind(this);
    this.toggleInfoFeoZone = this.toggleInfoFeoZone.bind(this);
  }

  componentWillMount() {
    if (this.props.track && this.props.track.activeTrack) {
      this.setState({
        open: true,
        openSettingsTrack: true
      });
    } else {
      this.setState({openSettingsTrack: false});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track) {
      if (nextProps.track.activeTrack && nextProps.track.activeTrack[nextProps.track.type] && nextProps.track.activeTrack[nextProps.track.type].length) {
        this.setState({
          openSettingsTrack: true,
        });
      } else {
        this.setState({
          openSettingsTrack: false,
        });
      }
    }
  }

  centerTrack() {
    if (this.props.track && this.props.track.activeTrack && this.props.track.activeTrack[this.props.track.type] && this.props.track.activeTrack[this.props.track.type].length) {
      this.props.centerTrack(null);
      setTimeout(() => {
        this.props.centerTrack(this.props.track.activeTrack[this.props.track.type]);
      });
    }
  }

  deleteTrack() {
    this.setState({
      openSettingsTrack: false,
      openInfoGeoZone: false,
      openSettingsZz: false,
      openSettingsNotification: false,
      activeMarkers: []
    });
    this.props.deleteTrack(this.props.id);
    this.props.centerTrack(null);
  }

  getTrack() {
    if (this.state.timeZone === "day") {
      this.props.showTrack(this.props.id);
      this.setState({trackType: "TRACK_HARVEST"});
      setTimeout(() => {
        this.centerTrack();
      });
      this.toggleSettings();
    }
  }

  toggleGetTrack() {
    this.setState({open: !this.state.open}, () => {
      this.centerTrack();
    });
  }

  toggleSettings() {
    this.setState({openSettings: !this.state.openSettings});
  }

  toggleSettingsZz() {
    this.setState({openSettingsZz: !this.state.openSettingsZz});
  }

  toggleSettingsNotification() {
    this.setState({openSettingsNotification: !this.state.openSettingsNotification});
  }

  pushActiveMarker(marker) {
    this.setState(prevState => {
      if (prevState.activeMarkers[marker]) {
        prevState.activeMarkers[marker] = !prevState.activeMarkers[marker];
      } else {
        prevState.activeMarkers[marker] = true;
      }
      return prevState;
    });
  }

  onWatch(item) {
    this.props.toggleWatch(item.id);
    setTimeout(() => {
      if (this.props.watch) {
        this.props.centerMap([item.data.LATITUDE.value, item.data.LONGITUDE.value]);
      }
    });
  }

  setTrack(type) {
    this.setState({
      trackType: type
    }, () => {
      this.props.setTypeTrack({id: this.props.id, type: type});
      this.centerTrack();
    });
  }

  toggleInfoFeoZone() {
    this.setState({openInfoGeoZone: !this.state.openInfoGeoZone}, () => {
      if (!this.state.openInfoGeoZone) {
        this.props.hideAllGeoZone();
        this.props.deleteAllDetailTrack(this.props.id);
      }
    });
  }

  render() {
    const {
      watch, data,
    } = this.props;
    return (
      <div className="tracking-machine">
        <div className="tracking-machine__data">
          <InformationPanel
            id={this.props.id}
            data={this.props.data}
            model={this.props.model}
            typeName={this.props.typeName}
            name={this.props.name}
          />
          <div
            tabIndex="0"
            role="button"
            className="tracking-machine__data-col col-watch"
          >
            <Tooltip placement="topRight" title="Построить трек">
              <div
                onClick={() => this.toggleGetTrack()}
                className="tracking-machine__open-track"
              />
            </Tooltip>
            {data.LATITUDE && data.LONGITUDE ?
              <Tooltip placement="topLeft" title="Отслеживать">
                <div
                  onClick={() => this.onWatch(this.props)}
                  className={`tracking-machine__data-watch ${watch ? "active" : ""}`}
                />
              </Tooltip>
              : null}
          </div>
        </div>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.state.open ? (
            <div>
              {!this.state.openSettingsTrack ? (
                <ControlTime
                  data={this.props.data}
                  clearType={() => this.setState({trackType: "TRACK_HARVEST"})}
                  id={this.props.id}
                  loadTrack={this.props.loadTrack}
                  centerTrack={this.centerTrack}
                />
              ) : null}
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.openSettingsTrack ? (
                  <div>
                    <div className="tracking-machine__time">
                      <p>{this.props.timeTrack}</p>
                    </div>
                    <div className="tracking-machine__button-control">
                      {this.props.track ? (
                        <ControlTrack
                          track={this.state.trackType}
                          setTrack={this.setTrack}
                          deleteTrack={this.deleteTrack}
                          load={this.props.track && this.props.track.activeTrack && this.props.track.activeTrack.TRACK_LOAD.length}
                        />
                      ) : null}
                    </div>
                    <ControlMarker
                      markers={this.props.markers}
                      pushActiveMarker={this.pushActiveMarker}
                      activeMarkers={this.state.activeMarkers}
                      showMarkers={this.props.showMarkers}
                      detailData={this.props.detailData}
                      centerTrack={this.centerTrack}
                      id={this.props.id}
                    />
                  </div>
                ) : null}
              </ReactCSSTransitionGroup>
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.activeMarkers.bt1 ? (
                  <ControlStop
                    showTypesMarkers={this.props.showTypesMarkers}
                    id={this.props.id}
                    showMarkers={this.props.showMarkers}
                  />
                ) : null}
              </ReactCSSTransitionGroup>
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.activeMarkers.bt4 ? (
                  <ControlNotification
                    activeMarkers={this.state.activeMarkers}
                    id={this.props.id}
                    showTypesMarkers={this.props.showTypesMarkers}
                    showMarkers={this.showMarkers}
                  />
                ) : null}
              </ReactCSSTransitionGroup>
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.openInfoGeoZone && this.props.detailData && this.props.detailData.DATA_GEO ? (
                  <div className="tracking-geoZone">
                    {this.props.detailData.DATA_GEO.map((geoZone) =>
                      <TrackList
                        key={geoZone.id}
                        detailTrack={this.props.detailTrack}
                        idMachine={this.props.id}
                        {...geoZone}
                      />
                    )}
                  </div>
                ) : null}
              </ReactCSSTransitionGroup>
            </div>
          ) : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

ItemMachine.PropTypes = {
  id: PropTypes.number,
  imei: PropTypes.number,
  mode: PropTypes.number,
  model: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.number,
  typeName: PropTypes.string,
};