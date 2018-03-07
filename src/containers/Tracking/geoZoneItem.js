import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {connect} from "react-redux";
import {centerPolygon, watchGeoZone} from "../../reducers/actions/geoZone";
import {deleteGeoZoneWS} from "../../queries/socket";
import {Tooltip} from 'antd';

const IconClose = () => (
  <svg
    viewBox={"0 0 24 18"}
    width={24}
    height={18}
  >
    <path
      id="Combined Shape"
      style={{fill: "#78c800"}}
      d="M18.54,5.46v0c-0.39,-0.39 -1.02,-0.39 -1.41,0l-5.66,5.66c-0.39,0.39 -0.39,1.02 0,1.41v0c0.39,0.39 1.02,0.39 1.41,0l5.66,-5.66c0.39,-0.39 0.39,-1.02 0,-1.41zM12.54,12.54v0c0.39,-0.39 0.39,-1.02 0,-1.41l-5.66,-5.66c-0.39,-0.39 -1.02,-0.39 -1.41,0v0c-0.39,0.39 -0.39,1.02 0,1.41l5.66,5.66c0.39,0.39 1.02,0.39 1.41,0z"/>
  </svg>
);

const IconOpen = () => (
  <svg
    viewBox={"0 0 24 18"}
    width={24}
    height={18}
  >
    <path
      id="Combined Shape"
      style={{fill: "#78c800"}}
      d="M18.54,11.12l-5.66,-5.66c-0.39,-0.39 -1.02,-0.39 -1.41,0v0c-0.39,0.39 -0.39,1.02 0,1.41l5.66,5.66c0.39,0.39 1.02,0.39 1.41,0v0c0.39,-0.39 0.39,-1.02 0,-1.41zM11.12,5.46l-5.66,5.66c-0.39,0.39 -0.39,1.02 0,1.41v0c0.39,0.39 1.02,0.39 1.41,0l5.66,-5.66c0.39,-0.39 0.39,-1.02 0,-1.41v0c-0.39,-0.39 -1.02,-0.39 -1.41,0z"/>
  </svg>
);

@connect(
  null,
  dispatch => ({
    watchGeoZone: (id) => dispatch(watchGeoZone(id)),
    centerPolygon: (id) => dispatch(centerPolygon(id)),
  }))
export default class GeoZoneItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      watch: false,
    };
    this.onWatch = this.onWatch.bind(this);
  }

  onWatch() {
    this.props.watchGeoZone(this.props.id);
    setTimeout(() => {
      if (this.props.watch) {
        this.props.centerPolygon(this.props.id);
      } else {
        this.props.centerPolygon(null);
      }
    });
  }

  render() {
    const {name, type} = this.props;
    return (
      <div className="geoZone-item">
        <div
          className="geoZone-item__item"
          tabIndex="0"
          role="button"
        >
          <div
            className="geoZone-item__text"
            onClick={() => this.setState({open: !this.state.open})}
          >
            <p className="geoZone-item__name">{name}</p>
          </div>
          {this.props.default ? (
            <div className="geoZone-item__info">
              <Tooltip title="Отслеживать">
                <div
                  onClick={() => this.onWatch()}
                  className={this.props.watch ? "geoZone-item__view active" : "geoZone-item__view"}
                />
              </Tooltip>
              <div
                className="geoZone-item__open"
                onClick={() => this.setState({open: !this.state.open})}
              >
                {this.state.open ? <IconOpen/> : <IconClose/>}
              </div>
            </div>
          ) : null}
        </div>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.state.open && this.props.default ? (
            <div className="geoZone-item__data">
              <div className="geoZone-item__data-top">
                <p>Тип геозоны <span>{type}</span></p>
                {/*<p>Культура <span>{item.culture}</span></p>*/}
                {/*<p>Площадь по документам <span>{item.ariaDoc}</span></p>*/}
                {/*<p>Площадь по карте <span>{item.ariaMap}</span></p>*/}
              </div>
              <div className="geoZone-item__data-controll">
                <p onClick={() => deleteGeoZoneWS(this.props.id)}>Удалить</p>
                <p
                  onClick={() => {
                    this.props.setGeoZone({
                      data:this.props.location.coordinates[0],
                      name,
                      typeSave: "settings",
                      idZone: this.props.id,
                    });
                  }}
                  className="geoZone-item__data-settings"
                >Редактировать геозону</p>
              </div>
              {/*<div className="geoZone-item__data-active">*/}
              {/*<p className="geoZone-item__title">Активность машин</p>*/}
              {/*<div className="geoZone-item__date">*/}
              {/*<p>Период:</p>*/}
              {/*<button>Сутки</button>*/}
              {/*<button>Неделя</button>*/}
              {/*<button>Выбрать даты <Plus/></button>*/}
              {/*</div>*/}
              {/*</div>*/}
              {/*<div className="geoZone-item__machines">*/}
              {/*<p>Нечувствительности въезда и выезда <span>3 минуты</span></p>*/}
              {/*<div className="geoZone-item__machines-item">*/}
              {/*<input id="m1" type="checkbox" checked/>*/}
              {/*<label htmlFor="m1">RSM 161 <span>R0RSM161000009</span></label>*/}
              {/*</div>*/}
              {/*<div className="geoZone-item__machines-item">*/}
              {/*<input id="m2" type="checkbox" checked/>*/}
              {/*<label htmlFor="m2">RSM 161 <span>R0RSM161000009</span></label>*/}
              {/*</div>*/}
              {/*</div>*/}
              {/*<div className="geoZone-item__list">*/}
              {/*<p>Время въезда — выезда техники в геозону <span>9:07 — 14:21</span></p>*/}
              {/*<p>Время нахождения техники в геозоне <span>5:14</span></p>*/}
              {/*<p>Средняя скорость движения <span>17.8 км/ч</span></p>*/}
              {/*<p>Средняя скорость движения при уборке <span>14.2 км/ч</span></p>*/}
              {/*<p>Не учитывать движение рядом с границей <span>5 метров</span></p>*/}
              {/*<p>Средняя нагрузка двигателя <span>47 %</span></p>*/}
              {/*<p>Производительность <span>0.7 тонн/га</span></p>*/}
              {/*<p>Расходы топлива <span>447 литров</span></p>*/}
              {/*</div>*/}
            </div>
          ) : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}