import React from "react";

const ControlNotification = ({activeMarkers, showTypesMarkers, id, showMarkers}) => (
  <div
    className={`tracking-machine__settings ${activeMarkers.bt1 ? "active" : ""}`}
  >
    <p>Уведомления</p>
    <div className="tracking-machine__item">
      <input
        id="n1"
        type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "MESSAGES_MAIN") !== undefined}
      />
      <label
        htmlFor="n1"
        onClick={() => showMarkers({id, data: "MESSAGES_MAIN"})}
      >Важные</label>
    </div>
    <div className="tracking-machine__item">
      <input
        id="n2" type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "MESSAGES_CRIT") !== undefined}
      />
      <label
        htmlFor="n2"
        onClick={() => showMarkers({id, data: "MESSAGES_CRIT"})}
      >Критические</label>
    </div>
  </div>
);
export default ControlNotification;