import React from "react";
import PropTypes from "prop-types";
import {GeoJSON} from "react-leaflet";

const GeoZone = ({ zone }) => {
  return (
    <div>
      {zone.map((item) => {
        if(item.watch) {
          return <GeoJSON
            ref={(geo) => this[`geo${item.id}`] = geo}
            data={item.location}
          />;
        } else {
          return null;
        }
      })}
    </div>
  );
};

PropTypes.GeoZone = {
  users: PropTypes.array,
};

export default GeoZone;