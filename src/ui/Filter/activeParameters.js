import React from "react";
import moment from "moment";
import PropTypes from 'prop-types';

const Item = ({item, deleteItem, name, section}, context) => (
  <div className="filter-result">
    <p>{name}</p>
    <span
      className="filter-result__delete"
      tabIndex="0"
      role="button"
      onClick={() => context.onStartFilter(section, item)}
    />
  </div>
);

export const Col = ({type, result, deleteItem, items, labels, section, name}) => (
  <div className="filter-control__result-col">
    {result && (
        <div>
          <div className="filter-control__result-col-name">{name}</div>
          <div className="filter-result_container">
            {result.map((item) => {
              let name = "";
              if (labels) {
                const index = items.findIndex((it) => it == item);
                name = labels[index];
              } else {
                name = item;
              }
              if (type === "date-solo") {
                name = moment(item.to, "YYMMDDHHmmss000").format("DD.MM.YY");
              }
              if (type === "date") {
                name = `${moment(item.from, "YYMMDDHHmmss000").format("DD.MM.YY")} - ${moment(item.to, "YYMMDDHHmmss000").format("DD.MM.YY")}`;
              }
              if (type === "checkbox-machine" || type === "radio-machine") {
                name = item.name;
              }
              return (
                <Item
                  key={item.id ? "result" + section + item.id : "result" + section + item}
                  item={item}
                  section={section}
                  name={name}
                  deleteItem={deleteItem}
                />
              );
            })}
          </div>
        </div>
    )}
  </div>
);

export const WrapActiveParameters = (props, context) => (
  <div className="filter-control__result">
    <div className="filter-control__result-wrap">
      {props.children}
    </div>
    <div className="filter-control__result-clear">
      {props.disableButtonClear ?
        <p
          tabIndex="0"
          role="button"
          onClick={() => context.clearFilter()}
        >Очистить фильтры</p> : null}
    </div>
  </div>
);

Item.contextTypes = {
  onStartFilter: PropTypes.func,
  deleteParameters: PropTypes.func,
};

WrapActiveParameters.contextTypes = {
  clearFilter: PropTypes.func
};
