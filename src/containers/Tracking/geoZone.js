import React from "react";
import GeoZoneItem from "./geoZoneItem";

export default class GeoZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      findGeoZone: [],
      activeSearch: false,
    };
    this.onChangeSearch = this.onChangeSearch.bind(this);
  }

  onChangeSearch(e) {
    this.setState({
      search: e.target.value,
    }, () => this.setStateSearch());
  }

  setStateSearch() {
    if (this.state.search) {
      this.setState({activeSearch: true});
      this.searchGeoZone();
    } else {
      this.setState({activeSearch: false});
    }
  }

  searchGeoZone() {
    this.setState({
      findGeoZone: this.props.geoZone.get("static").filter((geoZone) => geoZone.name.toLowerCase().includes(this.state.search.toLowerCase()))
    });
  }

  render() {
    return (
      <div className="geoZone">
        <div className="tracking-page__search">
          <input
            type="text"
            className="tracking-page__input"
            placeholder="Поиск геозоны"
            value={this.state.search}
            onChange={(e) => this.onChangeSearch(e)}
          />
          <button
            className="tracking-page__button"
          />
        </div>
        {this.state.activeSearch ?
          this.state.findGeoZone.map((item) => <GeoZoneItem key={item.id} {...item} />) :
          <div>
            {this.props.geoZone.get("newGeoZone") ?
              <GeoZoneItem
                default={false}
                setGeoZone={this.props.setGeoZone}
                key={this.props.geoZone.get("newGeoZone").zone.id}
                name={this.props.geoZone.get("newGeoZone").name || "Новая геозона"}
                {...this.props.geoZone.get("newGeoZone").zone}
              /> : null}
            {this.props.geoZone.get("static").map((item) =>
              <GeoZoneItem
                default={true}
                setGeoZone={this.props.setGeoZone}
                key={item.id}
                {...item}
              />
            )}
          </div>
        }
      </div>
    );
  }
}