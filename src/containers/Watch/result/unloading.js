import React from "react";
import Item from "../item/unloading";
import {connect} from "react-redux";

@connect(state => ({
  users: state.users.get("users"),
}))
export default class FilterResult extends React.Component {
  render() {
    return (
      <div className="watch__full">
        <table>
          <thead>
          <tr>
            <th>
              <p>Тип</p>
            </th>
            <th>
              <p>Машина</p>
            </th>
            <th>
              <p>Дата</p>
            </th>
            <th>
              <p>Время начала выгрузки</p>
            </th>
            <th>
              <p>Время окончания выгрузки</p>
            </th>
            <th>
              <p>Продолжительность</p>
            </th>
          </tr>
          </thead>
          <tbody>
          {this.props.report.map((report) => {
            return report.unloads.map((item, index) => (
              <Item
                key={index}
                idMachine={report.id}
                users={this.props.users}
                {...item}
              />
            ));
          })}
          </tbody>
        </table>
      </div>
    );
  }
}