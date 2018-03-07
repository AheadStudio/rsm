import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { Plus } from "../Filter/filterControl";
import { Calendar } from 'react-date-range';

export default class FilterDateSolo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      day: null,
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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

  applyDate() {
    this.context.onStartFilter(this.props.section, {
      from: `${this.state.day.format("YYMMDD").toString()}000000000`,
      to: `${this.state.day.format("YYMMDD")}235959000`,
    });
    this.setState({
      open: false,
    });
  }

  handleSelect(date) {
    this.setState({
      day: date,
    });
  }

  render() {
    const format = "dddd, D MMMM YYYY";
    return (
      <div className="filter-parameter date-solo">
        <p
          tabIndex="0"
          role="button"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <span>{this.props.name}</span><Plus />
        </p>
        {this.state.open && (
          <div
            className="filter-parameter__open date-solo"
            ref={(open) => this.open = open}
          >
            <div className="filter-parameter__inputs">
              <input type="text" value={this.state.day ? this.state.day.format(format).toString() : null} />
            </div>
            <Calendar
              firstDayOfWeek={1}
              lang="ru"
              onInit={this.handleSelect}
              onChange={this.handleSelect}
            />
            <div className="filter-parameter__buttons">
              <button onClick={() => this.applyDate()}>Принять</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

FilterDateSolo.contextTypes = {
  onStartFilter: PropTypes.func
};