import React from "react";
import {Tooltip} from "antd";

const ControlMarker = (props) => (
  <div className="tracking-machine__button-control">
    {props.markers ? [
      <Tooltip title="Простои">
        <button
          onClick={() => props.pushActiveMarker("bt1")}
          className={`tracking-machine__bt bt1 ${props.activeMarkers.bt1 ? "active" : ""}`}
        />
      </Tooltip>,
      <Tooltip title="Бункер загружен">
        <button
          onClick={() => props.showMarkers({id: props.id, data: "BUNKER_FULL"})}
          className={props.showTypesMarkers && props.showTypesMarkers.find((item) => item === "BUNKER_FULL") ? "tracking-machine__bt bt2 active" : "tracking-machine__bt bt2"}
        />
      </Tooltip>,
      <Tooltip title="Выгрузка">
        <button
          onClick={() => props.showMarkers({id: props.id, data: "UPLOAD"})}
          className={`tracking-machine__bt bt3 ${(props.showTypesMarkers && props.showTypesMarkers.find((item) => item === "UPLOAD")) ? "active" : ""}`}
        />
      </Tooltip>,
      <Tooltip title="Уведомления">
        <button
          onClick={() => props.pushActiveMarker("bt4")}
          className={`tracking-machine__bt bt4 ${props.activeMarkers.bt4 ? "active" : ""}`}
        />
      </Tooltip>
    ] : null}
    <Tooltip title="Трек в геозоне">
      {props.detailData && props.detailData.DATA_GEO && props.detailData.DATA_GEO.length ? (
        <button
          onClick={() => props.toggleInfoFeoZone()}
          className={`tracking-machine__bt bt5 ${props.openInfoGeoZone ? "active" : ""}`}
        />
      ) : null}
    </Tooltip>
    <Tooltip title="Масштабирование">
      <button
        onClick={() => props.centerTrack()}
        className={`tracking-machine__bt bt6 ${props.activeMarkers.bt6 ? "active" : ""}`}
      />
    </Tooltip>
  </div>
);
export default ControlMarker;