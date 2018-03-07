import React from "react";
import {connect} from "react-redux";

const InitFilter = (data) => {
  return (ComposedComponent) => {
    return @connect(
      state => ({
        users: state.users.get("users").toJS(),
      })
    )
    class HOCFilter extends React.Component {
      constructor() {
        super();
        this.state = {
          filter: data.default,
          filtration: false,
          shadowButton: true
        };
        this.onStartFilter = this.onStartFilter.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.deleteParameters = this.deleteParameters.bind(this);
        this.validateFilter = this.validateFilter.bind(this);
      }

      componentDidMount() {
        this.getMultiCheckbox(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.users !== this.props.users) {
          this.getMultiCheckbox(nextProps);
        }
      }

      getMultiCheckbox(props) {
        const findMulti = data.default.find((item) => item.type === "checkbox-machine" || item.type === "radio-machine");
        if (findMulti) {
          const parameters = [];
          if (findMulti.filter && findMulti.filter === "FUEL.l") {
            props.users.map((user) => {
              const itemUser = {
                name: user.name,
                id: user.id,
                units: [],
              };
              user.units.units
                .filter((unit) => {
                  if (unit.data.FUEL && unit.data.FUEL.measure === "л") {
                    return true;
                  }
                })
                .map((unit) => {
                const itemUnit = {
                  id: unit.id,
                  name: unit.name,
                  typeName: unit.typeName,
                };
                itemUser.units = [...itemUser.units, itemUnit];
              });
              parameters.push(itemUser);
            });
          } else {
            props.users.map((user) => {
              const itemUser = {
                name: user.name,
                id: user.id,
                units: [],
              };
              user.units.units.map((unit) => {
                const itemUnit = {
                  id: unit.id,
                  name: unit.name,
                  typeName: unit.typeName,
                };
                itemUser.units = [...itemUser.units, itemUnit];
              });
              parameters.push(itemUser);
            });
          }
          this.setState(prevState => {
            const findStateMulti = prevState.filter.find((item) => item.type === "checkbox-machine" || item.type === "radio-machine");
            findStateMulti.items = parameters;
            return prevState;
          });
        }
      }


      onStartFilter(section, value, solo) {
        if (section === "time") {
          if (this.state.filter
              .find((item) => item.section === section).result
              .find((item) => item === value) !== undefined) {
            this.setState(prevState => {
              const findSection = prevState.filter.find((item) => item.section === section);
              findSection.result = [];
            }, () => this.validateFilter());
          } else {
            this.setState(prevState => {
              const findSection = prevState.filter.find((item) => item.section === section);
              findSection.result = [value];
            }, () => this.validateFilter());
          }
        } else if (section === "machine") {
          if (this.state.filter
              .find((item) => item.section === section).result
              .find((item) => item.id === value.id) !== undefined) {
            this.setState(prevState => {
              const findSection = prevState.filter.find((item) => item.section === section);
              if (solo) {
                findSection.result = [];
              } else {
                findSection.result = findSection.result.filter((item) => item.id !== value.id);
              }
            }, () => this.validateFilter());
          } else {
            this.setState(prevState => {
              const findSection = prevState.filter.find((item) => item.section === section);
              if (solo) {
                findSection.result = [value];
              } else {
                findSection.result = [...findSection.result, value];
              }
            }, () => this.validateFilter());
          }
        } else {
          if (this.state.filter
              .find((item) => item.section === section).result
              .find((item) => item === value) !== undefined) {
            this.setState(prevState => {
              const findSection = prevState.filter.find((item) => item.section === section);
              findSection.result = findSection.result.filter((item) => item !== value);
            }, () => this.validateFilter());
          } else {
            this.setState(prevState => {
              const findSection = prevState.filter.find((item) => item.section === section);
              findSection.result = [...findSection.result, value];
            }, () => this.validateFilter());
          }
        }
      }

      validateFilter() {
        const findNoValidate = this.state.filter.find((item) => {
          return item.validate && !item.result.length;
        });
        if (!findNoValidate) {
          this.setState({
            shadowButton: false,
          });
        }
      }

      onFilter(state) {
        const parameters = {};
        state.map((item) => {
          parameters[item.section] = item.result;
        });
        this.props.dispatch(data.callback(parameters));
        // if (data.report) {
        //   this.props.startLoadReport(data.report);
        // }
        // data.callback(parameters)
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
        this.props.dispatch(data.clear());
        this.setState(prevState => {
          prevState.filter.map((item) => {
            item.result = [];
          });
          return prevState;
        });
      }

      render() {
        return (
          <ComposedComponent
            {...this.props}
            shadowButton={this.state.shadowButton}
            filtration={this.state.filtration}
            filter={this.state.filter}
            onFilter={this.onFilter}
            onStartFilter={this.onStartFilter}
            clearFilter={this.clearFilter}
            deleteParameters={this.deleteParameters}
          />
        );
      }
    };
  };
};

export default InitFilter;