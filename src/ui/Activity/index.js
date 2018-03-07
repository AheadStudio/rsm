import React from "react";
import ActiveItem from "./ActiveItem";

export default class Activity extends React.Component {
  render() {
    return (
      <div className="activity">
        <div className="activity__title">
          <p>Активность</p>
        </div>
        <div className="activity__data">
          <table>
            <thead>
            <tr>
              <th><span>Название хозяйства</span></th>
              <th><span>Машин всего</span></th>
              <th><span>Активные</span></th>
              <th><span>Критические</span></th>
            </tr>
            </thead>
            <tbody>
            {this.props.data.map((item) =>
              <ActiveItem
                all={item.units.units.length}
                activity={item.units.units.filter((unit) => {
                  if (unit.data.STATUS) {
                    return unit.data.STATUS.value;
                  } else return 0;
                }).length}
                warning={item.units.units.filter((unit) => unit.data.MESSAGES && unit.data.MESSAGES.filter((message) => message.status === 4).length).length}
                key={item.id} {...item}
              />
            )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}