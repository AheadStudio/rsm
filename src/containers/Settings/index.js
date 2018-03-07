import React from "react";
import { changeUser } from "../../queries/socket";
import { connect } from "react-redux";

@connect(
  state => ({
    user: state.user.get("info")
  })
)
export default class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      phone: "",
    };
    this.changePhone = this.changePhone.bind(this);
    this.applyForm = this.applyForm.bind(this);
  }
  changePhone(value) {
    const newValue = value.replace(/[^0-9]/g, '');
    this.setState({
      phone: newValue,
    });
  }
  applyForm() {
    if (this.state.email && this.state.phone) {
      changeUser({
        email: this.state.email,
        phone: this.state.phone,
      });
      this.setState({
        email: "",
        phone: "",
      });
    }
  }
  render(){
    return(
      <div>
        <div className="content__title">
          <h1>Управление</h1>
        </div>
        <div className="settings-form">
          <input
            type="text"
            placeholder="E-mail"
            onChange={(e) => this.setState({email: e.target.value})}
            value={this.state.email}
          />
          <input
            type="text"
            placeholder="Телефон"
            onChange={(e) => this.changePhone(e.target.value)}
            value={this.props.phone}
          />
          <button
            onClick={() => this.applyForm()}
          >Принять</button>
        </div>
      </div>
    );
  }
}