import React from "react";
import PropTypes from "prop-types";
import ItemMachine from "./itemMachine";

class ListMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list.units,
    };
    this.sortList = this.sortList.bind(this);
  }

  componentDidMount() {
    this.sortList(this.props.list.units);
  }

  componentWillReceiveProps(nextProps) {
    this.sortList(nextProps.list.units);
  }

  sortList(list) {
    const arraySort = [...list];
    this.setState({
      list: arraySort.sort((a) => {
        if (a.track && a.track.activeTrack) {
          return -2;
        } else if (a.data.STATUS.value) {
          return -1;
        } else {
          return 1;
        }
      })
    });
  }

  render() {
    return (
      <div className="tracking-item__machines">
        {this.state.list.map((item) => <ItemMachine item={item} {...item} key={item.id}/>)}
      </div>
    );
  }
}

ListMachine.PropTypes = {
  list: PropTypes.array,
};

export default ListMachine;