import React from "react";
import moment from "moment";
import {connect} from "react-redux";

const NotificationStatus = ({ color, text }) => {
  return (
    <div className={`result-status color-${color}`}>
      {text}
    </div>
  );
};

@connect(state => ({
  users: state.users.get("users"),
}))
export default class ResultItem extends React.Component {
  render() {
    const { time, name, set, status } = this.props.data;
    return(
      <tr>
        <td>
          <p>
            <span>{time ? moment(time, "YYMMDDHHmmss000").format("DD.MM.YY").toString() : ""}</span>
            {time ? moment(time, "YYMMDDHHmmss000").format("HH.mm.ss").toString() : ""}
          </p>
        </td>
        <td>
          <p>{this.props.machine.name ? this.props.machine.name : ""}</p>
        </td>
        <td>
          <NotificationStatus color={status} text={""} />
        </td>
        <td>
          <p>{name ? name : ""}</p>
        </td>
        <td>
          <p>{set ? set : ""}</p>
        </td>
      </tr>
    );
  }
}

@connect(state => ({
  users: state.users.get("users").toJS(),
}))
export class ResultItemNoStatic extends React.Component {
  constructor(){
    super();
    this.state = {
      machine: {}
    };
  }
  componentWillMount(){
    this.props.users.map((user) => {
      const findUnit = user.units.units.find((unit) => unit.id === this.props.data.idMachine);
      if(findUnit){
        this.setState({
          machine: findUnit
        });
      }
    });
  }
  render(){
    const { time, name, set, status } = this.props.data;
    return(
      <tr>
        <td>
          <p>
            <span>{time ? moment(time, "YYMMDDHHmmss000").format("DD.MM.YY").toString() : ""}</span>
            {time ? moment(time, "YYMMDDHHmmss000").format("HH.mm.ss").toString() : ""}
          </p>
        </td>
        <td>
          <p>{this.state.machine.name ? this.state.machine.name : ""}</p>
        </td>
        <td>
          <NotificationStatus color={status} text={""} />
        </td>
        <td>
          <p>{name ? name : ""}</p>
        </td>
        <td>
          <p>{set ? set : ""}</p>
        </td>
      </tr>
    );
  }
}