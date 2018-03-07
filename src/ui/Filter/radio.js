import React from "react";
import ReactDOM from "react-dom";
import { Plus } from "../Filter/filterControl";

export class ControllRadio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }
  // changeChecked() {
  //   this.setState({
  //     checked: !this.state.checked,
  //   }, () => {
  //     this.state.checked ?
  //       this.props.pushItem({ param: this.props.itemId, id: this.props.index, name: this.props.item }) :
  //       this.props.deleteItem({ param: this.props.itemId, id: this.props.index, name: this.props.item });
  //   });
  // }
  render() {
    const { itemId, index, item } = this.props;
    return (
      <div className="filter-parameter__item filter-parameter__radio">
        <input
          type="radio"
          name={itemId}
          id={`${itemId}${index}`}

        // onChange={() => {
        //   this.changeChecked();
        // }}
        />
        <label htmlFor={`${itemId}${index}`}>{item}</label>
      </div>
    );
  }
}

export default class FilterRadio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
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
      this.setState({
        open: false,
      });
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
            {this.props.items.map((item) => (
              <ControllRadio
                index={item}
                itemId={this.props.id}
                item={item}
                key={item}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}