import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import {Plus} from "../Filter/filterControl";
import {IconClose, IconOpen} from "../Tracking/item";

export default class FilterItemMultiRadio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      search: "",
    };
    this.toggleState = this.toggleState.bind(this);
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
      this.setState({
        open: false,
      });
    }
  }

  toggleState() {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    return (
      <div className="filter-parameter">
        <p
          tabIndex="0"
          role="button"
          onClick={() => this.toggleState()}
        >
          <span>{this.props.name}</span>
          <Plus/>
        </p>
        {this.state.open && (
          <div
            className="filter-parameter__open multy"
            ref={(open) => {
              this.open = open;
            }}
          >
            <div className="filter-parameter__wrap-multy">
              <div>
                {this.props.items.map((item) =>
                  <MultiItem
                    result={this.props.result}
                    {...item}
                    key={item.id}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class MultiItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      all: false,
      children: props.units || [],
    };
    this.toggleChildren = this.toggleChildren.bind(this);
    this.checkedActive = this.checkedActive.bind(this);
  }

  componentWillMount(){
    this.checkedActive(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkedActive(nextProps);
  }

  toggleChildren() {
    this.setState({open: !this.state.open});
  }

  checkedActive(props) {
    this.setState(prevState => {
      prevState.children.map((item) => {
        const findItem = props.result.find((it) => it.id === item.id);
        if (findItem) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      return prevState;
    });
  }

  render() {
    return (
      <div className="filter-parameter__multy">
        <div className="filter-parameter__multy-title" onClick={() => this.toggleChildren()}>
          <div className="filter-parameter__multy-main">
            <p>{this.props.name}</p>
          </div>
          {this.state.open ? <IconOpen/> : <IconClose/>}
        </div>
        {this.state.open ? (
          <div className="filter-parameter__multy-wrap">
            {this.state.children.map((item) => (
              <MultiItemChildren
                {...item}
                result={this.props.result}
                key={item.id}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

class MultiItemChildren extends React.Component {
  constructor(){
    super();
    this.state = {
      checked: false
    };
    this.setChecked = this.setChecked.bind(this);
  }

  setChecked() {
    this.context.onStartFilter("machine", {id: this.props.id, name: this.props.name}, true);
  }

  render() {
    return(
      <div className="filter-parameter__item">
        <input
          type="radio"
          id={this.props.id}
          checked={this.props.checked !== undefined && this.props.checked !== false}
        />
        <label
          htmlFor={this.props.id}
          onClick={() => this.setChecked()}
        ><font>{this.props.name}</font></label>
      </div>
    );
  }
}

MultiItemChildren.contextTypes = {
  onStartFilter: PropTypes.func,
  deleteParameters: PropTypes.func,
};

MultiItem.contextTypes = {
  onStartFilter: PropTypes.func
};
