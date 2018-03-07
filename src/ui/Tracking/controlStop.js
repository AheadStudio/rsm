import React from "react";

const ControlStop = ({showTypesMarkers, showMarkers, id}) => (
  <div className="tracking-machine__settings">
    <p>Простои</p>
    <div className="tracking-machine__item">
      <input
        id="z1"
        type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "M3_LT1") !== undefined}
      />
      <label
        htmlFor="z1"
        onClick={() => showMarkers({id, data: "M3_LT1"})}
      >простой с включенным ДВС до 1 мин</label>
    </div>
    <div className="tracking-machine__item">
      <input
        id="z2"
        type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "M3_GT1") !== undefined}
      />
      <label
        htmlFor="z2"
        onClick={() => showMarkers({id, data: "M3_GT1"})}
      >простой с включенным ДВС более 1 мин</label>
    </div>
    <div className="tracking-machine__item">
      <input
        id="z3"
        type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "M2_LT1") !== undefined}
      />
      <label
        htmlFor="z3"
        onClick={() => showMarkers({id, data: "M2_LT1"})}
      >остановка менее 1 минуты</label>
    </div>
    <div className="tracking-machine__item">
      <input
        id="z4"
        type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "M2_1_TO_10") !== undefined}
      />
      <label
        htmlFor="z4"
        onClick={() => showMarkers({id, data: "M2_1_TO_10"})}
      >остановка от 1 до 10 минут</label>
    </div>
    <div className="tracking-machine__item">
      <input
        id="z5"
        type="checkbox"
        checked={showTypesMarkers !== undefined && showTypesMarkers.find((item) => item === "M2_GT10") !== undefined}
      />
      <label
        htmlFor="z5"
        onClick={() => showMarkers({id, data: "M2_GT10"})}
      >остановка более 10 минут</label>
    </div>
  </div>
);
export default ControlStop;