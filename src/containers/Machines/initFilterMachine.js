import React from "react";

export const InitFilter = ComposedComponent => class extends React.Component {
  constructor() {
    super();
    this.state = {
      filter: [],
      result: [],
      filtration: false,
    };
    this.onStartFilter = this.onStartFilter.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.searchParameters = this.searchParameters.bind(this);
    this.deleteParameters = this.deleteParameters.bind(this);
  }

  componentDidMount() {
    this.searchParameters(this.props.users.get("users"));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.users.get("users").toJS().length !== this.props.users.get("users").toJS().length) {
      this.searchParameters(nextProps.users.get("users"));
    }
  }

  searchParameters(users) {
    const filter = [
      {
        id: 1,
        type: "checkbox",
        section: "status",
        name: "Cтатус",
        items: [],
        labels: [],
        result: [],
      },
      {
        id: 2,
        type: "checkbox",
        section: "type",
        name: "Тип машины",
        items: [],
        result: [],
      },
      {
        id: 3,
        type: "checkbox",
        section: "main",
        name: "Хозяйство",
        items: [],
        result: [],
      },
      {
        id: 4,
        type: "checkbox",
        section: "notification",
        name: "Уведомления",
        items: [],
        result: [],
        labels: []
      }
    ];

    users.map((user) => {
      user.units.units.map((unit) => {
        if (!filter[0].items.filter((status) => status === unit.data.STATUS.value).length) {
          filter[0].items.push(unit.data.STATUS.value);
          filter[0].labels.push(unit.data.STATUS.valueF);
        }
        if (!filter[1].items.filter((typeName) => typeName === unit.typeName).length) {
          filter[1].items.push(unit.typeName);
        }
        if (unit.data.MESSAGES){
          unit.data.MESSAGES.map((message) => {
            if(!filter[3].items.filter((status) => status === message.status).length) {
              if (message.status === 4) {
                filter[3].items.push(message.status);
                filter[3].labels.push("Критические");
              } else if (message.status === 2) {
                filter[3].items.push(message.status);
                filter[3].labels.push("Важные");
              }
            }
          });
        }
      });
      if(!filter[2].items.find((name) => name === user.name) !== undefined){
        filter[2].items.push(user.name);
      }
    });

    const sortFilter = filter.filter((item) => item.items.length >= 1);
    this.setState({filter: sortFilter});
  }

  onStartFilter(section, value) {
    if (this.state.filter
        .find((item) => item.section === section).result
        .find((item) => item === value) !== undefined) {
      this.setState(prevState => {
        const findSection = prevState.filter.find((item) => item.section === section);
        findSection.result = findSection.result.filter((item) => item !== value);
      }, () => this.onFilter(this.state, section));
    } else {
      this.setState(prevState => {
        const findSection = prevState.filter.find((item) => item.section === section);
        findSection.result = [...findSection.result, value];
      }, () => this.onFilter(this.state, section));
    }
  }

  onFilter(state) {
    let result = [];
    if (state.filter.find((item) => item.result.length !== 0)) {
      this.setState({filtration: true});
    } else {
      this.setState({filtration: false});
    }
    const newUser = this.props.users.get("users");
    newUser.map((item) => {
      item.units.units.map((it) => {
        it.section = item.name;
      });
    });
    newUser.map((user) => {
      const parameters = state.filter.filter((item) => item.result.length);
      const findUnits = user.units.units.filter((unit) => {
        const bolResult = [];
        parameters.map((param) => {
          switch (param.section) {
            case "status": {
              if (state.filter.find((item) => item.section === "status").result.length) {
                bolResult[0] = param.result.includes(unit.data.STATUS.value);
              }
            }
            case "type": {
              if (state.filter.find((item) => item.section === "type").result.length) {
                bolResult[1] = param.result.includes(unit.typeName);
              }
            }
            case "main": {
              if (state.filter.find((item) => item.section === "main").result.length) {
                bolResult[2] = param.result.includes(unit.section);
              }
            }
            case "notification": {
              if (state.filter.find((item) => item.section === "notification") && state.filter.find((item) => item.section === "notification").result.length) {
                if (unit.data.MESSAGES) {
                  bolResult[3] = param.result.find((p) => unit.data.MESSAGES.find((messages) => messages.status === p) !== undefined) !== undefined;
                } else {
                  bolResult[3] = false;
                }
              }
            }
            default: {
            }
          }
        });
        return !bolResult.includes(false);
      });
      result = [...result, ...findUnits];
      this.setState({result});
    });
  }

  deleteParameters(section, value) {
    this.setState(prevState => {
      const findSection = prevState.filter.find((item) => item.section === section);
      findSection.result = findSection.result.filter((item) => item !== value);
      return prevState;
    }, () => {
      if (!this.state.filter.find((item) => item.result.length)) {
        this.setState({filtration: false});
      }
    });
  }

  clearFilter() {
    this.searchParameters();
    this.setState({
      result: [],
      filtration: false,
    });
  }

  render() {
    return (
      <ComposedComponent
        {...this.props}
        filtration={this.state.filtration}
        result={this.state.result}
        filter={this.state.filter}
        onStartFilter={this.onStartFilter}
        clearFilter={this.clearFilter}
        deleteParameters={this.deleteParameters}
      />
    );
  }
};