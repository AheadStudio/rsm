import React from "react";
import {link} from "../../router";
import {connect} from "react-redux";
import TrackingItem from "../../ui/Tracking/item";
import {centerMap} from "../../reducers/actions/map";

@connect(
  null,
  dispatch => ({
    centerMap: (data) => dispatch(centerMap(data)),
  }))
export default class Households extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      findHouseholds: [],
      activeSearch: false,
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.searchHousehold = this.searchHousehold.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.get('users').toJS().length !== this.props.users.get('users').toJS().length) {
      if (nextProps.location.query && nextProps.location.query.machine) {
        this.setState({
          search: nextProps.location.query.machine,
        }, () => this.setStateSearch());
      }
    }
  }

  componentDidMount() {
    if (this.props.location.query && this.props.location.query.machine) {
      this.setState({
        search: this.props.location.query.machine,
      }, () => this.setStateSearch());
    }
  }

  onChangeSearch(e) {
    this.setState({
      search: e.target.value,
    }, () => this.setStateSearch());
  }

  setStateSearch() {
    if (this.state.search) {
      this.setState({activeSearch: true});
      this.searchHousehold();
    } else {
      this.props.router.push(link.households);
      this.setState({activeSearch: false});
    }
  }

  searchHousehold() {
    const findUsers = this.props.users.get('users').toJS();
    const households = [];
    findUsers.map((user) => {
      const findMachine = user.units.units.filter(((machine) => machine.typeName.toLowerCase().includes(this.state.search.toLowerCase()) || machine.name.toLowerCase().includes(this.state.search.toLowerCase())));
      if (findMachine) {
        households.push({
          ...user,
          units: {
            units: findMachine,
          }
        });
      }
      if (findMachine.length === 1) {
        this.props.centerMap([findMachine[0].data.LATITUDE.value, findMachine[0].data.LONGITUDE.value]);
      }
      this.setState({
        findHouseholds: households,
      });
    });
  }

  render() {
    return (
      <div>
        <div className="tracking-page__search">
          <input
            type="text"
            className="tracking-page__input"
            placeholder="Поиск хозяйств и машин"
            value={this.state.search}
            onChange={(e) => this.onChangeSearch(e)}
          />
          <button
            className="tracking-page__button"
          />
        </div>
        <div className="tracking-page__items">
          {!this.state.search ?
            this.props.users.get("users").map((item) =>
              <TrackingItem
                open={false}
                key={`static-${item.id}`}
                {...item}
              />
            ) : this.state.findHouseholds.map((item) =>
              <TrackingItem
                open={true}
                key={`search-${item.id}`}
                {...item}
              />)
          }
        </div>
      </div>
    );
  }
}