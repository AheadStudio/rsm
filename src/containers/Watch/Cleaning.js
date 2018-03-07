import React from "react";
import FilterControl from "../../ui/Filter/filterControl";
import FilterResult from "./result/cleaning";
import InitFilter from "../../ui/Filter/initFilter";
import DetailLoad from "../../ui/Preloader/detailLoad";
import {connect} from "react-redux";
import {clearReport, finishLoadReport, successReport} from "../../reducers/actions/reports";
import {successCleaning} from "../../queries/socket";

@connect(state => ({
  report: state.reports.get("cleaning")
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
    clearReport(dispatch, "cleaning");
    successReport(dispatch, data, "cleaning", successCleaning);
  },
  clear: () => (dispatch) => {
    clearReport(dispatch, "cleaning");
  }
})
export default class Cleaning extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.report.toJS().resultLoad !== nextProps.report.toJS().resultLoad) {
      if (nextProps.report.toJS().resultLoad.length >= 5) {
        nextProps.report.toJS().detailLoad.map((item, index) => {
          if (index > nextProps.report.toJS().resultLoad.length && index < nextProps.report.toJS().resultLoad.length + 2) {
            successCleaning(item);
          }
        });
      }
      if (nextProps.report.toJS().resultLoad.length >= nextProps.report.toJS().detailLoad.length) {
        this.props.finishLoadReport("cleaning");
      }
    }
  }
  render(){
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
        />
        <DetailLoad
          queries={this.props.report.get("detailLoad").toJS()}
          progress={this.props.report.get("resultLoad").toJS()}
        />
        <FilterResult
          report={this.props.report.get("cleaning").toJS()}
        />
      </div>
    );
  }
}