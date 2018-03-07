import React from "react";
import moment from "moment";
import WrapTimePicker from "../Pickers/timePicker";
import { DateRange } from "react-date-range";

export default class DayPickerRangeControllerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: {
        date: null,
        time: {
          hourse: "00",
          minute: "00"
        }
      },
      endDate: {
        date: null,
        time: {
          hourse: "23",
          minute: "59"
        }
      },
      endTime: null,
    };
    this.applyDate = this.applyDate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.setTime = this.setTime.bind(this);
    this.cancelDate = this.cancelDate.bind(this);
  }

  handleSelect(date) {
    this.setState(prevState => {
      prevState.startDate.date = date.startDate;
      prevState.endDate.date = date.endDate;
      return prevState;
    });
  }

  applyDate() {
    if (this.props.week) {
      if((moment(this.state.startDate.date) - moment(this.state.endDate.date)) >= -691199999) {
        this.props.applyDate([
          this.state.startDate,
          this.state.endDate
        ]);
      }
    } else {
      this.props.applyDate([
        this.state.startDate,
        this.state.endDate
      ]);
    }
  }

  cancelDate() {
    this.setState({
      startDate: {
        date: null,
        time: {
          hourse: "00",
          minute: "00"
        }
      },
      endDate: {
        date: null,
        time: {
          hourse: "23",
          minute: "59"
        }
      },
    });
  }

  setTime(date) {
    this.setState(prevState => {
      prevState.startDate.time = date.old;
      prevState.endDate.time = date.to;
      return prevState;
    });
  }

  render() {
    const format = "dddd, D MMMM YYYY";
    return (
      <div>
        <div className="filter-parameter__inputs">
          <input type="text" value={this.state.startDate.date ? this.state.startDate.date.format(format).toString() : null} placeholder={"From"} />
          <input type="text" value={this.state.endDate.date ? this.state.endDate.date.format(format).toString() : null} placeholder={"To"} />
        </div>
        <WrapTimePicker
          old={this.state.startDate.time}
          to={this.state.endDate.time}
          setTime={(date) => this.setTime(date)}
        />
        <DateRange
          minDate={this.state.endDate.date && this.props.week ? moment(moment(this.state.endDate.date).valueOf() - 604800000) : null}
          maxDate={this.state.startDate.date && this.props.week ? moment(moment(this.state.startDate.date).valueOf() + 604800000) : null}
          lang="ru"
          firstDayOfWeek={1}
          onInit={this.handleSelect}
          onChange={this.handleSelect}
        />
        <div className="filter-parameter__buttons">
          <button onClick={() => this.cancelDate()}>Сбросить</button>
          <button onClick={() => this.applyDate()}>Принять</button>
        </div>
      </div>
    );
  }
}