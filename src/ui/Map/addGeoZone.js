import React from "react";
import PropTypes from "prop-types";
import {Plus} from "../Filter/filterControl";

const AddGeoZone = ({togglePopupGeoZone, newElement}) => (
  <div className="geoZone-controll__controll">
    <div className="geoZone-controll__title">
      <p>Создание геозон</p>
      <div
        tabIndex="0"
        role="button"
        className="geoZone-controll__close"
        onClick={() => togglePopupGeoZone(false)}
      />
    </div>
    <div
      tabIndex="0"
      role="button"
      className="geoZone-controll__add"
      onClick={() => newElement("Polygon")}
    >
      <p>Площадь</p>
      <Plus/>
    </div>
    {/*<div*/}
      {/*tabIndex="0"*/}
      {/*role="button"*/}
      {/*className="geoZone-controll__add"*/}
      {/*onClick={() => newElement("circle")}*/}
    {/*>*/}
      {/*<p>Круг</p>*/}
      {/*<Plus/>*/}
    {/*</div>*/}
    {/*<div*/}
      {/*tabIndex="0"*/}
      {/*role="button"*/}
      {/*className="geoZone-controll__add"*/}
      {/*onClick={() => newElement("line")}*/}
    {/*>*/}
      {/*<p>Линия</p>*/}
      {/*<Plus/>*/}
    {/*</div>*/}
  </div>
);

AddGeoZone.PropTypes = {
  togglePopupGeoZone: PropTypes.func,
  newElement: PropTypes.func,
};

export default AddGeoZone;