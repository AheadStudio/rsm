import React from "react";
import { Spin } from "antd";
import { connect } from "react-redux";
import { userLogout } from "../../reducers/actions/loginizaion";

@connect(
  null,
  (dispatch) => ({
    logOut: () => dispatch(userLogout()),
  })
)
export default class Preload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      watchError: false,
    };
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({
        watchError: true,
      });
    }, 30000);
  }
  render() {
    return (
      <div className="preloader">
        <img src={`${process.env.PUBLIC_URL}/img/svg/RSM_logo_red.svg`} alt="" />
        <Spin
          size="large"
        />
        {this.state.watchError ? 
          <button
            className="preloader__logout"
            onClick={() => this.props.logOut()}
          >Выйти</button> : 
          null}
      </div>
    );
  }
}