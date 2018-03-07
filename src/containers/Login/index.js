import React from "react";
import { connect } from "react-redux";

@connect(state => ({
  state
}))
export default class Login extends React.Component {
  render() {
    return (
      <div className="login-page">
        <div className="login-page__form">
          <div className="login-page__logo">
            <img src={`${process.env.PUBLIC_URL}/img/jpg/logo-index.png`} alt=""/>
            <p>Agrotronic</p>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}