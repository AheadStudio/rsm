import React from "react";
import StyleMap from "./styleMap";
import Control from "react-leaflet-control";
import {Map, TileLayer, Marker} from "react-leaflet";
import {iconShadow} from "./markersType";

const accessToken = "pk.eyJ1IjoiYXJnb25hdnQiLCJhIjoiY2piMmF2OG50OHowZzJ4cjF2ZGFjcW94eCJ9.OTlx9S0_tG9kuFqYjT3HMA";

export default class SoloMachineMap extends React.Component {
  render(){
    return(
      <SimpleExample
        marker={this.props.marker}
      />
    );
  }
}

class SimpleExample extends React.Component {
  constructor() {
    super();
    this.state= {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.marker !== this.props.marker) {
      this.setState({viewport: nextProps.marker, position: nextProps.marker});
    }
  }
  render() {
    return(
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
        {this.props.marker ? (
          <Marker
            position={[this.props.marker[0], this.props.marker[1]]}
            icon={iconShadow}
          />
        ) : null}
      </Map>
    );
  }
}