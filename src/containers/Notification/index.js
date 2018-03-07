import React from "react";
import FilterResult from "../../ui/Notification/filterResult";
import FilterControl from "../../ui/Filter/filterControl";
import InitFilter from '../../ui/Filter/initFilter';
import {startLoadNotifications, clearNotification} from "../../reducers/actions/notification";

@InitFilter({
  default: [
    {
      type: "checkbox-machine",
      name: "Машина",
      section: "machine",
      id:0,
      result:[],
      items:[],
      validate: true,
    },
    {
      type: "date",
      name: "Время",
      section: "time",
      id: 1,
      result:[],
      validate: true,
    },
    {
      type: "checkbox",
      section: "status",
      name: "Статус сообщения",
      id: 2,
      items: ["Важные", "Критические"],
      result: [],
    }
  ],
  callback: (data) => (dispatch) => startLoadNotifications(dispatch, data),
  clear: () => (dispatch) => clearNotification(dispatch),
})
export default class Notification extends React.Component {
  render() {
    return (
      <div className="notification">
        <div className="notification__title">
          <h1>Уведомления</h1>
        </div>
        <div className="notification__filter">
          <FilterControl
            onStartFilter={this.props.onStartFilter}
            onFilter={this.props.onFilter}
            clearFilter={this.props.clearFilter}
            deleteParameters={this.props.deleteParameters}
            shadowButton={this.props.shadowButton}
            button={true}
            filter={this.props.filter}
          />
        </div>
        <div className="notification__result">
          <FilterResult
            filtration={this.props.filtration}
          />
        </div>
      </div>
    );
  }
}