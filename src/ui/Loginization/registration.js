import React from "react";
import { Link } from "react-router";
import { link } from "../../router";

export default class Registration extends React.Component {
  render() {
    return (
      <div className="login-form">
        <form action="">
          <span className="login-form__title">Регистрация</span>
          <input className="login-form__input" type="text" placeholder="Имя" />
          <input className="login-form__input" type="text" placeholder="Фамилия" />
          <input className="login-form__input" type="text" placeholder="Предприятие" />
          <input className="login-form__input" type="text" placeholder="e-mail" />
          <button className="login-form__button">Регистрация</button>
          <Link to={link.autorizacion} className="login-form__button type1">Вход</Link>
        </form>
      </div>
    );
  }
}