import React, {Component} from "react";
import Sidebar from "../Sidebar";
import LoaderExports from "../../ui/Preloader/export";
import {connect} from "react-redux";
import {preLoaderStop} from "../../reducers/actions/loginizaion";

@connect(state => ({
    users: state.users,
    reports: state.reports.get("exportReport"),
  }),
  dispatch => ({
    preLoaderStop: () => dispatch(preLoaderStop()),
  }))
export default class AppWrap extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.users.get("users").size !== 0) {
      this.props.preLoaderStop();
    }
  }

  render() {
    return (
      <div>
        <Sidebar
          path={this.props.location.pathname}
          router={this.props.router}
        />
        <div className="page">
          <section className="content">
            {this.props.children}
          </section>
        </div>
        {this.props.reports.size ? <LoaderExports/> : null}
      </div>
    );
  }
}