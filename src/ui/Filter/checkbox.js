import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { Plus } from "../Filter/filterControl";

export class ControlCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.changeChecked = this.changeChecked.bind(this);
  }
  componentWillMount() {
    if (this.props.result.find((item) => this.props.item === item) !== undefined) {
      this.setState({ checked: true });
    }
  }
  changeChecked(item) {
    this.setState({
      checked: !this.state.checked,
    }, () => {
      this.context.onStartFilter(this.props.section, item);
    });
  }
  render() {
    const { index, item, label } = this.props;
    return (
      <div className="filter-parameter__item">
        <input
          type="checkbox"
          value={this.state.item}
          id={`${item}${index}`}
          checked={this.state.checked}
          onChange={() => this.changeChecked(item)}
        />
        <label htmlFor={`${item}${index}`}>{label[this.props.index]}</label>
      </div>
    );
  }
}

export default class FilterCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      search: "",
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
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
      this.setState({ open: false });
    }
  }

  render() {
    return (
      <div className="filter-parameter">
        <p
          tabIndex="0"
          role="button"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <span>{this.props.name}</span>
          <Plus />
        </p>
        {this.state.open && (
          <div
            className="filter-parameter__open"
            ref={(open) => this.open = open}
          >
            {this.props.items.map((item, index) => (
              <ControlCheckbox
                key={this.props.section + index}
                item={item}
                index={index}
                label={this.props.labels || this.props.items}
                result={this.props.result}
                section={this.props.section}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

ControlCheckbox.contextTypes = {
  onStartFilter: PropTypes.func
};