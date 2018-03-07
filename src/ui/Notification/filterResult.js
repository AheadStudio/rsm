import React from "react";
import DetailLoad from "../../ui/Preloader/detailLoad";
import ResultItem, {ResultItemNoStatic} from "../../ui/Notification/resultItem";
import {connect} from "react-redux";
import {completeLoad} from "../../reducers/actions/notification";
import {successNotifications} from "../../queries/socket";

@connect(state => ({
  users: state.users.get("users"),
  notification: state.notification,
}), dispatch => ({
  completeLoad: () => dispatch(completeLoad()),
}))
export default class FilterResult extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.notification.toJS().resultLoad !== nextProps.notification.toJS().resultLoad) {
      if (nextProps.notification.toJS().resultLoad.length >= 5) {
        nextProps.notification.toJS().detailLoad.map((item, index) => {
          if (index > nextProps.notification.toJS().resultLoad.length && index < nextProps.notification.toJS().resultLoad.length + 2) {
            successNotifications(item);
          }
        });
      }
      if (nextProps.notification.toJS().resultLoad.length >= nextProps.notification.toJS().detailLoad.length) {
        this.props.completeLoad();
      }
    }
  }

  render() {
    let numStatic = 0;
    this.props.users.map((user) => {
      return user.units.units.map((unit) => {
        if (unit.data.MESSAGES) {
          numStatic = numStatic + unit.data.MESSAGES.length;
        }
      });
    });
    return (
      <div className="result-filter">
        <div className="result-filter__size">
          <span className="result-filter__size-text">Найдено:</span>
          <span
            className="result-filter__size-number">{this.props.notification.get("numberLoad") ? this.props.notification.get("notification").toJS().length : numStatic}</span>
        </div>
        <DetailLoad
          queries={this.props.notification.get("detailLoad").toJS()}
          progress={this.props.notification.get("resultLoad").toJS()}
        />
        <div className="result-filter__list">
          <table className="result-table">
            <thead>
            <tr>
              <th><span>Время и дата</span></th>
              <th><span>Машина</span></th>
              <th><span>Статус</span></th>
              <th><span>Уведомление</span></th>
              <th><span>Состояние</span></th>
            </tr>
            </thead>
            {this.props.notification.get("numberLoad") ? (
              <tbody>
              {this.props.notification.get("notification").toJS()
                .map((item, index) => <ResultItemNoStatic data={item} key={index}/>)}
              </tbody>
            ) : (
              <tbody>
              {this.props.users.map((user) => {
                return user.units.units.map((unit) => {
                  if (unit.data.MESSAGES) {
                    return unit.data.MESSAGES.map((message, index) => <ResultItem
                        machine={unit}
                        data={message}
                        key={index}
                      />
                    );
                  }
                });
              })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    );
  }
}