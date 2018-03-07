import React from "react";
import moment from "moment/moment";
import {connect} from "react-redux";
import {pushDetailTrack} from "../../reducers/actions/users";

@connect(
  null,
  dispatch => ({
    pushDetailTrack: (data) => dispatch(pushDetailTrack(data)),
  }))
export default class Track extends React.Component {
  constructor() {
    super();
    this.toggleTrack = this.toggleTrack.bind(this);
  }

  toggleTrack(type) {
    this.props.pushDetailTrack({
      id: this.props.idMachine,
      track: this.props[type]
    });
  }

  render() {
    let findHarvest, findSpeed, findLoad;
    if (this.props.detailTrack) {
      findHarvest = this.props.detailTrack.find((item) => item === this.props.TRACK_HARVEST) !== undefined;
      findSpeed = this.props.detailTrack.find((item) => item === this.props.TRACK_SPEED) !== undefined;
      findLoad = this.props.detailTrack.find((item) => item === this.props.TRACK_LOAD) !== undefined;
    }
    return (
      <div className="tracking-geoZone__track">
        <div className="tracking-geoZone__param">
          <div
            className="tracking-geoZone__param-col">
            <span>Время въезда</span><span>{moment(this.props.in.time, "YYMMDDHHmmss000").format("DD.MM.YY HH:mm:ss")}</span>
          </div>
          <div
            className="tracking-geoZone__param-col">
            <span>Время выезда</span><span>{moment(this.props.out.time, "YYMMDDHHmmss000").format("DD.MM.YY HH:mm:ss")}</span>
          </div>
          <div className="tracking-geoZone__param-col">
            <span>{this.props.AREA_PER_TIME.brName}</span><span>{this.props.AREA_PER_TIME.valueF}</span></div>
          <div className="tracking-geoZone__param-col">
            <span>Убранная площадь</span><span>{this.props.INC_SUMM_AREA ? this.props.INC_SUMM_AREA.toFixed(1) : 0} Га</span>
          </div>
          <div className="tracking-geoZone__param-col">
            <span>{this.props.AVER_LOAD_COMBINE.brName}</span><span>{this.props.AVER_LOAD_COMBINE.valueF}</span></div>
          <div className="tracking-geoZone__param-col">
            <span>{this.props.AVER_SPEED_COMBINE.brName}</span><span>{this.props.AVER_SPEED_COMBINE.valueF}</span></div>
          <div className="tracking-geoZone__param-col">
            <span>{this.props.AVER_SPEED_MOVE.brName}</span><span>{this.props.AVER_SPEED_MOVE.valueF}</span></div>
          <div className="tracking-geoZone__param-col">
            <span>{this.props.INC_SUMM_FUEL.brName}</span><span>{this.props.INC_SUMM_FUEL.valueF}</span></div>
          <div className="tracking-geoZone__param-col">
            <span>{this.props.TIME_IN_ZONE.brName}</span><span>{this.props.TIME_IN_ZONE.valueF}</span></div>
        </div>
        <div className="tracking-geoZone__control">
          {this.props.TRACK_HARVEST.length ? (
            <button
              className={`tracking-geoZone__harvest bt7 ${findHarvest ? "active" : ""}`}
              onClick={() => this.toggleTrack("TRACK_HARVEST")}
            />
          ) : null}
          {this.props.TRACK_SPEED.length ? (
            <button
              className={`tracking-geoZone__speed t1 ${findSpeed ? "active" : ""}`}
              onClick={() => this.toggleTrack("TRACK_SPEED")}
            />
          ) : null}
          {this.props.TRACK_LOAD.length ? (
            <button
              className={`tracking-geoZone__load t2 ${findLoad ? "active" : ""}`}
              onClick={() => this.toggleTrack("TRACK_LOAD")}
            />
          ) : null}
        </div>
      </div>
    );
  }
}