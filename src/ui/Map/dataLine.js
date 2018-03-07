import React from "react";

const DataLine = ({newGeoZone, nameNewGeoZone, saveElement}) => (
  <div>
    <div className="geoZone-controll__data">
      <p>Последняя точка</p>
    </div>
    <div className="geoZone-controll__item">
      <p>Длинна<span>5.07 км</span></p>
    </div>
    {newGeoZone[0].points.length > 1 && nameNewGeoZone ? (
      <div className="geoZone-controll__button-wr">
        <button onClick={() => saveElement()}>Сохранить геозону</button>
      </div>
    ) : null}
  </div>
);

export default DataLine;