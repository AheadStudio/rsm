import React from "react";
import Chart from "chart.js";

const colorSections = {
  red: "#D10B41",
  green: "#78C800",
  black: "#202020",
  blue: "#06AAF5",
  shadow: "#E8E8E8",
};

export default class Graphic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      values: [],
      colors: [],
      graphic: null,
    };
  }
  componentWillMount() {
    this.loadGraphic(this.props.graphic);
  }
  componentDidMount() {
    const ctx = this.graphic.getContext("2d");
    this.setState({
      graphic: new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [{
            data: this.state.values,
            backgroundColor: this.state.colors,
            borderWidth: 0,
          }],
        },
        options: {
          cutoutPercentage: 70,
        },
      }),
    });
  }
  loadGraphic(parameters) {
    const parameterGraphic = {
      values: [],
      colors: [],
      startValue: 0,
      maxValue: 100,
    };
    parameters.map((item) => {
      parameterGraphic.values.push(item.value);
      parameterGraphic.startValue = parameterGraphic.startValue + item.value;
    });
    parameters.map((item) => {
      parameterGraphic.colors.push(colorSections[item.label]);
    });
    if (parameterGraphic.startValue < parameterGraphic.maxValue) {
      parameterGraphic.values.push(parameterGraphic.maxValue - parameterGraphic.startValue);
      parameterGraphic.colors.push(colorSections.shadow);
    }
    this.setState({
      values: parameterGraphic.values,
      colors: parameterGraphic.colors,
    });
  }
  updateGraphic(parameters) {
    this.loadGraphic(parameters);
    this.setState((prevState) => {
      prevState.graphic.data.datasets[0].data = this.state.values;
      prevState.graphic.data.datasets[0].backgroundColor = this.state.colors;
    }, () => {
      this.state.graphic.update();
    });
  }
  render() {
    return (
      <canvas 
        ref={(graphic) => this.graphic = graphic}
        width={70} 
        height={70}
      ></canvas>
    );
  }
}