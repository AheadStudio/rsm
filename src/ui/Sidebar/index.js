import React from "react";
import ReactDOM from "react-dom";
import {IntlActions, withTranslate} from "react-redux-multilingual";
import {Link} from "react-router";
import {connect} from "react-redux";
import {toggleSidebar} from "../../reducers/actions/sidebar";
import {userLogout} from "../../reducers/actions/loginizaion";
import {Navigaion} from "./navigation";
import {UserCard} from "./user";
import {link} from "../../router";

@connect(state => ({
  sidebar: state.sidebar,
  lang: state.Intl.locale,
  user: state.user.get("info"),
}), dispatch => ({
  userLogout: () => dispatch(userLogout()),
  setLanguage: (lan) => dispatch(IntlActions.setLocale(lan)),
  toggleSidebar: () => dispatch(toggleSidebar()),
}))
@withTranslate
export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: [
        {
          name: this.props.translate("desctope"),
          img: `${process.env.PUBLIC_URL}/img/svg/desctop.svg`,
          classIcon: "desctop",
          src: link.home,
        },
        {
          name: this.props.translate("myMachines"),
          img: `${process.env.PUBLIC_URL}/img/svg/my_machines.svg`,
          classIcon: "machines",
          src: link.machines,
        },
        {
          name: this.props.translate("tracking"),
          img: `${process.env.PUBLIC_URL}/img/svg/tracking.svg`,
          classIcon: "tracking",
          src: link.tracking,
        },
        {
          name: this.props.translate("watch"),
          img: `${process.env.PUBLIC_URL}/img/svg/watch.svg`,
          classIcon: "watch",
          src: link.watch,
        },
        {
          name: this.props.translate("notifications"),
          img: `${process.env.PUBLIC_URL}/img/svg/notifications.svg`,
          classIcon: "notifications",
          src: link.notifications,
          number: 3,
        },
      ],
      openSettings: false,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, false);
  }

  componentWillMount() {
    document.addEventListener("click", this.handleClickOutside, false);
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if ((!domNode || !domNode.contains(event.target)) && this.props.sidebar.get("open")) {
      this.props.toggleSidebar();
    }
  }

  render() {
    const {sidebar, user} = this.props;
    return (
      <div className={sidebar.get("open") ? "sidebar active" : "sidebar"}>
        <div className="sidebar__top">
          <div className="sidebar__logo">
            <Link to={link.home}>
              <img src={`${process.env.PUBLIC_URL}/img/svg/logo.svg`} alt=""/>
            </Link>
            <div
              tabIndex="0"
              role="button"
              className="sidebar__open-nav"
              onClick={() => this.props.toggleSidebar()}
            />
          </div>
          <Navigaion
            nav={this.state.nav}
            activeRouter={this.props.path}
          />
        </div>
        <div className="sidebar__bottom">
          <div
            tabIndex="0"
            role="button"
            className="sidebar__item sidebar__settings"
            onClick={() => this.props.userLogout()}
          >
            <div className="sidebar__settings-click">
              <span className="icon">
                <img style={{width: "17px"}} className="ic ic-settings" src={`${process.env.PUBLIC_URL}/img/svg/icon-close-w.svg`} alt=""/>
              </span>
              <span className="sidebar__item-text">
                <font>Выход</font>
              </span>
            </div>
          </div>
          <div
            tabIndex="0"
            role="button"
            className="sidebar__item sidebar__settings"
            onClick={() => this.props.router.push(link.settings)}
          >
            <div className="sidebar__settings-click">
              <span className="icon">
                <img className="ic ic-settings" src={`${process.env.PUBLIC_URL}/img/svg/settings.svg`} alt=""/>
              </span>
              <span className="sidebar__item-text">
                <font>{this.props.translate("settings")}</font>
              </span>
            </div>
          </div>
          {/*<div className="sidebar__bottom-langs">*/}
            {/*<div*/}
              {/*className={`sidebar__bottom-lang ${this.props.lang === "ru" && "active"}`}*/}
              {/*onClick={() => this.props.setLanguage("ru")}*/}
            {/*>Ру*/}
            {/*</div>*/}
            {/*<div*/}
              {/*className={`sidebar__bottom-lang ${this.props.lang === "en" && "active"}`}*/}
              {/*onClick={() => this.props.setLanguage("en")}*/}
            {/*>En*/}
            {/*</div>*/}
            {/*<div*/}
              {/*className={`sidebar__bottom-lang ${this.props.lang === "de" && "active"}`}*/}
              {/*onClick={() => this.props.setLanguage("de")}*/}
            {/*>De*/}
            {/*</div>*/}
          {/*</div>*/}
          <UserCard user={user}/>
        </div>
      </div>
    );
  }
}