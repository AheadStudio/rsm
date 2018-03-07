import React from "react";
import moment from "moment";

export default class ItemFueling extends React.Component {
  constructor() {
    super();
    this.state = {
      machine: {}
    };
  }

  componentWillMount() {
    this.props.users.map((user) => {
      if (user.units.units.find((unit) => unit.id === this.props.idMachine)) {
        this.setState({
          machine: user.units.units.find((unit) => unit.id === this.props.idMachine),
        });
      }
    });
  }

  render() {
    return (
      <tr
        style={this.props.active ? {background: "#efefef", cursor: "pointer"} : {cursor: "pointer"}}
        onClick={() => this.props.pushDataFueling({
          marker: [this.props.lat, this.props.lon],
          machine: this.state.machine,
          graphic: this.props.graphic,
          modes: this.props.modes,
          from: this.props.from,
          to: this.props.to,
          idMachine: this.props.idMachine,
          speed: this.props.speed
        })}>
        <td data-label="Тип">
          <p>{this.state.machine.typeName}</p>
        </td>
        <td data-label="Серийный №">
          <p>{this.state.machine.name}</p>
        </td>
        <td data-label="Событие">
          <p>{this.props.eventName}</p>
        </td>
        <td data-label="Дата">
          <p>{moment(this.props.startTime).format("YY.MM.DD")}</p>
        </td>
        <td data-label="Время начала">
          <p>{moment(this.props.startTime).format("HH:mm:ss")}</p>
        </td>
        <td data-label="Время окончания">
          <p>{moment(this.props.endTime).format("HH:mm:ss")}</p>
        </td>
        <td data-label="Продолжительность">
          <p>{`${moment.duration(this.props.totalTime * 1000).minutes()}:${moment.duration(this.props.totalTime * 1000).seconds()}`}</p>
        </td>
        <td data-label="Топливо, л.">
          <p>{this.props.value.toFixed(1)}</p>
        </td>
        <td data-label="Начало бак, л.">
          <p>{this.props.startValue}</p>
        </td>
        <td data-label="Конец бак, л.">
          <p>{this.props.endValue}</p>
        </td>
      </tr>
    );
  }
}
