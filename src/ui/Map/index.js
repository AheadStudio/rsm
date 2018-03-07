import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import L from "leaflet";
import LGeo from "leaflet-geodesy";
import Control from "react-leaflet-control";
import StyleMap from "./styleMap";
import DataPolygon from "./dataPolygon";
import DataCircle from "./dataCircle";
import DataLine from "./dataLine";
import AddGeoZone from "./addGeoZone";
import Track from "./track";
import {connect} from "react-redux";
import {Circle, GeoJSON, Map, Marker, Polygon, Polyline, Popup, TileLayer} from "react-leaflet";
import {toggleFullMap} from "../../reducers/actions/map";
import {iconMarker, iconMarkerDelete, iconMarkerError, marker1, marker2, marker3, marker4} from "./markersType";
import {ItemMarkerPopup, Markers} from "./markers";
import {addGeoZone, updateGeoZone} from "../../queries/socket";
import {changeNewGeoZone, deleteNewGeoZone} from "../../reducers/actions/geoZone";
import "react-leaflet-markercluster/dist/styles.min.css";

const accessToken = "pk.eyJ1IjoiYXJnb25hdnQiLCJhIjoiY2piMmF2OG50OHowZzJ4cjF2ZGFjcW94eCJ9.OTlx9S0_tG9kuFqYjT3HMA";

@connect(state => ({
  map: state.map,
  users: state.users.get("users"),
  geoZone: state.geoZone,
}), dispatch => ({
  toggleFullMap: () => dispatch(toggleFullMap()),
  changeNewGeoZone: (data) => dispatch(changeNewGeoZone(data)),
  deleteNewGeoZone: () => dispatch(deleteNewGeoZone()),
}))
export default class MapComponent extends React.Component {
  render() {
    let markers = [];
    this.props.users.map((user) => {
      const fintUnits = user.units.units.filter((unit) => unit.watch);
      return markers = [...markers, ...fintUnits];
    });
    return (
      <div id="map" className="map-wrap">
        <SimpleExample
          changeGeoZone={this.props.changeNewGeoZone}
          toggleFullMap={this.props.toggleFullMap}
          deleteNewGeoZone={this.props.deleteNewGeoZone}
          users={this.props.users}
          mapData={this.props.map}
          markers={markers}
          geoZone={this.props.geoZone}
          setNewGeoZone={this.props.setNewGeoZone}
        />
      </div>
    );
  }
}

class SimpleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [47.2, 39.7],
      viewport: {lat: 47.2, lng: 39.7},
      idElement: 0,
      zoom: 10,
      type: "osm",
      openControlTypeMap: false,
      openControlTypeElement: false,
      lastPoint: null,
      areaPolygon: null,
      areaCircle: null,
      widthLine: null,
      newGeoZone: [],
      markers: [],
      delete: false,
      edit: false,
      dragable: false,
      openControlGeoZone: null,
      tracks: [],
      nameNewGeoZone: "",
      pointClick: null,
    };
    this.newRadiusCircle = this.newRadiusCircle.bind(this);
    this.newCenterCircle = this.newCenterCircle.bind(this);
    this.newPositionLine = this.newPositionLine.bind(this);
    this.clearValidationError = this.clearValidationError.bind(this);
    this.viewValidationError = this.viewValidationError.bind(this);
    this.catchValidateElement = this.catchValidateElement.bind(this);
    this.onCenter = this.onCenter.bind(this);
    this.switchType = this.switchType.bind(this);
    this.togglePopupType = this.togglePopupType.bind(this);
    this.clickMap = this.clickMap.bind(this);
    this.newPosition = this.newPosition.bind(this);
    this.toggleFullMap = this.toggleFullMap.bind(this);
    this.newElement = this.newElement.bind(this);
    this.newCoordinateCircle = this.newCoordinateCircle.bind(this);
    this.deleteMode = this.deleteMode.bind(this);
    this.deleteCoordinate = this.deleteCoordinate.bind(this);
    this.saveElement = this.saveElement.bind(this);
    this.togglePopupGeoZone = this.togglePopupGeoZone.bind(this);
  }

  deleteMode() {
    this.setState({
      delete: !this.state.delete,
    }, () => this.props.deleteNewGeoZone());
  }

  onCenter() {
    this.setState({viewport: [47.2, 39.7]});
  }

  switchType(type) {
    this.setState({type});
  }

  togglePopupType() {
    this.setState({
      openControlTypeMap: !this.state.openControlTypeMap,
      openControlGeoZone: false,
    });
  }

  toggleFullMap() {
    this.props.toggleFullMap();
    setTimeout(() => {
      this.refs.map.leafletElement.invalidateSize();
    }, 200);
  }

  openControllType() {
    this.setState({openControlTypeElement: !this.state.openControlTypeElement});
  }

  pushElement(element, type) {
    this.setState({
      newGeoZone: [element],
      idElement: this.state.idElement + 1,
      openControlGeoZone: type,
      openControlTypeElement: false,
    });
  }

  newElement(type) {
    switch (type) {
      case "Polygon": {
        return this.pushElement({
          id: this.state.idElement + 1,
          type: type,
          points: [],
        }, type);
      }
      case "circle": {
        return this.pushElement({
          id: this.state.idElement + 1,
          type: type,
          center: null,
          radius: null,
          radiusPoint: null,
        }, type);
      }
      case "line": {
        return this.pushElement({
          id: this.state.idElement + 1,
          type: type,
          points: [],
        }, type);
      }
      default: {
        return false;
      }
    }
  }

  catchValidateElement() {
    const errorElements = [];
    this.state.newGeoZone.map((item) => {
      if (item.type === "Polygon") {
        if (item.points.length <= 2) {
          errorElements.push(item);
        }
      }
    });
    return errorElements;
  }

  clearValidationError() {
    this.setState((prevState) => {
      prevState.openControlGeoZone = null;
      prevState.openControlTypeElement = true;
      prevState.newGeoZone.map((element) => element.validate = true);
    });
  }

  viewValidationError(errorElements) {
    const deleteElement = errorElements.find((item) => !item.points.length);
    const oldElement = errorElements.find((item) => item.points.length);
    errorElements.map((item) => {
      if (deleteElement && oldElement) {
        this.setState((prevState) => {
          if (prevState.newGeoZone.find((it) => it.id === item.id).points.length) {
            prevState.newGeoZone.find((it) => it.id === item.id).validate = false;
          } else {
            prevState.newGeoZone.splice(prevState.newGeoZone.findIndex((it) => it.id === item.id), 1);
          }
          return prevState;
        });
      } else if (deleteElement && !oldElement) {
        this.setState((prevState) => {
          prevState.newGeoZone.splice(prevState.newGeoZone.findIndex((it) => it.id === item.id), 1);
          return prevState;
        }, () => {
          this.clearValidationError();
        });
      } else if (!deleteElement && oldElement) {
        this.setState((prevState) => {
          prevState.newGeoZone.find((it) => it.id === item.id).validate = false;
          return prevState;
        });
      }
    });
  }

  saveElement() {
    switch (this.state.openControlGeoZone) {
      case "Polygon": {
        const validate = this.catchValidateElement();
        if (!validate.length) {
          let points = [];
          this.state.newGeoZone[0].points.map((point) => {
            return points = [...points, [point[1], point[0]]];
          });
          points = [...points, [this.state.newGeoZone[0].points[0][1], this.state.newGeoZone[0].points[0][0]]];
          const geoZone = {
            zone: {
              coordinates: [points],
              type: "Polygon",
            },
            name: this.state.nameNewGeoZone,
          };
          if (this.state.typeSave) {
            updateGeoZone({
              idObj: this.state.idZone,
              name: this.state.nameNewGeoZone,
              location: {
                coordinates: [points],
                type: "Polygon",
              },
            });
          } else {
            addGeoZone(geoZone);
          }
          return this.clearValidationError();
        }
        return this.viewValidationError(validate);
      }
      case "line": {
        const data = {
          name: this.state.nameNewGeoZone,
          zone: this.line.leafletElement.toGeoJSON().geometry
        };
        addGeoZone(data);
      }
      default: {
        break;
      }
    }
  }

  newCoordinateGeoZone(point) {
    this.setState((prevState) => {
      prevState.newGeoZone[0].points = [point, ...prevState.newGeoZone[0].points];
      prevState.lastPoint = point;
      return prevState;
    }, () => {
      this.props.changeGeoZone({name: this.state.nameNewGeoZone, zone: this.state.newGeoZone[0]});
      if (this.state.newGeoZone[0].points.length > 2) {
        this.setState({
          areaPolygon: LGeo.area(this.polygon.leafletElement) / 10000,
        });
      }
    });
  }

  newCoordinateCircle(point) {
    this.setState((prevState) => {
      if (!prevState.newGeoZone[0].center || !prevState.newGeoZone[0].radius) {
        if (prevState.newGeoZone[0].center) {
          prevState.newGeoZone[0].radius = L.latLng(prevState.newGeoZone[0].center).distanceTo(point);
          prevState.newGeoZone[0].radiusPoint = point;
        } else {
          prevState.newGeoZone[0].center = point;
        }
      }
      return prevState;
    }, () => {
      if (this.state.newGeoZone[0].center && this.state.newGeoZone[0].radius) {
        this.setState({
          areaCircle: (2 * this.state.newGeoZone[0].radius * 3.14 / 10000).toFixed(3)
        });
      }
    });
  }

  deleteCoordinate(point) {
    this.setState((prevState) => {
      prevState.newGeoZone[0].points = prevState.newGeoZone[0].points.filter((item) => item[0] !== point.latlng.lat && item[0] !== point.latlng.lng);
      if (prevState.newGeoZone[0].points > 2) {
        prevState.areaPolygon = LGeo.area(this.polygon.leafletElement) / 10000;
      } else {
        prevState.areaPolygon = 0;
      }
      return prevState;
    });
  }

  componentDidMount() {
    let findUnit;
    this.props.users.map((user) => {
      findUnit = user.units.units.find((unit) => {
        if (unit.track && unit.track.activeTrack && unit.track.activeTrack[unit.track.type] && unit.track.activeTrack[unit.track.type].length) {
          return true;
        }
      });
    });
    if (findUnit) {
      let arrayPolyline = [];
      findUnit.track.activeTrack[findUnit.track.type].map((item) => {
        item.path.map((it) => {
          const point = [it.lat, it.lng];
          arrayPolyline = [...arrayPolyline, point];
        });
      });
      this.refs.map.leafletElement.flyToBounds(L.latLngBounds(arrayPolyline));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapData.toJS().center !== this.props.mapData.toJS().center) {
      this.setState({viewport: nextProps.mapData.toJS().center, position: nextProps.mapData.toJS().center});
    }
    if (nextProps.mapData.toJS().centerPolygon !== this.props.mapData.toJS().centerPolygon) {
      setTimeout(() => {
        if (nextProps.mapData.toJS().centerPolygon) {
          this.refs.map.leafletElement.flyToBounds(this[`geo${nextProps.mapData.toJS().centerPolygon}`].leafletElement.getBounds());
        }
      }, 0);
    }
    if (nextProps.mapData.toJS().centerTrack !== this.props.mapData.toJS().centerTrack) {
      let arrayPolyline = [];
      if (nextProps.mapData.toJS().centerTrack && nextProps.mapData.toJS().centerTrack.length) {
        nextProps.mapData.toJS().centerTrack.map((item) => {
          item.path.map((it) => {
            const point = [it.lat, it.lng];
            arrayPolyline = [...arrayPolyline, point];
          });
        });
        this.refs.map.leafletElement.flyToBounds(L.latLngBounds(arrayPolyline));
      }
    }
    if (nextProps.geoZone.get("static") !== this.props.geoZone.get("static")) {
      this.props.deleteNewGeoZone();
      this.setState({
        newGeoZone: [],
        openControlGeoZone: null,
      });
    }
    if (nextProps.setNewGeoZone !== this.props.setNewGeoZone) {
      const nn = [];
      nextProps.setNewGeoZone.data.map((point) => {
        nn.push([point[1], point[0]]);
      });
      this.refs.map.leafletElement.flyToBounds(L.latLngBounds(nn));
      this.setState({
        newGeoZone: [{
          points: nn,
          id: 1,
          type: "Polygon"
        }],
        openControlGeoZone: "Polygon",
        nameNewGeoZone: nextProps.setNewGeoZone.name,
        typeSave: nextProps.setNewGeoZone.typeSave,
        idZone: nextProps.setNewGeoZone.idZone,
      });
    }
  }

  newCenterCircle(e) {
    this.setState((prevState) => {
      const pointDrag = [e.latlng.lat, e.latlng.lng];
      prevState.newGeoZone[0].radiusPoint = [
        prevState.newGeoZone[0].radiusPoint[0] - (prevState.newGeoZone[0].center[0] - pointDrag[0]),
        prevState.newGeoZone[0].radiusPoint[1] - (prevState.newGeoZone[0].center[1] - pointDrag[1])
      ];
      prevState.newGeoZone[0].center = pointDrag;
      return prevState;
    });
  }

  newRadiusCircle(e) {
    this.setState((prevState) => {
      const pointDrag = [e.latlng.lat, e.latlng.lng];
      prevState.newGeoZone[0].radius = L.latLng(prevState.newGeoZone[0].center).distanceTo(pointDrag);
      prevState.newGeoZone[0].radiusPoint = pointDrag;
      return prevState;
    }, () => {
      this.setState({
        areaCircle: (2 * this.state.newGeoZone[0].radius * 3.14 / 10000).toFixed(3)
      });
    });
  }

  newCoordinationLine(point) {
    this.setState((prevState) => {
      prevState.newGeoZone[0].points = [point, ...prevState.newGeoZone[0].points];
      return prevState;
    });
  }

  clickMap(e) {
    this.setState({
      pointClick: e.latlng
    });
    if (this.state.openControlGeoZone && !this.state.edit && !this.state.dragable && !this.state.delete) {
      switch (this.state.openControlGeoZone) {
        case "Polygon": {
          return this.newCoordinateGeoZone([e.latlng.lat, e.latlng.lng]);
        }
        case "circle": {
          return this.newCoordinateCircle([e.latlng.lat, e.latlng.lng]);
        }
        case "line": {
          return this.newCoordinationLine([e.latlng.lat, e.latlng.lng]);
        }
        default: {
          return false;
        }
      }
    }
  }

  newPosition(e, idx) {
    this.setState((prevState) => {
      prevState.newGeoZone[0].points[idx] = [e.latlng.lat, e.latlng.lng];
      prevState.lastPoint = [e.latlng.lat, e.latlng.lng];
      prevState.dragable = true;
      prevState.areaPolygon = LGeo.area(this.polygon.leafletElement) / 10000;
      this.polygon.leafletElement.setLatLngs(prevState.newGeoZone[0].points);
      return prevState;
    }, () => {
      setTimeout(() => {
        this.setState({dragable: false});
      }, 400);
    });
  }

  togglePopupGeoZone() {
    this.setState({
      newGeoZone: [],
      openControlTypeElement: false,
      openControlGeoZone: null,
      delete: false,
      areaPolygon: null,
      lastPoint: null,
    });
    this.props.deleteNewGeoZone();
  }

  newPositionLine(e, index) {
    this.setState((prevState) => {
      prevState.newGeoZone[0].points[index] = [e.latlng.lat, e.latlng.lng];
      this.line.leafletElement.setLatLngs(prevState.newGeoZone[0].points);
      return prevState;
    }, () => {
      setTimeout(() => {
        this.setState({dragable: false});
      }, 400);
    });
  }

  render() {
    return (
      <Map
        ref="map"
        zoomAnimation={false}
        // onClick={(e) => this.clickMap(e)}
        center={this.state.position}
        zoom={this.state.zoom}
        viewport={this.state.viewport}
        minZoom={2}
      >
        <TileLayer
          zoomAnimated={false}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={this.state.type === "map" ? "http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png" :
            this.state.type === "osm" ? "http://{s}.tile.osm.org/{z}/{x}/{y}.png" :
              this.state.type === "sputnic" ? `https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=${accessToken}` :
                "http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png"
          }
        />
        <Control position="topleft">
          <div className="map__center">
            <button
              onClick={() => this.onCenter()}
            />
          </div>
        </Control>
        <Control
          position="topleft">
          <div
            tabIndex="0"
            role="button"
            className="map__full"
            onClick={() => this.toggleFullMap()}
          />
        </Control>
        <Control position="topright">
          <div className="map__topright">
            <div className="map__topright-controll">
              <div className="geoZone-controll">
                <button
                  className="geoZone-controll__button"
                  onClick={() => this.openControllType()}
                />
                <ReactCSSTransitionGroup
                  transitionName="example"
                  transitionEnterTimeout={300}
                  transitionLeaveTimeout={100}
                >
                  {this.state.openControlTypeElement && (
                    <AddGeoZone
                      togglePopupGeoZone={this.togglePopupGeoZone}
                      newElement={this.newElement}
                    />
                  )}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                  transitionName="example"
                  transitionEnterTimeout={300}
                  transitionLeaveTimeout={100}
                >
                  {this.state.openControlGeoZone ? (
                    <div className="geoZone-controll__controll">
                      <div className="geoZone-controll__title">
                        <p>Новая площадь</p>
                        <div
                          tabIndex="0"
                          role="button"
                          className="geoZone-controll__close"
                          onClick={() => this.togglePopupGeoZone(false)}
                        />
                      </div>
                      <input
                        className="geoZone-controll__input"
                        type="text"
                        placeholder="Название геозоны"
                        onChange={(e) => {
                          this.setState({nameNewGeoZone: e.target.value}, () => {
                            this.props.changeGeoZone({name: this.state.nameNewGeoZone, zone: this.state.newGeoZone[0]});
                          });
                        }}
                        value={this.state.nameNewGeoZone}
                      />
                      {this.state.openControlGeoZone === "Polygon" ? (
                        <DataPolygon
                          lastPoint={this.state.lastPoint}
                          areaPolygon={this.state.areaPolygon}
                          newGeoZone={this.state.newGeoZone}
                          deleteState={this.state.delete}
                          nameNewGeoZone={this.state.nameNewGeoZone}
                          deleteMode={this.deleteMode}
                          saveElement={this.saveElement}
                        />
                      ) : this.state.openControlGeoZone === "circle" ? (
                        <DataCircle
                          newGeoZone={this.state.newGeoZone}
                          nameNewGeoZone={this.state.nameNewGeoZone}
                          areaCircle={this.state.areaCircle}
                          saveElement={this.saveElement}
                        />
                      ) : this.state.openControlGeoZone === "line" ? (
                        <DataLine
                          newGeoZone={this.state.newGeoZone}
                          nameNewGeoZone={this.state.nameNewGeoZone}
                          saveElement={this.saveElement}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </ReactCSSTransitionGroup>
              </div>
              {/*<div className="map-control-2">*/}
              {/*<button className="map-control-2__button" />*/}
              {/*</div>*/}
              <div className="map-type">
                <button
                  className="map-type__button"
                  onClick={() => this.togglePopupType()}
                />
                {this.state.openControlTypeMap && (
                  <StyleMap
                    type={this.state.type}
                    switchType={this.switchType}
                  />
                )}
              </div>
            </div>
          </div>
        </Control>
        <Markers markers={this.props.markers}/>
        {this.state.newGeoZone.map((element, index) => {
          switch (element.type) {
            case "Polygon": {
              return (
                <div key={index}>
                  {this.state.delete ?
                    element.points.map((point, index) => (
                      <Marker
                        key={`${element.id}${index}`}
                        onClick={(e) => this.deleteCoordinate(e, element.id)}
                        position={point}
                        icon={iconMarkerDelete}
                      />
                    ))
                    : element.points.map((point, idx) => (
                      <Marker
                        onDrag={(e) => this.newPosition(e, idx)}
                        draggable={true}
                        position={point}
                        icon={element.validate !== false ? iconMarker : iconMarkerError}
                      />
                    ))
                  }
                  <Polygon
                    key={element.id}
                    ref={(polygon) => this.polygon = polygon}
                    interactive={true}
                    positions={element.points}
                    color={element.validate !== false ? "red" : "#bcbcbc"}
                  />
                </div>
              );
            }
            case "circle": {
              return (
                <div key={index}>
                  {element.center && (
                    <Marker
                      onDrag={(e) => this.newCenterCircle(e, element.id)}
                      draggable={true}
                      position={element.center}
                      icon={iconMarker}
                    />
                  )}
                  {element.radiusPoint && (
                    <Marker
                      onDrag={(e) => this.newRadiusCircle(e, element.id)}
                      draggable={true}
                      position={element.radiusPoint}
                      icon={iconMarker}
                    />
                  )}
                  {element.center && element.radius && (
                    <Circle
                      ref={(circle) => this.circle = circle}
                      center={element.center}
                      radius={element.radius}
                      color="red"
                    />
                  )}
                </div>
              );
            }
            case "line": {
              return (
                <div key={index}>
                  {element.points.map((point, index) => (
                    <Marker
                      onDrag={(e) => this.newPositionLine(e, index)}
                      draggable={true}
                      position={point}
                      icon={iconMarker}
                    />
                  ))}
                  <Polyline
                    ref={(line) => this.line = line}
                    key={element.id}
                    positions={element.points}
                    color="red"
                  />
                </div>
              );
            }
            default:
              return null;
          }
        })}
        <div>
          {this.props.geoZone.get("static").map((item) => {
            if (item.watch || item.show) {
              return <GeoJSON
                ref={(geo) => this[`geo${item.id}`] = geo}
                data={item.location}
              />;
            } else {
              return null;
            }
          })}
        </div>
        <Track
          pointClick={this.state.pointClick}
          map={this.refs.map}
          users={this.props.users}
        />
        {this.props.users.map((user) => {
          return user.units.units.map((unit) => {
            if (unit.showTypesMarkers) {
              return unit.showTypesMarkers.map((type) => {
                if (unit.markers && unit.markers[type]) {
                  return unit.markers[type].map((mark) => {
                    let icon;
                    if (type === "UPLOAD") {
                      icon = marker3;
                    } else if (type === "BUNKER_FULL") {
                      icon = marker2;
                    } else if (type === "MESSAGES_MAIN" || type === "MESSAGES_CRIT") {
                      icon = marker4;
                    } else {
                      icon = marker1;
                    }
                    return (
                      <Marker
                        position={[mark.lat, mark.lng]}
                        icon={icon}
                      >
                        <Popup>
                          {type === "MESSAGES_CRIT" || type === "MESSAGES_MAIN" ?
                            <ItemMarkerPopup
                              name={mark.nameMsg}
                              set={mark.set}
                              duration={mark.duration}
                              time={mark.time}
                            /> : <ItemMarkerPopup
                              name={mark.name}
                              duration={mark.duration}
                              time={mark.time}
                            />
                          }
                        </Popup>
                      </Marker>
                    );
                  });
                }
              });
            }
          });
        })}
      </Map>
    );
  }
}