import React from "react";
import {Link} from "react-router";
import {link} from "../../router";
import {Tooltip} from "antd";
import {Progress} from "../Machines/card";

const progresColor = {
  shadow: "#bcbcbc",
  red: "#D10B41",
  yellow: "#F1C340",
  green: "#78C800",
  black: "#202020",
  blue: "#06a9f5",
};

const IconEngineLoad = ({load}) => {
  let color;
  load === 0 ? color = progresColor.black :
    load < 20 && load !== 0 ? color = progresColor.blue :
      load > 20 && load < 60 ? color = progresColor.yellow :
        load > 60 ? color = progresColor.red :
          color = progresColor.shadow;
  return (
    <svg viewBox={"0 0 22 14"} width={22} height={14}>
      <path id="Page 1" style={{fill: color}}
            transform='translate(-6 -6)'
            d="M25,11v2h-2v-2h-2l-2,-2h-3v-2h3v-2h-8v2h3v2h-5v3h-2v-3c-1.1,0 -2,0.9 -2,2v4c0,1.1 0.9,2 2,2v-3h2v3h2l2,2h10v-2h2v2c1.1,0 2,-0.9 2,-2v-4c0,-1.1 -0.9,-2 -2,-2"/>
    </svg>
  );
};

const IconSpeed = ({speed}) => {
  let color;
  speed === 0 ? color = progresColor.black :
    speed < 20 && speed !== 0 ? color = progresColor.blue :
      speed > 20 && speed < 60 ? color = progresColor.yellow :
        speed > 60 ? color = progresColor.red :
          color = progresColor.shadow;
  return (
    <svg viewBox={"0 0 18 19"} width={18} height={19}>
      <path id="Fill 3" style={{fill: color}}
            transform='translate(-6 -3)'
            d="M13,14.95l0.01,-7.7l3.72,6.75l-0.01,0c0.09,0.16 0.17,0.32 0.22,0.51c0.28,1.07 -0.37,2.16 -1.44,2.43c-1.07,0.27 -2.16,-0.37 -2.43,-1.44c-0.05,-0.18 -0.06,-0.37 -0.05,-0.55zM15,6c-4.97,0 -9,4.03 -9,9c0,1.74 0.5,3.35 1.35,4.73c2.32,-1.1 4.91,-1.73 7.65,-1.73c2.74,0 5.32,0.63 7.65,1.73c0.85,-1.38 1.35,-2.99 1.35,-4.73c0,-4.97 -4.03,-9 -9,-9z"/>
    </svg>
  );
};

const InformationPanel = ({data, model, typeName, name, id}) => {
  let FUEL = 0, SPEED = 0, LOAD = 0;
  if (data) {
    if (data.FUEL) {
      if (data.FUEL.value) {
        data.FUEL.measure !== "%" ?
          FUEL = (data.FUEL.value / data.FUEL.max) * 100 :
          FUEL = data.FUEL.value;
      } else {
        FUEL = 0;
      }
    } else {
      FUEL = 0;
    }
    data.SPEED ?
      data.SPEED.value ? SPEED = data.SPEED.value : SPEED = 0 :
      SPEED = 0;
    data.LOAD ?
      data.LOAD.value ?
        LOAD = data.LOAD.value :
        LOAD = 0 :
      LOAD = 0;
  }
  return (
    <div style={{display: "flex", width: "100%"}}>
      <div className="tracking-machine__data-col col-machine">
        <div className="data-machine-t__main">
          <Tooltip title={data.STATUS.valueF}>
            <div className={`data-machine-t__icon ${model} status-${data.STATUS.value}`}/>
          </Tooltip>
          <div className="data-machine-t__text">
            <Link to={`${link.detail}?machine=${id}`} className="data-machine-t__type">{typeName}</Link>
            <Link to={`${link.detail}?machine=${id}`} className="data-machine-t__name">{name}</Link>
          </div>
        </div>
      </div>
      <div className="tracking-machine__data-col icons">
        <Tooltip title="Уровень топлива">
          <div className="data-machine-icon">
            <Progress
              fuel={FUEL.toFixed()}
            />
            <p className="tracking-machine__progress-text">
              {data && data.FUEL && data.FUEL.measure === "л" ? data.FUEL.value ? `${data.FUEL.valueF}` : '0 л' : `${FUEL.toFixed(0)}%`}
            </p>
          </div>
        </Tooltip>
        {SPEED && SPEED.toFixed() >= 1 ? (
          <div className="data-machine-icon">
            <Tooltip title="Скорость">
              <div className="speed">
                <IconSpeed speed={SPEED}/>
                <p>{SPEED.toFixed()}</p>
              </div>
            </Tooltip>
          </div>
        ) : null}
        {LOAD && LOAD.toFixed() >= 1 ? (
          <div className="data-machine-icon">
            <Tooltip title="Нагрузка двигателя">
              <div className="engine-load">
                <IconEngineLoad load={LOAD.toFixed()}/>
                <p>{LOAD.toFixed()}%</p>
              </div>
            </Tooltip>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InformationPanel;