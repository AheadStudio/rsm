import React from "react";
import StyleMap from "./styleMap";
import Control from "react-leaflet-control";
import {Map, Marker, TileLayer} from "react-leaflet";
import L from "leaflet";
import {TrackItem} from "./track";
import {iconBlack, iconBlue, iconGreen, iconRed, iconShadow, markerOil} from "./markersType";

const accessToken = "pk.eyJ1IjoiYXJnb25hdnQiLCJhIjoiY2piMmF2OG50OHowZzJ4cjF2ZGFjcW94eCJ9.OTlx9S0_tG9kuFqYjT3HMA";

export default class MapDetailMachine extends React.Component {
  render() {
    return (
      <SimpleExample
        unit={this.props.unit}
        track={this.props.track}
        marker={this.props.marker}
        status={this.props.status}
        static={this.props.static}
      />
    );
  }
}

class SimpleExample extends React.Component {
  constructor() {
    super();
    this.state = {
      position: [47.2, 39.7],
      viewport: [47.2, 39.7],
      zoom: 3,
      type: "osm",
      openControlTypeMap: false,
    };
    this.onCenter = this.onCenter.bind(this);
    this.switchType = this.switchType.bind(this);
    this.togglePopupType = this.togglePopupType.bind(this);
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
    });
  }

  componentDidMount() {
    let arrayPolyline = [];
    if (this.props.track) {
      if (this.props.track.length) {
        this.props.track.map((item) => {
          item.path.map((it) => {
            const point = [it.lat, it.lng];
            arrayPolyline = [...arrayPolyline, point];
          });
        });
        this.refs.map.leafletElement.flyToBounds(L.latLngBounds(arrayPolyline));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.track !== this.props.track) {
      let arrayPolyline = [];
      if (nextProps.track) {
        if (nextProps.track) {
          if (nextProps.track.length) {
            nextProps.track.map((item) => {
              item.path.map((it) => {
                const point = [it.lat, it.lng];
                arrayPolyline = [...arrayPolyline, point];
              });
            });
            this.refs.map.leafletElement.flyToBounds(L.latLngBounds(arrayPolyline));
          }
        }
      }
    }
  }

  render() {
    return (
      <Map
        ref="map"
        zoomAnimation={false}
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
                "http://tiles.maps.sputnik.ru/{z}/{x}/{y}.png"}
        />
        <Control position="topleft">
          <div className="map__center">
            <button
              onClick={() => this.onCenter()}
            />
          </div>
        </Control>
        <Control position="topright">
          <div className="map__topright">
            <div className="map__topright-controll">
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
        {this.props.track.length ?
          <TrackItem
            track={this.props.track}
            static={this.props.static}
            status={this.props.unit.data && this.props.unit.data.STATUS && this.props.unit.data.STATUS.value ? this.props.unit.data.STATUS.value : 0}
            activeTime={this.props.unit.data && this.props.unit.data.ACTIVE ? this.props.unit.data.ACTIVE.valueF : 0}
            activeMarker={this.props.unit.data && this.props.unit.data.LATITUDE && this.props.unit.data.LONGITUDE ? {
              status: this.props.unit.data.STATUS ? this.props.unit.data.STATUS.value : 0,
              SPEED: this.props.unit.data.SPEED ? this.props.unit.data.SPEED.value : 0,
              lat: this.props.unit.data.LATITUDE.value,
              lng: this.props.unit.data.LONGITUDE.value
            } : {}}
          /> : null}
        {this.props.unit && this.props.unit.data && this.props.unit.data.LATITUDE && this.props.unit.data.LONGITUDE && !this.props.track.length ? (
          <Marker
            position={[this.props.unit.data.LATITUDE.value, this.props.unit.data.LONGITUDE.value]}
            icon={
              this.props.unit.data.STATUS.value === 0 ? iconShadow :
                this.props.unit.data.STATUS.value === 1 ? iconBlue :
                  this.props.unit.data.STATUS.value === 2 ? iconBlack :
                    this.props.unit.data.STATUS.value === 3 ? iconRed :
                      iconGreen}
          />
        ) : null}
        {this.props.marker ? (
          <Marker
            position={this.props.marker}
            icon={markerOil}
          />
        ) : null}
      </Map>
    );
  }
}