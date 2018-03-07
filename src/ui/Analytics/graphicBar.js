import React from "react";
import AnalyticGraphic from "../Graphic/analytic";
import moment from "moment/moment";

const AnalyticGraphicBar = (props) => (
  <div className="analytic-bar">
    <div className="analytic-bar__top">
      <p>Анализ рабочего времени <span>{moment(props.report.toJS()[0].modesByUnits[0].period.from, "YYMMDDHHmmss000").format("DD.MM.YY")} — {moment(props.report.toJS()[0].modesByUnits[0].period.to, "YYMMDDHHmmss000").format("DD.MM.YY")}</span></p>
      <div className="analytic-bar__info">
        <p className="green">Комбайнирование</p>
        <p className="blue">Дорожный режим</p>
        <p className="red">Простой с вкл. двигателем</p>
      </div>
    </div>
    <div className="analytic-bar__body">
      <AnalyticGraphic
        report={props.report}
      />
    </div>
  </div>
);

export default AnalyticGraphicBar;
