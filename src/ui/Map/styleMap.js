import React from "react";
import PropTypes from "prop-types";

const StyleMap = ({ type, switchType }) => (
  <div className="map-type__controll">
    <div className="map-type__item">
      <input
        id="type1"
        type="radio"
        name="type"
        checked={type === "map"}
      />
      <label
        tabIndex="0"
        role="button"
        htmlFor="type1"
        onClick={() => switchType("map")}
      >
        <span>Карта</span>
      </label>
    </div>
    <div className="map-type__item">
      <input
        id="type1"
        type="radio"
        name="type"
        checked={type === "osm"}
      />
      <label
        tabIndex="0"
        role="button"
        htmlFor="type1"
        onClick={() => switchType("osm")}
      >
        <span>OSM Карта</span>
      </label>
    </div>
    <div className="map-type__item">
      <input
        id="type1"
        type="radio"
        name="type"
        checked={type === "sputnic"}
      />
      <label
        tabIndex="0"
        role="button"
        htmlFor="type1"
        onClick={() => switchType("sputnic")}
      >
        <span>Вид со спутника</span>
      </label>
    </div>
  </div>
);

PropTypes.StyleMap = {
  type: PropTypes.string,
  switchType: PropTypes.func,
};

export default StyleMap;