import React from "react";
import {Link} from "react-router";
import {link} from "../../router";

export default class ActiveItem extends React.Component {
  shouldComponentUpdate(nextProps){
    return (nextProps.all !== this.props.all) || (nextProps.activity !== this.props.activity);
  }
  render() {
    return(
      <tr>
        <td><p className="activity__name">{this.props.name}</p></td>
        <td>{this.props.all ? <Link to={`${link.machines}?households=${this.props.id}`} className="activity__all"><span>{this.props.all}</span> Машины <i/></Link> : "—"}</td>
        <td>{this.props.activity ?
          <Link to={`${link.machines}?households=${this.props.id}&active=true`} className="activity__activity"><span>{this.props.activity}</span> Машины <i/></Link> : "—"}</td>
        <td>{this.props.warning ?
          <Link to={`${link.machines}?households=${this.props.id}&notification=4`} className="activity__warning"><span>{this.props.warning}</span> Машины <i/></Link> : "—"}</td>
      </tr>
    );
  }
}