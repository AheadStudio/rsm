import React from "react";
import {Tooltip} from 'antd';
import {link} from "../../router";
import {Link} from "react-router";

export const statusName = {
  shadow: 0,
  blue: 1,
  black: 2,
  red: 3,
  green: 4,
};

const progressColor = {
  shadow: "shadow",
  red: "red",
  yellow: "yellow",
  green: "green",
};

export const Progress = ({fuel}) => {
  let color;
  if (fuel === 0) {
    color = progressColor.shadow;
  } else if (fuel <= 20 && fuel !== 0) {
    color = progressColor.red;
  } else if (fuel <= 60 && fuel > 20) {
    color = progressColor.yellow;
  } else {
    color = progressColor.green;
  }
  return (
    <div className="data-machine__progress">
      <div className={`data-machine__progress-active ${color}`} style={{height: `${fuel}%`}}/>
    </div>
  );
};

const MachineCard = (props) => {
  return (
    <div className="data-machine">
      <div className="data-machine__status">
        <div className="data-machine__status-wrap">
          <Tooltip title={props.statusF}>
            <div className={`data-machine__icon ${props.model}-${props.status}`}/>
          </Tooltip>
          <Progress fuel={props.fuel}/>
        </div>
      </div>
      <div className="data-machine__text">
        <Link to={`${link.detail}/?machine=${props.id}`} className="data-machine__name">
          {props.type}
          {props.warning ? <span className="data-machine__warning">{props.warning}</span> : null}
          {props.noWarning ?
            <span className={`data-machine__noWarning ${props.warning ? "no-solo" : ""}`}>{props.noWarning}</span> : null}
        </Link>
        <Link to={`${link.detail}/?machine=${props.id}`} className="data-machine__code">{props.name}</Link>
      </div>
    </div>
  );
};

export default MachineCard;