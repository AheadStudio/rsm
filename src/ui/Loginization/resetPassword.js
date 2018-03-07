import React from "react";

export default class ResetPassword extends React.Component {
  render() {
    return (
      <div className="login-form">
        <form action="">
          <span className="login-form__title">Востановить пароль</span>
          <input className="login-form__input" type="text" placeholder="e-mail" />
          <button className="login-form__button">Востановить пароль</button>
        </form>
      </div>
    );
  }
}