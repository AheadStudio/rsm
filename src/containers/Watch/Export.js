import React from "react";
import FilterControl from "../../ui/Filter/filterControl";
import InitFilter from "../../ui/Filter/initFilter";
import {clearReport, finishLoadReport, startLoadExport} from "../../reducers/actions/reports";
import {Spin} from 'antd';
import {connect} from "react-redux";

const buttons = [
  {name: "Итоговый отчет по уборке", typeReport: "harvest", flag: false},
  {name: "Итоговый отчет по уборке (компактный)", typeReport: "harvestC", flag: false},
  {name: "Посуточный отчет по уборке", typeReport: "harvest", flag: true},
  {name: "Посуточный отчет по уборке (компактный)", typeReport: "harvestC", flag: true},
  {name: "Итоговый отчет по машинам", typeReport: "vehicle", flag: false},
  {name: "Посуточный отчет по машинам", typeReport: "vehicle", flag: true},
  {name: "Итоговый отчет по использованию времени", typeReport: "timeusage", flag: false},
  {name: "Посуточный отчет по использованию времени", typeReport: "timeusage", flag: true},
  {name: "Уведомления", typeReport: "messages", flag: true},
];

@connect(state => ({
  report: state.reports.get("exportReport")
}), dispatch => ({
  finishLoadReport: (type) => dispatch(finishLoadReport(type)),
  startLoadExport: (data) => dispatch(startLoadExport(data))
}))
@InitFilter({
  default: [
    {
      type: "checkbox-machine",
      name: "Машина",
      section: "machine",
      id: 0,
      result: [],
      items: [],
      validate: true,
    },
    {
      type: "date",
      name: "Время",
      section: "time",
      id: 1,
      result: [],
      validate: true,
    }
  ],
  clear: () => (dispatch) => {
    clearReport(dispatch, "export");
  }
})
export default class Export extends React.Component {
  render() {
    let ids, from, to;
    if (this.props.filter[0] && this.props.filter[1].result[0]) {
      ids = this.props.filter[0].result.map((item) => item.id);
      from = this.props.filter[1].result[0].from;
      to = this.props.filter[1].result[0].to;
    }
    return (
      <div className="watch__wrap">
        <FilterControl
          onStartFilter={this.props.onStartFilter}
          onFilter={this.props.onFilter}
          clearFilter={this.props.clearFilter}
          deleteParameters={this.props.deleteParameters}
          filter={this.props.filter}
          shadowButton={this.props.shadowButton}
        />
        <div style={{display: "flex", justifyContent: "center"}}>
          {this.props.report.get("load") ? <Spin/> : null}
        </div>
        <div className="watch__export">
          {buttons.map((item) =>
            <ButtonExport
              name={item.name}
              from={from}
              to={to}
              id={ids}
              typeReport={item.typeReport}
              flag={item.flag}
              startLoadExport={this.props.startLoadExport}
              shadowButton={this.props.shadowButton}
            />
          )}
        </div>
      </div>
    );
  }
}

class ButtonExport extends React.Component {
  constructor() {
    super();
    this.state = {
      num: 0
    };
  }

  render() {
    return (
      <div className="watch__export-item">
        <p>{this.props.name}</p>
        {!this.props.shadowButton ?
          <button
            onClick={() => {
              this.props.startLoadExport({
                from: this.props.from,
                to: this.props.to,
                id: this.props.id,
                typeReport: this.props.typeReport,
                flag: this.props.flag,
                idProgress: `${this.props.typeReport}-${this.props.flag}-${this.state.num}`
              });
              this.setState({num: this.state.num + 1});
            }}
          >Экспортировать отчёт</button> :
          <button>Экспортировать отчёт</button>}
      </div>
    );
  }
}