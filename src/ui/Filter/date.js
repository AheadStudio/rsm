import React from "react";
import ReactDOM from "react-dom";
import DayPickerRangeControllerWrapper from "../Pickers/rangeDate";
import PropTypes from "prop-types";
import { Plus } from "../Filter/filterControl";
import moment from "moment/moment";

export default class FilterDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      initialStartDate: "",
      initialEndDate: "",
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.applyDate = this.applyDate.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, false);
  }

  componentWillMount() {
    document.addEventListener("click", this.handleClickOutside, false);
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(event.target))) {
      this.setState({
        open: false,
      });
    }
  }

  toggleDate() {
    this.setState({ openDate: !this.state.open });
  }

  changeDate(initialStartDate, initialEndDate) {
    this.setState({ initialStartDate: initialStartDate, initialEndDate: initialEndDate });
  }

  applyDate(date) {
    const from = `${moment(date[0].date.valueOf()).format("YYMMDD")}${date[0].time.hourse}${date[0].time.minute}000`;
    const to = `${moment(date[1].date.valueOf() - 500).format("YYMMDD")}${date[1].time.hourse}${date[1].time.minute}000`;
    this.context.onStartFilter(this.props.section, {from, to});
    this.setState({open: false});
  }

  render() {
    return (
      <div className="filter-parameter date">
        <p
          tabIndex="0"
          role="button"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <span>{this.props.name}</span><Plus />
        </p>
        {this.state.open && (
          <div
            className="filter-parameter__open date"
            ref={(open) => this.open = open}
          >
            <DayPickerRangeControllerWrapper
              show={this.state.open}
              week={this.props.week}
              applyDate={(date) => this.applyDate(date)}
              changeDate={this.changeDate}
              toggleDate={this.toggleDate}
            />
          </div>
        )}
      </div>
    );
  }
}

FilterDate.contextTypes = {
  onStartFilter: PropTypes.func
};