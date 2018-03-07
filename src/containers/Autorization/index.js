import React from "react";
import {link} from "../../router";
import {browserHistory} from "react-router";
import {connect} from "react-redux";
import initSocked from "../../queries/socket";
import Preloader from "../../ui/Preloader";

@connect(state => ({
  state,
  preLoaded: state.user.get("preLoaded"),
}))
export default class Autorization extends React.Component {
  componentWillMount() {
    const storage = localStorage.getItem("rsm-agrotronic");
    if (storage) {
      const userTgt = JSON.parse(localStorage.getItem("rsm-agrotronic")).user.tgt;
      if (userTgt) {
        if (!this.props.state.user.get("connect")) {
          this.props.dispatch(initSocked(userTgt));
        }
      } else {
        browserHistory.push(link.autorizacion);
      }
    } else {
      browserHistory.push(link.autorizacion);
    }
  }

  render() {
    return (
      <div style={this.props.preLoaded ? {"position": "fixed"} : null}>
        {this.props.preLoaded ? <Preloader/> : null}
        <div className="app" style={this.props.preLoaded ? {position: "fixed"} : null}>{this.props.children}</div>
      </div>
    );
  }
}