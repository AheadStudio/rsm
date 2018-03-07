import React from "react";
import DayPickerRangeControllerWrapper from "../Pickers/rangeDate";
import {Plus} from "../Filter/filterControl";
import {Spin} from 'antd';
import {successMarkers, succesTrack, trackGeoZone} from "../../queries/socket";
import {connect} from "react-redux";
import moment from "moment/moment";
import {setTime, showTrack, startLoadTrack} from "../../reducers/actions/users";

@connect(
  null,
  dispatch=>({
    showTrack: (track) => dispatch(showTrack(track)),
    setTime: (data) => dispatch(setTime(data)),
    startLoadTrack: (id) => dispatch(startLoadTrack(id)),
  })
)
export default class ControlTime extends React.Component {
  constructor(){
    super();
    this.state = {
      openDate: false,
    };
    this.onDay = this.onDay.bind(this);
    this.onWeek = this.onWeek.bind(this);
    this.dateRange = this.dateRange.bind(this);
  }

  onDay() {
    this.setState({timeZone: "day"}, () => {
      this.props.showTrack(this.props.id);
      this.props.clearType();
      this.props.setTime({id: this.props.id, time: "Суточные данные"});
      setTimeout(() => {
        this.props.centerTrack();
      }, 0);
      trackGeoZone({
        id: this.props.id,
        from: `${moment().format("YYMMDD")}000000000`,
        to: moment().format("YYMMDDHHmmss000"),
      });
      successMarkers({
        id: this.props.id,
        from: `${moment().format("YYMMDD")}000000000`,
        to: moment().format("YYMMDDHHmmss000"),
      });
    });
  }

  onWeek() {
    const date = {
      week: true,
      id: this.props.id,
      from: `${moment(moment().valueOf() - 604800000).format("YYMMDD")}000000000`,
      to: moment().format("YYMMDDHHmmss000"),
    };
    this.props.clearType();
    this.props.setTime({id: this.props.id, time: `${moment(moment().valueOf() - 604800000).format("DD.MM.YY")} - ${moment().format("DD.MM.YY")}`});
    this.props.startLoadTrack(this.props.id);
    succesTrack(date);
    trackGeoZone({
      id: this.props.id,
      from: `${moment(moment().valueOf() - 604800000).format("YYMMDD")}000000000`,
      to: moment().format("YYMMDDHHmmss000"),
    });
    successMarkers({
      id: this.props.id,
      from: `${moment(moment().valueOf() - 604800000).format("YYMMDD")}000000000`,
      to: moment().format("YYMMDDHHmmss000"),
    });
  }

  dateRange(date) {
    this.props.clearType();
    const from = `${date[0].date.format("YYMMDD").toString()}${date[0].time.hourse}${date[0].time.minute}00000`;
    const to = moment(date[1].date.valueOf() - 500).format("YYMMDDHHmmss000");
    this.props.setTime({id: this.props.id, time: `${date[0].date.format("DD.MM.YY").toString()} - ${moment(date[1].date.valueOf() - 500).format("DD.MM.YY")}`});
    this.props.startLoadTrack(this.props.id);
    succesTrack({time: date, id: this.props.id});
    this.setState({
      openDate: false,
    });
    trackGeoZone({
      id: this.props.id,
      from: from,
      to: to,
    });
    successMarkers({
      id: this.props.id,
      from: from,
      to: to,
    });
  }

  render(){
    return (
      <div className="tracking-machine__panel">
        <div className="tracking-machine__date">
          <p>Трек:</p>
          {this.props.data.TRACK_HARVEST.length ? (
            <button
              onClick={() => this.onDay()}
            >Сутки
            </button>
          ) : null}
          <button onClick={() => this.onWeek()}>Неделя</button>
          <button onClick={() => this.setState({openDate: !this.state.openDate})}>Выбрать даты <Plus/>
          </button>
          {this.props.loadTrack ? <Spin/> : null}
        </div>
        {this.state.openDate ?
          <div className="tracking-machine__date-open"><DayPickerRangeControllerWrapper
            applyDate={(e) => this.dateRange(e)}
          /></div> :
          null}
      </div>
    );
  }
}