import React from "react";
import { connect } from "react-redux";
import { Progress } from 'antd';

@connect(
  stata => ({
    reports: stata.reports.get("exportReport"),
  })
)
export default class LoaderExports extends React.Component {
  constructor() {
    super();
    this.state = {
      open: true
    };
    this.toggleDetail = this.toggleDetail.bind(this);
  }
  toggleDetail() {
    this.setState({
      open: !this.state.open,
    });
  }
  render() {
    return (
      <div
        className="loader-exports"
        onClick={() => this.toggleDetail()}
      >
        <div
          className="loader-exports__top"
          onClick={() => this.setState({
            open: !this.state.open,
          })}
        >
          <p>Экспорт отчётов</p>
        </div>
        <div className={`loader-exports__detail ${this.state.open ? "active" : ""}`}>
          {this.props.reports.map((item) =>
            <LoaderItem
              {...item}
            /> )}
        </div>
      </div>
    );
  }
}

class LoaderItem extends React.Component {
  render(){
    let name;
    if (this.props.typeReport === "harvest"){
      if(this.props.flag === true) {
        name = "Итоговый отчет по уборке";
      } else {
        name = "Итоговый отчет по уборке (компактный)";
      }
    } else if (this.props.typeReport === "harvestC") {
      if(this.props.flag === true) {
        name = "Посуточный отчет по уборке";
      } else {
        name = "Посуточный отчет по уборке (компактный)";
      }
    } else if (this.props.typeReport === "vehicle") {
      if(this.props.flag === true) {
        name = "Итоговый отчет по машинам";
      } else {
        name = "Посуточный отчет по машинам";
      }
    } else if (this.props.typeReport === "timeusage") {
      if(this.props.flag === true) {
        name = "Итоговый отчет по использованию времени";
      } else {
        name = "Посуточный отчет по использованию времени";
      }
    } else {
      name = "Уведомления";
    }
    return(
      <div className="loader-item">
        <p className="loader-item__name">{name}</p>
        {this.props.progress === 1 ? (
          <div className="loader-item__control">
            <a
              className="loader-item__download"
              href={this.props.linkSrc}
              target="_self"
            >Скачать</a>
          </div>
        ) : (
          <div className="loader-item__progress">
            <Progress
              percent={(this.props.progress * 100) || 0}
              status="active"
            />
          </div>
        )}
      </div>
    );
  }
}