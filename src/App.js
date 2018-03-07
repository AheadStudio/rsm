import React from "react";
import {browserHistory, Router} from "react-router";
import {connect} from "react-redux";
import {RouterBlock} from "./router";
import "antd/lib/spin/style/index.css";
import "antd/lib/tooltip/style/index.css";
import "antd/lib/progress/style/index.css";
import 'rc-time-picker/assets/index.css';
import "./style/index.scss";
import "./style/leaflet.css";

@connect(state => ({
  state,
}))
export default class App extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  
  render() {
    return (
      <Router history={browserHistory}>
        {RouterBlock(this.props.state.user, this.props.dispatch, this.props.state.user.get("connect"))}
      </Router>
    );
  }
}