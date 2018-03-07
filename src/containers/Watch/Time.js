import React from "react";
import FilterControl from "../../ui/Filter/filterControl";
import AnalyticGraphicBar from "../../ui/Analytics/graphicBar";
import InitFilter from "../../ui/Filter/initFilter";
import {connect} from "react-redux";
import {Spin} from 'antd';
import {clearReport, pushTime} from "../../reducers/actions/reports";

@connect(state => ({
  report: state.reports.get("time"),
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
      id: 2,
      type: "date",
      section: "time",
      name: "Период времени",
      validate: true,
      result: []
    }
  ],
  callback: (data) => (dispatch) => {
    clearReport(dispatch, "time");
    pushTime(dispatch, data, "time");
  },
  clear: () => (dispatch) => {
    clearReport(dispatch, "time");
  }
})
export default class Time extends React.Component {
  render() {
    return (
      <div className="watch__wrap">
        <FilterControl
          onStartFilter={this.props.onStartFilter}
          onFilter={this.props.onFilter}
          clearFilter={this.props.clearFilter}
          deleteParameters={this.props.deleteParameters}
          filter={this.props.filter}
          button={true}
          shadowButton={this.props.shadowButton}
          disableButton={this.props.report.get("detailLoad").toJS().length !== this.props.report.get("resultLoad").toJS().length}
          week={true}
        />
        <div style={{display: "flex", justifyContent: "center"}}>
          {this.props.report.get("detailLoad").toJS().length !== this.props.report.get("resultLoad").toJS().length ?
            <Spin/> : null}
        </div>
        {this.props.report.get("time").toJS().length ?
          <AnalyticGraphicBar
            report={this.props.report.get("time")}
          /> : null}
      </div>
    );
  }
};