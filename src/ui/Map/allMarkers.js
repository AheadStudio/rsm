import React from "react";
import PropTypes from "prop-types";
import {Marker, Popup} from "react-leaflet";
import {PopupMarker} from "./markers";
import {iconBlack, iconBlue, iconGreen, iconRed, iconShadow} from "./markersType";

export const AllMarkers = ({users, activeWatch}) => (
  <div>
    {users.map((user, index) => (
        <div key={index}>
          {user.units.units.map((unit) => {
            if (unit.data.LATITUDE && unit.data.LONGITUDE) {
              if (unit.data.LATITUDE.value && unit.data.LONGITUDE.value) {
                return (
                  <Marker
                    key={unit.id}
                    position={[unit.data.LATITUDE.value, unit.data.LONGITUDE.value]}
                    icon={
                      unit.data.STATUS.value === 0 ? iconShadow :
                        unit.data.STATUS.value === 1 ? iconBlue :
                          unit.data.STATUS.value === 2 ? iconBlack :
                            unit.data.STATUS.value === 3 ? iconRed :
                              iconGreen
                    }
                  >
                    <Popup>
                      <PopupMarker
                        main={unit.main}
                        type={unit.name}
                        name={unit.typeName}
                        state={unit.data.STATUS.valueF}
                        watch={false}
                        data={unit.data}
                        id={unit.id}
                        activeWatch={activeWatch}
                      />
                    </Popup>
                  </Marker>
                );
              }
            } else return null;
          })}
        </div>
      )
    )}
  </div>
);

AllMarkers.PropTypes = {
  users: PropTypes.array,
};