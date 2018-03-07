import React from "react";
import { withTranslate } from "react-redux-multilingual";
import { Link } from "react-router";
import { link } from "../../router";

const Watch = (props) => {
  const { pathname } = props.location;
  return (
    <div className="watch">
      <div className="content__title">
        <h1>{props.translate("watch")}</h1>
      </div>
      <div className="watch__navigations">
        <Link to={link.watchTime} className={(pathname === link.watchTime || pathname === link.watch) && "active"}>Время</Link>
        <Link to={link.watchFueling} className={pathname === link.watchFueling && "active"}>Сливы / Заправки</Link>
        <Link to={link.watchPerformanceIndicators} className={pathname === link.watchPerformanceIndicators && "active"}>Показатели работы</Link>
        <Link to={link.watchMachineReports} className={pathname === link.watchMachineReports && "active"}>Отчёт по машине</Link>
        <Link to={link.watchCleaning} className={pathname === link.watchCleaning && "active"}>Уборка</Link>
        <Link to={link.watchUnloading} className={pathname === link.watchUnloading && "active"}>Выгрузки</Link>
        <Link to={link.watchExport} className={pathname === link.watchExport && "active"}>Экспорт</Link>
      </div>
      {props.children}
    </div>
  );
};

export default withTranslate(Watch);