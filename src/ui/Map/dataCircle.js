import React from "react";
import PropTypes from "prop-types";

const DataCircle = ({newGeoZone, areaCircle, saveElement, nameNewGeoZone}) => (
  <div>
    <div className="geoZone-controll__item">
      <p>Радиус<span>{newGeoZone[0].radius ? (newGeoZone[0].radius / 1000).toFixed(3) : 0} км</span>
      </p>
    </div>
    <div className="geoZone-controll__item">
      <p>Площадь<span>{newGeoZone[0].radius && newGeoZone[0].center ? areaCircle : 0} га</span>
      </p>
    </div>
    {newGeoZone[0].center && newGeoZone[0].radiusPoint && nameNewGeoZone ? (
      <div className="geoZone-controll__button-wr">
        <button onClick={() => saveElement()}>Сохранить геозону</button>
      </div>
    ) : null}
  </div>
);

DataCircle.PropTypes = {
  newGeoZone: PropTypes.array,
  areaCircle: PropTypes.number,
  saveElement: PropTypes.func,
};

export default DataCircle;