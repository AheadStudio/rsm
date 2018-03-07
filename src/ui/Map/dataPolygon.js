import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PropTypes from "prop-types";

const DataPolygon = ({lastPoint, areaPolygon, newGeoZone, deleteState, deleteMode, saveElement, nameNewGeoZone}) => (
  <div>
    {lastPoint && (
      <div className="geoZone-controll__data">
        <p className="point">Активная точка
          <span>{lastPoint[0]}</span>
          <span>{lastPoint[1]}</span>
        </p>
      </div>
    )}
    <div className="geoZone-controll__item">
      <p>Площадь
        <span>{areaPolygon ? areaPolygon : 0} га</span>
      </p>
    </div>
    <ReactCSSTransitionGroup
      transitionName="example"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {newGeoZone[0].points.length && (
        <div
          className={deleteState ? "geoZone-controll__button-wr" : "geoZone-controll__button-wr active"}>
          <button
            onClick={() => deleteMode()}>{deleteState ? "Продолжить" : "Удалить точку"}</button>
        </div>
      )}
      {newGeoZone[0].points.length > 2 && nameNewGeoZone ? (
        <div className="geoZone-controll__button-wr">
          <button onClick={() => saveElement()}>Сохранить геозону</button>
        </div>
      ) : null}
    </ReactCSSTransitionGroup>
  </div>
);


PropTypes.DataPolygon = {
  lastPoint: PropTypes.array,
  areaPolygon: PropTypes.number,
  nameNewGeoZone: PropTypes.string,
  delete: PropTypes.bool,
  deleteMode: PropTypes.func,
  saveElement: PropTypes.func,
};

export default DataPolygon;