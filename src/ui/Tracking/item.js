import React from "react";
import PropTypes from "prop-types";
import ListMachine from "./listMachine";
import {connect} from "react-redux";

export const IconClose = () => (
  <svg viewBox={"0 0 24 18"} width={24} height={18}>
    <path id="Combined Shape" style={{ fill: "#78c800" }} d="M18.54,5.46v0c-0.39,-0.39 -1.02,-0.39 -1.41,0l-5.66,5.66c-0.39,0.39 -0.39,1.02 0,1.41v0c0.39,0.39 1.02,0.39 1.41,0l5.66,-5.66c0.39,-0.39 0.39,-1.02 0,-1.41zM12.54,12.54v0c0.39,-0.39 0.39,-1.02 0,-1.41l-5.66,-5.66c-0.39,-0.39 -1.02,-0.39 -1.41,0v0c-0.39,0.39 -0.39,1.02 0,1.41l5.66,5.66c0.39,0.39 1.02,0.39 1.41,0z" />
  </svg>
);

export const IconOpen = () => (
  <svg viewBox={"0 0 24 18"} width={24} height={18}>
    <path id="Combined Shape" style={{ fill: "#78c800" }} d="M18.54,11.12l-5.66,-5.66c-0.39,-0.39 -1.02,-0.39 -1.41,0v0c-0.39,0.39 -0.39,1.02 0,1.41l5.66,5.66c0.39,0.39 1.02,0.39 1.41,0v0c0.39,-0.39 0.39,-1.02 0,-1.41zM11.12,5.46l-5.66,5.66c-0.39,0.39 -0.39,1.02 0,1.41v0c0.39,0.39 1.02,0.39 1.41,0l5.66,-5.66c0.39,-0.39 0.39,-1.02 0,-1.41v0c-0.39,-0.39 -1.02,-0.39 -1.41,0z" />
  </svg>
);

@connect(state => ({
  usersState: state.users.get("users"),
}))
export default class TrackingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.open !== this.props.open) {
      this.setState({
        open: nextProps.open,
      });
    }
  }
  toggleOpen() {
    this.setState({open: !this.state.open});
  }
  render() {
    const { name, units } = this.props;
    const { open } = this.state;
    const findUser = this.props.usersState.find((user) => user.id === this.props.id);
    const watchMachines = findUser.units.units.filter((unit) => unit.watch);
    return (
      <div className={`tracking-item${open ? " active" : ""}`}>
        <div
          className="tracking-item__main"
          tabIndex="0"
          role="button"
          onClick={() => {
            this.toggleOpen();
          }}
        >
          <div className="tracking-item__name">
            <p>{name}</p>
             {watchMachines.length ? <span>{watchMachines.length}</span> : null}
          </div>
          <div className="tracking-item__open">
            {open ? <IconOpen /> : <IconClose />}
          </div>
        </div>
        {open ? <ListMachine list={units} /> : null}
      </div>
    );
  }
}

TrackingItem.PropTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  parent: PropTypes.number,
  type: PropTypes.number,
  units: PropTypes.array,
};