import React from "react";
import FilterControl from "../../ui/Filter/filterControl";
import FuelingResult from "./result/fueling";
import DetailLoad from "../../ui/Preloader/detailLoad";
import InitFilter from "../../ui/Filter/initFilter";
import {connect} from "react-redux";
import {successReport, finishLoadReport, clearReport} from "../../reducers/actions/reports";
import {successFuel} from "../../queries/socket";

@connect(state => ({
  report: state.reports.get("fueling"),
}), dispatch => ({
  finishLoadReport: (type) => dispatch(finishLoadReport(type))
}))
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
      filter: "FUEL.l"
    },
    {
      id: 1,
      type: "date",
      name: "Период времени",
      section: "time",
      result: [],
      validate: true,
    }
  ],
  callback: (data) => (dispatch) => {
    clearReport(dispatch, "fueling");
    successReport(dispatch, data, "fueling", successFuel);
  },
  clear: () => (dispatch) => {
    clearReport(dispatch, "fueling");
  }
})
export default class Fueling extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.report.toJS().resultLoad !== nextProps.report.toJS().resultLoad) {
      if (nextProps.report.toJS().resultLoad.length >= 5) {
        nextProps.report.toJS().detailLoad.map((item, index) => {
          if (index > nextProps.report.toJS().resultLoad.length && index < nextProps.report.toJS().resultLoad.length + 2) {
            successFuel(item);
          }
        });
      }
      if (nextProps.report.toJS().resultLoad.length >= nextProps.report.toJS().detailLoad.length) {
        this.props.finishLoadReport("fueling");
      }
    }
  }
  render() {
    return (
      <div className="watch__wrap">
        <FilterControl
          onStartFilter={this.props.onStartFilter}
          onFilter={this.props.onFilter}
          clearFilter={this.props.clearFilter}
          deleteParameters={this.props.deleteParameters}
          filter={this.props.filter}
          shadowButton={this.props.shadowButton}
          disableButton={this.props.report.get("detailLoad").toJS().length !== this.props.report.get("resultLoad").toJS().length}
          button={true}
        />
        <DetailLoad
          queries={this.props.report.get("detailLoad").toJS()}
          progress={this.props.report.get("resultLoad").toJS()}
        />
        <FuelingResult
          track={this.props.report.get("track")}
          markers={this.props.report.get("markers")}
          report={this.props.report.get("fueling").toJS()}
        />
      </div>
    );
  }
}