import React from "react";
import MapDetailMachine from "../../ui/Map/mapUnit";
import FilterControl from "../../ui/Filter/filterControl";
import DetailLoad from "../../ui/Preloader/detailLoad";
import InitFilter from "../../ui/Filter/initFilter";
import {connect} from "react-redux";
import {clearReport, finishLoadReport, successReport} from "../../reducers/actions/reports";
import {successReportTrack, successMachine} from "../../queries/socket";

@connect(state => ({
  report: state.reports.get("machine")
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
      type: "date-solo",
      name: "Время",
      section: "time",
      id: 1,
      result: [],
      validate: true,
    }
  ],
  callback: (data) => (dispatch) => {
    clearReport(dispatch, "machine");
    successReport(dispatch, data, "machine", successMachine);
    successReportTrack({id: data.machine[0].id, from: data.time[0].from, to: data.time[0].to}, "machine");
  },
  clear: () => (dispatch) => {
    clearReport(dispatch, "machine");
  }
})
class MachineReports extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.report.toJS().resultLoad !== nextProps.report.toJS().resultLoad) {
      if (nextProps.report.toJS().resultLoad.length >= nextProps.report.toJS().detailLoad.length) {
        this.props.finishLoadReport("machine");
      }
    }
  }
  render() {
    const parameters = [];
    if (this.props.report.get("machine").toJS().length) {
      for (let key in this.props.report.get("machine").toJS()[0].data) {
        if (this.props.report.get("machine").toJS()[0].data[key] && this.props.report.get("machine").toJS()[0].data[key].value) {
          parameters.push(<p>{this.props.report.get("machine").toJS()[0].data[key].name}
            <span>{this.props.report.get("machine").toJS()[0].data[key].valueF}</span></p>);
        }
      }
    }
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
        <div className="watch__col-wrap2">
          <div className="watch__col">
            <div className="machine-reports">
              {parameters}
            </div>
          </div>
          <div className="watch__col">
            <MapDetailMachine
              unit={{}}
              static={false}
              track={this.props.report.get("track") ? this.props.report.get("track") : []}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MachineReports;