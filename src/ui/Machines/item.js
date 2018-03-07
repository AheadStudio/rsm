import React from "react";
import PropTypes from "prop-types";
import MachineCard from "./card";
import Graphic from "../Graphic/svg";
import {link} from "../../router";
import {Link} from "react-router";
import {connect} from "react-redux";
import {activeWatch} from "../../reducers/actions/users";

@connect(
  null,
  dispatch => ({
    activeWatch: (id) => dispatch(activeWatch(id))
  })
)
export default class ResultItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.changed.find((param) => param !== "TIME_NO_LINK") !== undefined || nextProps.watch !== this.props.watch;
  }
  render() {
    const parameters = {
      TIME_NO_LINK: 0,
      TIME_MOVE_NO_HARVEST: 0,
      TIME_OFF: 0,
      TIME_STOP_DON: 0,
      TIME_HARVEST: 0,
      FUEL: 0,
      FIRST_MOTOR: 0,
      SPEED: 0,
      INC_SUMM_FUEL: 0,
      INC_SUMM_AREA: 0,
      AVER_SPEED_COMBINE: 0,
    };
    if (this.props.data) {
      for (let key in parameters) {
        if (key === "FUEL") {
          if(this.props.data[key]) {
            this.props.data[key].measure === "л" ?
              parameters[key] = this.props.data[key].max / this.props.data[key].value :
              parameters[key] = this.props.data[key].value;
          } else {
            parameters[key] = 0;
          }
        } else if (key === "FIRST_MOTOR") {
          if (this.props.data[key].value) {
            this.props.data[key].valueF !== "-" ? parameters[key] = this.props.data[key].valueF : parameters[key] = 0;
          }
        } else if (key === "SPEED") {
          if (parameters[key] = this.props.data[key].value >= 1) {
            parameters[key] = this.props.data[key].value;
          }
        } else {
          parameters[key] = this.props.data[key].value;
        }
      }
    }
    return (
      <tr>
        <td data-label="машина">
          <MachineCard
            id={this.props.id}
            type={this.props.typeName}
            name={this.props.name}
            status={this.props.data.STATUS.value}
            statusF={this.props.data.STATUS.valueF}
            fuel={parameters.FUEL}
            model={this.props.model}
            warning={this.props.data.MESSAGES ?this.props.data.MESSAGES.filter((message) => message.status === 4).length : 0}
            noWarning={this.props.data.MESSAGES ?this.props.data.MESSAGES.filter((message) => message.status !== 4).length : 0}
          />
        </td>
        <td data-label="Запуск ДВС">
          <p style={!this.props.DBC ? {textAlign: "center", paddingRight: "5px"} : null}>
            {parameters.FIRST_MOTOR ? parameters.FIRST_MOTOR : "—"}
          </p>
        </td>
        <td data-label="Последние данные">
          <p
            className="r-date"
            style={!this.props.data.ACTIVE.valueF ? {textAlign: "center"} : null}
          >
            {this.props.data.ACTIVE.valueF && this.props.data.ACTIVE.valueF !== "-" ? this.props.data.ACTIVE.valueF  : "—"}
          </p>
        </td>
        <td data-label="Активность">
          <Graphic
            graphic={[
              {value: parameters.TIME_NO_LINK, color: 0, label: "Нет связи"},
              {value: parameters.TIME_MOVE_NO_HARVEST, color: 1, label: "Движение"},
              {value: parameters.TIME_OFF, color: 2, label: "Выключен"},
              {value: parameters.TIME_STOP_DON, color: 3, label: "Простой с вкл. ДВС"},
              {value: parameters.TIME_HARVEST, color: 4, label: "Простой с выкл. ДВС"},
            ]}
            width={300}
            height={150}
            border={"77%"}
          />
        </td>
        <td data-label="Текущая скорость">
          <p style={!this.props.currentSpeed ? {textAlign: "center"} : null}>
            {parameters.SPEED ? `${parameters.SPEED.toFixed()} км/ч` : "—"}
          </p>
        </td>
        <td data-label="Скорость комб.">
          <p style={!this.props.speedWork ? {textAlign: "center"} : null}>
            {parameters.AVER_SPEED_COMBINE ? `${parameters.AVER_SPEED_COMBINE.toFixed(1)} км/ч` : "—"}
          </p>
        </td>
        <td data-label="Расход топлива">
          <p style={!this.props.fuelConsumption ? {textAlign: "center"} : null}>
            {parameters.INC_SUMM_FUEL ? `${parameters.INC_SUMM_FUEL.toFixed(1)} л` : "—"}
          </p>
        </td>
        <td data-label="Убранная площадь">
          <p style={!this.props.speedWork ? {textAlign: "center"} : null}>
            {this.props.speedWork ? `${this.props.speedWork.toFixed(1)} Га` : "—"}
          </p>
        </td>
        <td data-label="Производ.">
          <p style={!this.props.performance ? {textAlign: "center"} : null}>
            {parameters.INC_SUMM_AREA ? `${parameters.INC_SUMM_AREA.toFixed(1)} Га` : "—"}
          </p>
        </td>
        <td data-label="Слежение">
          <div className="item-watch">
            <Link
              onClick={() => {
                this.props.activeWatch(this.props.id);
              }}
              to={`${link.households}?machine=${this.props.name}`}
              className={`item-watch__button ${this.props.watch && "active"}`}
            />
          </div>
        </td>
      </tr>
    );
  }
}

ResultItem.propTypes = {
  id: PropTypes.number,
  imei: PropTypes.number,
  mode: PropTypes.number,
  model: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.number,
  typeName: PropTypes.string,
};
