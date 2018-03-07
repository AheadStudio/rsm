import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import ResultItem from "./item";


class FilterResult extends React.Component {
  render() {
    return(
      <div className="result-filter">
        <div className="result-filter__size">
          <span className="result-filter__size-text">Найдено:</span>
          <span className="result-filter__size-number">{this.props.number}</span>
        </div>
        <div className="result-filter__list">
          <table className="result-table">
            <thead>
            <tr>
              <th><span>Машина</span></th>
              <th><span>Запуск ДВС</span></th>
              <th><span>Последние данные</span></th>
              <th><span>Активность</span></th>
              <th className="col-text-full"><span>Текущая скорость</span></th>
              <th className="col-text-full"><span>Cкорость комб.</span></th>
              <th className="col-text-full"><span>Расход топлива</span></th>
              <th className="col-text-full"><span>Убранная площадь</span></th>
              <th className="col-text-full"><span>Производ.</span></th>
              <th className="col-text-full"><span>Слежение</span></th>
            </tr>
            </thead>
            {this.props.filtration ? (
              <tbody>
                {this.props.result.map((item) => <ResultItem key={`${item.id}${item.name}`} {...item} />)}
              </tbody>
            ) : (
              <tbody>
                {this.props.users.get("users").map((item) => item.units.units.map((it) => <ResultItem key={`${it.id}${it.name}`} {...it} />))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    );
  }
}

FilterResult.propTypes = {
  users: ImmutablePropTypes.map,
};

export default FilterResult;