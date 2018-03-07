import React from "react";
import FilterRadio from "./radio";
import FilterDate from "./date";
import FilterCheckbox from "./checkbox";
import FilterItemMulty from "./myltyCheckbox";
import FilterDateSolo from "./dateSolo";
import PropTypes from 'prop-types';
import {Col, WrapActiveParameters} from "./activeParameters";
import FilterItemMultiRadio from "./myltiRadio";

export const Plus = () => (
  <svg width={16} height={16} viewBox={"0 0 16 16"} version={"1.1"}>
    <g id="Canvas" transform={"translate(-3610 -468)"}>
      <g id="Group 6 Copy">
        <g id="Rectangle-6">
          <use xlinkHref="#path0_fill" transform={"translate(3610 468)"} fill={"#dedede"}/>
        </g>
        <g id="Rectangle-7">
          <use xlinkHref="#path1_fill" transform={"translate(3613 475)"} fill={"#FFFFFF"}/>
        </g>
        <g id="Rectangle-7">
          <use xlinkHref="#path1_fill" transform={"matrix(6.12323e-17 1 -1 6.12323e-17 3619 471)"} fill={"#FFFFFF"}/>
        </g>
      </g>
    </g>
    <defs>
      <path id="path0_fill" fillRule={"evenodd"}
            d="M 0 8C 0 3.58172 3.58172 0 8 0C 12.4183 0 16 3.58172 16 8C 16 12.4183 12.4183 16 8 16C 3.58172 16 0 12.4183 0 8Z"/>
      <path id="path1_fill" fillRule={"evenodd"}
            d="M 0 1C 0 0.447715 0.447715 0 1 0L 9 0C 9.55228 0 10 0.447715 10 1C 10 1.55228 9.55229 2 9 2L 1 2C 0.447715 2 0 1.55228 0 1Z"/>
    </defs>
  </svg>
);

const FilterWrapControl = (props) => {
  const childrenWithProps = React.Children.map(props.children, (child) => React.cloneElement(child, {item: child.props.item}));
  return (
    <div className="filter-control__parameters">
      <div className="filter-control__items">
        {childrenWithProps}
      </div>
      {props.button ? !props.disableButton && !props.shadowButton ? (
          <div
            onClick={() => props.onFilter(props.filter)}
            className="filter-control__succes">
            Принять
          </div>
        ) :  (
        <div
          className="filter-control__succes shadow"
        >
          Принять
        </div>
      ) : null}
    </div>
  );
};

export default class FilterControl extends React.Component {
  getChildContext() {
    return {
      onStartFilter: this.props.onStartFilter,
      clearFilter: this.props.clearFilter,
      deleteParameters: this.props.deleteParameters,
    };
  }

  render() {
    return (
      <div className="filter-control">
        <FilterWrapControl
          button={this.props.button}
          onFilter={this.props.onFilter}
          filter={this.props.filter}
          shadowButton={this.props.shadowButton}
        >
          {this.props.filter.map((item, index) => {
            switch (item.type) {
              case "checkbox":
                if (item.items.length >= 1) {
                  return <FilterCheckbox
                    {...item}
                    key={item.section}
                  />;
                } else {
                  return <div
                    key={item.section}
                  />;
                }
              case "date":
                return <FilterDate
                  {...item}
                  week={this.props.week}
                  key={item.section}
                />;
              case "date-solo":
                return <FilterDateSolo
                  key={index}
                  {...item}
                />;
              case "checkbox-machine":
                return <FilterItemMulty
                  {...item}
                  key={item.section}
                />;
              case "radio-machine":
                return <FilterItemMultiRadio
                  {...item}
                  key={item.section}
                />;
              case "radio":
                return <FilterRadio
                  {...item}
                  key={item.section}
                />;
              default:
                return null;
            }
          })}
        </FilterWrapControl>
        <WrapActiveParameters
          disableButtonClear={this.props.filter.find((item) => item.result.length)}
        >
          {this.props.filter.map((item) =>
            <Col
              key={`Result-${item.section}`}
              {...item}
              deleteItem={this.props.deleteItem}
            />
          )}
        </WrapActiveParameters>
      </div>
    );
  }
}

FilterControl.childContextTypes = {
  onStartFilter: PropTypes.func,
  onFilter: PropTypes.func,
  clearFilter: PropTypes.func,
  deleteParameters: PropTypes.func,
};