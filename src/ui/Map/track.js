import React from "react";
import moment from "moment";
import _ from "lodash";
import {Marker, Polyline, Popup} from "react-leaflet";
import {iconBlack, iconBlue, iconFinish, iconGreen, iconRed, iconShadow, iconStart} from "./markersType";
import "leaflet-polylinedecorator";
import L from "leaflet";

const Info = (props) => (
  <div className="tracking-page__info">
    <p>{props.name}</p>
    {props.color.map((item, index) => <span key={index}
                                            className={`tracking-page__color cl${item[0]}`}>{item[1]}</span>)}
  </div>
);

const Track = ({users, map, pointClick}) => (
  <div>
    {users.map((user, index) => (
      <div key={index}>
        {user.units.units.map((unit, index) => {
          if (unit.detailTrack && unit.detailTrack.length) {
            return (
              <div>
                {unit.detailTrack.map((track, index) =>
                  <TrackItem
                    map={map}
                    key={index}
                    track={track}
                    pointClick={pointClick}
                  />
                )}
              </div>
            );
          } else if (unit.track && unit.track.activeTrack && unit.track.activeTrack[unit.track.type] && unit.track.activeTrack[unit.track.type].length) {
            return <TrackItem
              map={map}
              key={index}
              track={unit.track.activeTrack[unit.track.type]}
              activeTime={unit.data.ACTIVE.valueF}
              static={unit.track.static}
              status={unit.data.STATUS.value}
              type={unit.track.type}
              pointClick={pointClick}
              activeMarker={[unit.data.LATITUDE.value, unit.data.LONGITUDE.value]}
            />;
          } else return null;
        })}
      </div>
    ))}
  </div>
);

export class TrackItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
      track: null,
      finishPoint: null,
    };
    this.getMarkers = this.getMarkers.bind(this);
    this.groupPolyline = this.groupPolyline.bind(this);
  }

  componentWillMount() {
    this.getMarkers(this.props.track, this.props.activeMarker);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track) {
      this.getMarkers(nextProps.track, nextProps.activeMarker);
    }
  }

  getMarkers(track, activeMarker) {
    const start = [track[0].path[0].lat, track[0].path[0].lng];
    let finish = [track[track.length - 1].path[track[track.length - 1].path.length - 1].lat, track[track.length - 1].path[track[track.length - 1].path.length - 1].lng];
    let finishPoint = track[track.length - 1].path[track[track.length - 1].path.length - 1];
    if (activeMarker.lat) {
      finish = [activeMarker.lat, activeMarker.lng];
      track[track.length - 1].path.push(activeMarker);
    }
    if (this.props.static) {
      finishPoint.status = this.props.status;
      finishPoint.t = this.props.activeTime;
      if (!this.props.status) {
        finishPoint.LOAD = 0;
      }
    }
    this.setState({start, finish, finishPoint, track}, () => this.groupPolyline());
  }
  
  groupPolyline(){
    const arrayPoliline = [];
    let prevStatus = null;
    this.state.track.map((itemMain) => {
      itemMain.path.map((item) => {
        if (item.status !== prevStatus) {
          arrayPoliline.push([item]);
        } else {
          arrayPoliline[arrayPoliline.length - 1].push(item);
        }
        prevStatus = item.status;
      });
    });
    // console.log(arrayPoliline, this.state.track);
    // this.setState({
    //   track: arrayPoliline,
    // });
  }
  
  render() {
    return (
      <div>
        <Marker
          position={this.state.start}
          key={'track-start-icon'}
          icon={iconStart}
        />
        {!this.props.static ?
          <Marker
            key={'track-finish-icon'}
            position={this.state.finish}
            icon={iconFinish}
          />
          : <Marker
            key={'track-finish-icon'}
            position={this.state.finish}
            icon={
                this.state.finishPoint.status === 1 ? iconBlue :
                  this.state.finishPoint.status === 2 ? iconBlack :
                    this.state.finishPoint.status === 3 ? iconRed :
                      this.state.finishPoint.status === 4 ? iconGreen :
                        iconShadow
            }
          >
            <Popup>
              <div className="marker-popup">
                <p className="marker-popup__type">Скорость: {this.state.finishPoint.SPEED}</p>
                <p className="marker-popup__name">Нагрузка ДВС: {this.state.finishPoint.LOAD}</p>
                <p
                  className="marker-popup__name">Время: {moment(this.state.finishPoint.t, "YYMMDDHHmmss000").format("DD.MM.YY HH:mm:ss")}</p>
                <p className="marker-popup__name">Статус: {this.state.finishPoint.status === 0 ? "Нет связи" :
                  this.state.finishPoint.status === 1 ? "Дорожный режим" :
                    this.state.finishPoint.status === 2 ? "Выключен" :
                      this.state.finishPoint.status === 3 ? "Простой с вкл. двигателем" :
                        this.state.finishPoint.status === 4 ? "Комбайнирование" :
                          this.state.finishPoint.status === 5 ? "Простой с признаком уборки" : ""
                }</p>
              </div>
            </Popup>
          </Marker>}
        {this.state.track.map((item, index) =>
          <PolylineWrap
            map={this.props.map}
            key={index}
            path={item.path}
            color={item.color}
            type={this.props.type}
            pointClick={this.props.pointClick}
          />
        )}
        {this.props.type === "TRACK_HARVEST" ? (
          <Info
            name={'Режимы'}
            color={[[2, "Движение"], [3, "Комбайнирование"]]}
          />
        ) : this.props.type === "TRACK_SPEED" ? (
          <Info
            name={'Скорость, км/час'}
            color={[[1, 0], [2, 3], [3, 6], [5, 9], [6, 12]]}
          />
        ) : this.props.type === "TRACK_LOAD" ? (
          <Info
            name={'Нагрузка двигателя'}
            color={[[2, 25], [3, 50], [4, 75], [6, 100]]}
          />
        ) : null}
      </div>
    );
  }
}

class PolylineWrap extends React.Component {
  constructor() {
    super();
    this.state = {
      point: null
    };
    this.getPoint = this.getPoint.bind(this);
  }

  getPoint(e) {
    this.setState({
      point: null,
    }, () => {
      this.setState({
        point: _.minBy(this.props.path, (point) => L.latLng({lat: point.lat, lng: point.lng}).distanceTo(e.latlng))
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.point ? (
          <Popup position={[this.state.point.lat, this.state.point.lng]}>
            <div className="marker-popup">
              <p className="marker-popup__type">Скорость: {this.state.point.SPEED}</p>
              <p className="marker-popup__name">Нагрузка ДВС: {this.state.point.LOAD}</p>
              <p
                className="marker-popup__name">Время: {moment(this.state.point.t, "YYMMDDHHmmss000").format("DD.MM.YY HH:mm:ss")}</p>
              <p className="marker-popup__name">Статус: {this.state.point.status === 0 ? "Нет связи" :
                this.state.point.status === 1 ? "Дорожный режим" :
                  this.state.point.status === 2 ? "Выключен" :
                    this.state.point.status === 3 ? "Простой с вкл. двигателем" :
                      this.state.point.status === 4 ? "Комбайнирование" :
                        this.state.point.status === 5 ? "Простой с признаком уборки" : ""
              }</p>
            </div>
          </Popup>
        ) : null}
        <Polyline
          ref={(polyline) => this[`polyline${this.props.index}`] = polyline}
          onClick={(e) => this.getPoint(e)}
          key={this.props.index}
          positions={this.props.path}
          color={this.props.color}
        />
      </div>
    );
  }
}

export default Track;