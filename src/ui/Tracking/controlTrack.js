import React from "react";
import {Tooltip} from "antd";

const ControlTrack = ({track, load, setTrack, deleteTrack}) => (
  <div className="tracking-machine__bt-wr">
    <Tooltip title="Трек по режимам">
      <button
        onClick={() => setTrack("TRACK_HARVEST")}
        className={track === "TRACK_HARVEST" ? " tracking-machine__bt bt7 active" : "tracking-machine__bt bt7"}
      />
    </Tooltip>
    <Tooltip title="Трек по скорости">
      <button
        onClick={() => setTrack("TRACK_SPEED")}
        className={track === "TRACK_SPEED" ? "tracking-machine__bt t1 active" : "tracking-machine__bt t1"}
      />
    </Tooltip>
    {load ? (
      <Tooltip title="Трек по нагрузке">
        <button
          onClick={() => setTrack("TRACK_LOAD")}
          className={track === "TRACK_LOAD" ? "tracking-machine__bt t2 active" : "tracking-machine__bt t2"}
        />
      </Tooltip>
    ): null}
    <Tooltip title="Удалить трек">
      <button
        onClick={() => deleteTrack()}
        className={`tracking-machine__bt t3`}
      />
    </Tooltip>
  </div>
);

export default ControlTrack;