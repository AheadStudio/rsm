import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import {iconBlack, iconBlue, iconGreen, iconRed, iconShadow} from "./markersType";
import {Marker, Popup} from "react-leaflet";
import {browserHistory} from "react-router";
import {link} from "../../router";


export const PopupMarker = (props) => (
  <div className="marker-popup">
    <p
      onClick={() => {
        browserHistory.push(`${link.detail}?machine=${props.id}`);
      }}
      className="marker-popup__type"
    >{props.type}</p>
    <p className="marker-popup__name">{props.name}</p>
    <p className="marker-popup__name">{props.main}</p>
    {props.data.ACTIVE ? <p className="marker-popup__name">{props.data.ACTIVE.valueF}</p> : null}
    <div className="marker-popup__wrap">
      <p
        onClick={() => {
          browserHistory.push(`${link.households}?machine=${props.type}`);
          props.activeWatch(props.id);
        }}
        className="marker-popup__state"
      >{props.state}</p>
    </div>
  </div>
);

export const ItemMarkerPopup = (props) => (
  <div className="marker-popup">
    {props.name ? <p className="marker-popup__type">{props.name}</p> : null}
    {props.set ? <p className="marker-popup__name">{props.set}</p> : null}
    {props.duration ? <p className="marker-popup__name">{`${moment.duration(props.duration * 1000).hours()}:${moment.duration(props.duration * 1000).minutes()}:${moment.duration(props.duration * 1000).seconds()}`}</p> : null}
    {props.time ? <p className="marker-popup__name">{moment(props.time, "YYMMDDHHmmss000").format("DD.MM.YY")}</p> : null}
  </div>
);

export const Markers = ({markers}) => (
  <div>
    {markers.map((marker) => {
      if (marker.data.LATITUDE.value && marker.data.LONGITUDE.value) {
        return(
          <Marker
            key={marker.id}
            position={[marker.data.LATITUDE.value, marker.data.LONGITUDE.value]}
            icon={
              marker.data.STATUS.value === 0 ? iconShadow :
                marker.data.STATUS.value === 1 ? iconBlue :
                  marker.data.STATUS.value === 2 ? iconBlack :
                    marker.data.STATUS.value === 3 ? iconRed :
                      iconGreen
            }
          >
            <Popup>
              <PopupMarker
                main={marker.main}
                type={marker.name}
                name={marker.typeName}
                state={marker.data.STATUS.valueF}
                watch={marker.watch}
                data={marker.data}
                id={marker.id}
              />
            </Popup>
          </Marker>
        );
      } else {
        return null;
      }
    })}
  </div>
);

Markers.PropTypes = {
  markers: PropTypes.array,
};