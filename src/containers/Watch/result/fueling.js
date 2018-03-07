import React from "react";
import ItemFueling from "../item/fueling";
import MapDetailMachine from "../../../ui/Map/mapUnit";
import GraphicDigraph from "../../../ui/Graphic/digraph";
import {connect} from "react-redux";
import {successReportTrack} from "../../../queries/socket";

@connect(state => ({
  users: state.users.get("users"),
}))
export default class FuelingResult extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        marker: null,
      },
    };
    this.pushDataFueling = this.pushDataFueling.bind(this);
  }

  pushDataFueling(data) {
    this.setState({
      data: {
        marker: null,
      }
    }, () => this.setState({data}));
    successReportTrack({id: data.idMachine, from: data.from, to: data.to}, "fueling");
  }

  render() {
    let listEvent = [];
    if (this.state.data.idMachine) {
      this.props.report
        .filter((report) => report.id === this.state.data.idMachine)
        .map((report) => {
          if (report.fuelEvents) {
            listEvent = [...listEvent, ...report.fuelEvents];
          }
        });
    }
    return (
      <div>
        {this.state.data.graphic ? (
          <GraphicDigraph
            data={this.state.data.graphic}
            modes={this.state.data.modes}
            speed={this.state.data.speed}
            listEvent={listEvent}
          />
        ) : null}
        <div className="watch__col-wrap">
          <div className="watch__col">
            <div className="map-wrap">
              <MapDetailMachine
                marker={this.state.data.marker}
                unit={{}}
                static={false}
                track={this.props.track && this.props.track[0] ? [this.props.track[0]] : []}
              />
            </div>
          </div>
          <div className="watch__col">
            <table>
              <thead>
              <tr>
                <th>
                  <p>Тип</p>
                </th>
                <th>
                  <p>Серийный №</p>
                </th>
                <th>
                  <p>Событие</p>
                </th>
                <th>
                  <p>Дата</p>
                </th>
                <th>
                  <p>Время начала</p>
                </th>
                <th>
                  <p>Время окончания</p>
                </th>
                <th>
                  <p>Продолжительность</p>
                </th>
                <th>
                  <p>Топливо, л.</p>
                </th>
                <th>
                  <p>Начало бак, л.</p>
                </th>
                <th>
                  <p>Конец бак, л.</p>
                </th>
              </tr>
              </thead>
              <tbody>
              {this.props.report.map((report) => {
                if (report.fuelEvents) {
                  return report.fuelEvents.map((item) => (
                    <ItemFueling
                      key={item.startTime}
                      from={report.from}
                      to={report.to}
                      modes={report.modes}
                      pushDataFueling={this.pushDataFueling}
                      graphic={report.fuel}
                      idMachine={report.id}
                      users={this.props.users}
                      speed={report.speed}
                      active={this.state.data.idMachine === report.id}
                      {...item}
                    />
                  ));
                }
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}