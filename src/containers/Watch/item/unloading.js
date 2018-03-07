import React from "react";

export default class Item extends React.Component {
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
      <tr>
        <td data-label="Тип">
          <p>{this.state.machine.typeName}</p>
        </td>
        <td data-label="Машина">
          <p>{this.state.machine.name}</p>
        </td>
        <td data-label="Дата">
          <p>{this.props.date}</p>
        </td>
        <td data-label="Время начала выгрузки">
          <p>{this.props.begin}</p>
        </td>
        <td data-label="Время окончания выгрузки">
          <p>{this.props.end}</p>
        </td>
        <td data-label="Продолжительность">
          <p>{this.props.duration}</p>
        </td>
      </tr>
    );
  }
}
