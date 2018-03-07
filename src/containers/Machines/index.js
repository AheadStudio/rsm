import React from "react";
import FilterControl from "../../ui/Filter/filterControl";
import FilterResult from "../../ui/Machines/result";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { InitFilter } from "./initFilterMachine";

@connect(state => ({
  users: state.users,
}))
@withTranslate
@InitFilter
export default class Machines extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: props.filter
    };
    this.getDefaultHouseholds = this.getDefaultHouseholds.bind(this);
  }

  componentDidMount(){
    this.setState({
      filter: this.props.filter,
    });
    if(this.props.location.query && this.props.filter.length) {
      this.getDefaultHouseholds(this.props);
      this.getDefaultActive(this.props);
      this.getDefaultNotification(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.filter.length !== this.props.filter.length && nextProps.filter.length) {
      this.setState({
        filter: nextProps.filter,
      });
      this.getDefaultHouseholds(nextProps);
      this.getDefaultActive(nextProps);
      this.getDefaultNotification(nextProps);
    }
  }

  getDefaultHouseholds(props) {
    if(props.location.query.households && props.filter[2].items.length > 1) {
      const searchHouseholds = props.users.get("users").find((user) => user.id == props.location.query.households);
      if(searchHouseholds) {
        this.props.onStartFilter("main", searchHouseholds.name);
      }
    }
  }

  getDefaultNotification(props) {
    if(props.location.query.notification && props.filter[3] && props.filter[3].items.length >= 1) {
      this.props.onStartFilter("notification", Number(props.location.query.notification));
    }
  }

  getDefaultActive(props) {
    if(props.location.query.active && props.filter[0].items.length > 1) {
      const activeStatus = props.filter[0].items.filter((status) => status);
      activeStatus.map((status) => {
        this.props.onStartFilter("status", status);
      });
    }
  }

  render() {
    let number = 0;
    let filterNumber = 0;
    this.props.users.get("users").map((user) => {
      number = number + user.units.units.length;
    });
    if (this.props.filtration) {
      filterNumber = this.props.result.length;
    } else {
      this.props.users.get("users").map((user) => {
        filterNumber = filterNumber + user.units.units.length;
      });
    }
    let showFilter = false;
    this.props.filter.find((item) => item.items.length) !== undefined ?
      showFilter = true :
      showFilter = false;
    return (
      <div>
        <div className="content__title">
          <h1>{this.props.translate("myMachines")}</h1><p>{number}</p>
        </div>
        <div className="machine-filter">
          {showFilter ? (
            <div className="machine-filter__control">
              <FilterControl
                onStartFilter={this.props.onStartFilter}
                clearFilter={this.props.clearFilter}
                deleteParameters={this.props.deleteParameters}
                filter={this.state.filter}
              />
            </div>
          ) : null}
          <div className="machine-filter__result">
            <FilterResult
              number={filterNumber}
              filtration={this.props.filtration}
              result={this.props.result}
              users={this.props.users}
              filterNumber={filterNumber}
            />
          </div>
        </div>
      </div>
    );
  }
}