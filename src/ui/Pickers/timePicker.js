import React from "react";

export default class WrapTimePicker extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      old: this.props.old,
      to: this.props.to
    };

    this.changeDate = this.changeDate.bind(this);
  }

  changeDate(range, type, data) {
    this.setState((prevState) => {
      prevState[range][type] = data;
      return prevState;
    }, () => {
      this.props.setTime(this.state);
    });
  }

  render() {
    return (
      <div className="filter-parameter__time-range">
        <TimePicker
          range="old"
          onChange={this.changeDate}
          value={this.state.old}
        />
        <TimePicker
          range="to"
          onChange={this.changeDate}
          disabled={this.state.old}
          value={this.state.to}
        />
      </div>
    );
  }
}

export class TimePicker extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(range, type, value) {
    this.props.onChange(range, type, value);
  }
  render() {
    return (
      <div className="filter-parameter__time-item">
        <Select
          num="24"
          onChange={(value) => this.handleChange(this.props.range, "hourse", value)}
          value={this.props.value ? this.props.value.hourse : "00"}
        >
          {(item) => <option name="hourse" key={item} value={item}>{item}</option>}
        </Select>
        <Select
          num="60"
          onChange={(value) => this.handleChange(this.props.range, "minute", value)}
          value={this.props.value ? this.props.value.minute : "00"}
        >
          {(item) => {
            return <option
              name="minute"
              key={item}
              value={item}
            >{item}</option>;
          }}
        </Select>
      </div>
    );
  }
}

const Select = (props) => {
  let items = [];
  for (let i = 0; i < props.num; i++) {
    i < 10 ? i = `0${i}` : i;
    items.push(props.children(i));
  }
  return <select name="old" value={props.value} onChange={(e) => props.onChange(e.target.value)}>{items}</select>;
};