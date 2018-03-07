import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {link} from "../../router";
import {succesAutorization} from "../../queries/autorization";

@connect(state => ({
  state: state,
}), dispatch => ({
  onAutorization: (param) => {
    dispatch(succesAutorization(param));
  }
}))
export default class Loginization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remember: true,
      login: "",
      password: "",
    };
    this.toggleRemember = this.toggleRemember.bind(this);
    this.setLogin = this.setLogin.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.pushLogin = this.pushLogin.bind(this);
  }

  toggleRemember() {
    this.setState({
      remember: !this.state.remember,
    });
  }

  setLogin(e) {
    this.setState({
      login: e.target.value,
    });
  }

  setPassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  pushLogin() {
    this.props.onAutorization({
      username: this.state.login,
      password: this.state.password,
    });
  }

  render() {
    return (
      <div className="login-form">
        <span className="login-form__title">Вход</span>
        <input
          className="login-form__input"
          type="text"
          placeholder="Логин"
          value={this.state.login}
          onChange={(e) => this.setLogin(e)}
        />
        <input
          className="login-form__input"
          type="password"
          placeholder="Пароль"
          value={this.state.password}
          onChange={(e) => this.setPassword(e)}
        />
        <div className="remember">
          <div className="remember__checkbox">
          </div>
          <Link to={link.resetPassword}>Забыли пароль?</Link>
        </div>
        <button
          onClick={() => this.pushLogin()}
          className="login-form__button"
        >Вход
        </button>
        <Link to={link.registration} className="login-form__button type1">Регистрация</Link>
        <Link className="login-form__button type2">Демонстрационный режим</Link>
      </div>
    );
  }
}
