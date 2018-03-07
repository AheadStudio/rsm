import React from "react";
import FilterControl from "../../ui/Filter/filterControl";
import ResultFilter from "./result/indicators";
import InitFilter from "../../ui/Filter/initFilter";
import DetailLoad from "../../ui/Preloader/detailLoad";
import {clearReport, finishLoadReport, successReport} from "../../reducers/actions/reports";
import {successIndicators} from "../../queries/socket";
import {connect} from "react-redux";

@connect(state => ({
  report: state.reports.get("performanceIndicators")
}), dispatch => ({
  finishLoadReport: (type) => dispatch(finishLoadReport(type))
}))
@InitFilter({
  default: [
    {
      type: "radio-machine",
      name: "Машина",
      section: "machine",
      id: 0,
      result: [],
      items: [],
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
    clearReport(dispatch, "performanceIndicators");
    successReport(dispatch, data, "performanceIndicators", successIndicators);
  },
  clear: () => (dispatch) => {
    clearReport(dispatch, "performanceIndicators");
  }
})
export default class PerformanceIndicators extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.report.toJS().resultLoad !== nextProps.report.toJS().resultLoad) {
      if (nextProps.report.toJS().resultLoad.length >= nextProps.report.toJS().detailLoad.length) {
        this.props.finishLoadReport("performanceIndicators");
      }
    }
  }

  render() {
    return (
      <div>
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
          {this.props.report.get("performanceIndicators").toJS().length ?
            <ResultFilter
              report={this.props.report.get("performanceIndicators").toJS()}
            /> : null}
        </div>
      </div>
    );
  }
}