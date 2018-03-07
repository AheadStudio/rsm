import React from "react";
import moment from "moment";
import MapDetailMachine from "../../ui/Map/mapUnit";
import {connect} from "react-redux";
import {activeWatch} from "../../reducers/actions/users";
import {succesDetail} from "../../queries/socket";
import {Calendar} from 'react-date-range';
import {Spin} from "antd";
import {link} from "../../router";
import {Link} from "react-router";

const progresColor = {
  shadow: "shadow",
  red: "red",
  yellow: "yellow",
  green: "green",
};

@connect(state => ({
    users: state.users.get("users"),
  }),
  dispatch => ({
    activeWatch: (id) => dispatch(activeWatch(id))
  })
)
export default class MachineDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: null,
      data: null,
      openDate: false,
      load: false,
      trackStatic: true,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  componentDidMount() {
    const idMachine = this.props.location.query.machine;
    if (idMachine) {
      this.loadData(this.props.users.toJS(), idMachine);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query.machine !== this.props.location.query.machine) {
      this.loadData(nextProps.users.toJS(), nextProps.location.query.machine);
    }
    if (nextProps.users.toJS() !== this.props.users.toJS()) {
      if (nextProps.location.query.machine) {
        this.loadData(nextProps.users.toJS(), nextProps.location.query.machine);
      }
    }
  }

  loadData(users, idMachine) {
    users.map((user) => {
      const findUnit = user.units.units.find((unit) => unit.id == idMachine);
      if (findUnit) {
        this.setState({
          data: findUnit,
          load: false,
        }, () => {
          if (!this.state.data.detailData) {
            this.setState({load: true});
            succesDetail({
              id: findUnit.id,
              from: `${moment().format("YYMMDD")}000000000`,
              to: moment().format("YYMMDDHHmmss000"),
            });
          }
        });
      }
    });
  }

  handleSelect(date) {
    this.setState({
      day: date,
    });
  }

  setDate(date) {
    if (date.format("YYMMDD") === moment().format("YYMMDD")) {
      this.setState({trackStatic: true});
    }
    succesDetail({
      id: this.state.data.id,
      from: `${date.format("YYMMDDHHmmss000")}`,
      to: `${date.format("YYMMDD")}235959000`,
    });
    this.setState({
      openDate: false,
      load: true,
      trackStatic: false,
    });
  }

  render() {
    const {data} = this.state;

    let color, FUEL = 0, DETAIL_DATA = [];

    if (data) {
      if (data.data.FUEL && data.data.FUEL.value) {
        data.data.FUEL.measure === "л" ?
          FUEL = (data.data.FUEL.max / data.data.FUEL.value).toFixed(1) :
          FUEL = data.data.FUEL.value.toFixed(1);
      }
      if (data.detailData) {
        for (let key in data.detailData) {
          if (key !== "TRACK_HARVEST" && key !== "TRACK_LOAD" && key !== "TRACK_SPEED") {
            DETAIL_DATA = [...DETAIL_DATA, data.detailData[key]];
          }
        }
      }
      if (FUEL === 0) {
        color = progresColor.shadow;
      } else if (FUEL <= 20 && FUEL !== 0) {
        color = progresColor.red;
      } else if (FUEL <= 60 && FUEL > 20) {
        color = progresColor.yellow;
      } else {
        color = progresColor.green;
      }
    }

    return (
      <div className="machine-detail">
        <div className="machine-detail__top">
          <p onClick={() => this.setState({openDate: !this.state.openDate})}>Задать дату</p>
          {this.state.openDate ?
            <div className="machine-detail__top-time">
              <Calendar
                lang="ru"
                onInit={this.handleSelect}
                onChange={this.setDate}
              />
            </div>
            : null
          }
          {this.state.load ? <Spin/> : null}
        </div>
        {data ? (
          <div>
            <div className="machine-detail__info">
              <div className="machine-detail__info-left">
                <div className="detail-main">
                  <div className="detail-main__top">
                    <p>{data.typeName}</p><span>{data.name}</span>
                  </div>
                  <div className="detail-main__wrap">
                    <div
                      className="detail-main__pich"
                    >
                      <img src={`${process.env.PUBLIC_URL}/img/jpg/${data.typeName}.jpg`} alt=""/>
                    </div>
                    <div className="detail-main__data">
                      <div className="detail-main__data-item">
                        <div className="detail-main__data-item-left">
                          <div className="detail-main__data-icon">
                            <div className="detail-main__data-fiel">
                              <div className={`detail-main__data-fiel-progres ${color}`} style={{height: `${FUEL}%`}}/>
                            </div>
                          </div>
                          <p>Топливо</p>
                        </div>
                        <p>{FUEL}%</p>
                      </div>
                      <div className="detail-main__data-item">
                        <div className="detail-main__data-item-left">
                          <div className="detail-main__data-icon">
                            <div className={`detail-main__data-work color-${data.data.STATUS.value}`}/>
                          </div>
                          <p>Статус</p>
                        </div>
                        <p>{data.data.STATUS.valueF}</p>
                      </div>
                      <div className="detail-main__data-item">
                        <div className="detail-main__data-item-left">
                          <div className="detail-main__data-icon">
                            <Link
                              to={`${link.households}?machine=${this.state.data.typeName}`}
                              onClick={() => this.props.activeWatch(data.id)}
                              className={data.watch ? "detail-main__data-watch watch" : "detail-main__data-watch"}
                            />
                          </div>
                          <p>Слежение</p>
                        </div>
                        <p>{data.watch ? "активно" : "не активно"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="machine-detail__info-right">
              </div>
            </div>
            <div className="map-detail">
              {!this.state.load && this.state.trackStatic ? <MapDetailMachine unit={data} track={data.data && data.data.TRACK_HARVEST ? data.data.TRACK_HARVEST : []} static={true} /> :
                !this.state.load && !this.state.trackStatic ? <MapDetailMachine unit={data} track={data.detailData && data.detailData.TRACK_HARVEST ? data.detailData.TRACK_HARVEST : []} static={false} />  :
                  <MapDetailMachine unit={{}} track={[]} static={false} />
              }
            </div>
            <div className="detail-data">
              {DETAIL_DATA.map((item, index) => {
                return <div className="detail-data__list" key={index}><span>{item.name}</span><span>{item.valueF}</span>
                </div>;
              })}
            </div>
          </div>
        ) : (
          <div className="machine-detail__error"><p>Нет данных</p></div>
        )}
      </div>
    );
  }
}