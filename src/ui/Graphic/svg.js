import React from "react";
import d3pie from "d3pie";

const colorSections = ["#e8e8e8", "#06AAF5", "#202020", "#D10B41", "#78C800"];

export default class Graphic extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      graphic: null,
    };
  }

  componentWillMount() {
    this.setColor(this.props.graphic);
  }

  componentDidMount() {
    this.setState({
      graphic: new d3pie(this.graphic, {
        data: {
          sortOrder: "none",
          content: this.state.data,
        },
        size: {
          canvasHeight: this.props.height,
          canvasWidth: this.props.width,
          pieInnerRadius: "83%",
          pieOuterRadius: "60%",
        },
        misc: {
          gradient: {
            enabled: false,
          },
        },
        labels: {
          outer: {
            format: "none"
          },
          inner: {
            format: "none",
          },
          lines: {
            enabled: true,
          },
          truncation: {
            enabled: true,
          }
        },
        tooltips: {
          enabled: true,
          type: "placeholder",
          string: "{label}",
          styles: {
            fadeInSpeed: 1000,
            backgroundOpacity: 1,
            fontSize: 11
          }
        }
      }),
    });
  }
  setColor(parameters) {
    const newParametrs = [];
    parameters.map((item) => {
      if (item.value) {
        item.color = colorSections[item.color];
        newParametrs.push(item);
      }
    });
    this.setState({
      data: newParametrs,
    });
  }
  render() {
    return (
      <div 
        ref={(graphic) => this.graphic = graphic} 
        className="graphic-table"
      ></div>
    );
  }
}