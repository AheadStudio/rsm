import React from "react";
import moment from "moment";
import Chart from "chart.js";

export default class AnalyticGraphic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      colors: [],
      graphic: null,
    };
  }

  componentDidMount() {
    this.loadGraphic(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.report.toJS() !== this.props.report.toJS()) {
      this.loadGraphic(nextProps);
    }
  }

  loadGraphic(props) {
    const ctx = this.graphic;
    const report = props.report.toJS()[0];
    const labels = [];
    const datasets = [
      {
        label: "Нет сигнала",
        data: [],
      },
      {
        label: "Дорожный режим",
        data: []
      },
      {
        label: "Выключен",
        data: [],
      },
      {
        label: "Простой с вкл. двигателем",
        data: []
      },
      {
        label: "Комбайнирование",
        data: [],
      },
      {
        label: "Простой с признаком уборки",
        data: []
      }
    ];
    for (let key in report.summary) {
      labels.push(moment(key, "YYMMDDHHmmss000").format("DD.MM.YY"));
      report.summary[key].map((item) => {
        datasets[item.value].data.push(item.duration);
        datasets[item.value].backgroundColor = `rgba(${item.color})`;
      });
    }
    this.setState({
      graphic: new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets,
        },
        options: {
          tooltips: {
            callbacks: {
              label: (text) => {
                if (text.datasetIndex === 1) {
                  return `Дорожный режим ${moment.duration(text.yLabel).hours()}:${moment.duration(text.yLabel).minutes()}:${moment.duration(text.yLabel).seconds()}`;
                } else if (text.datasetIndex === 2) {
                  return `Выключен ${moment.duration(text.yLabel).hours()}:${moment.duration(text.yLabel).minutes()}:${moment.duration(text.yLabel).seconds()}`;
                } else if (text.datasetIndex === 3) {
                  return `Простой с вкл. двигателем ${moment.duration(text.yLabel).hours()}:${moment.duration(text.yLabel).minutes()}:${moment.duration(text.yLabel).seconds()}`;
                } else if (text.datasetIndex === 4) {
                  return `Комбайнирование ${moment.duration(text.yLabel).hours()}:${moment.duration(text.yLabel).minutes()}:${moment.duration(text.yLabel).seconds()}`;
                } else if (text.datasetIndex === 5) {
                  return `Простой с признаком уборки ${moment.duration(text.yLabel).hours()}:${moment.duration(text.yLabel).minutes()}:${moment.duration(text.yLabel).seconds()}`;
                }
              }
            }
          },
          title: {
            display: false,
            text: "",
          },
          legend: {
            display: false,
          },
          responsive: true,
          scales: {
            xAxes: [{
              stacked: true,
            }],
            yAxes: [{
              ticks: {
                callback: (value) => {
                  return `${moment.duration(value).hours()}:${moment.duration(value).minutes()}:${moment.duration(value).seconds()}`;
                }
              },
              stacked: true,
            }],
          },
        },
      }),
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.report.toJS() !== this.props.report.toJS();
  }

  render() {
    return (
      <canvas
        ref={(graphic) => this.graphic = graphic}
      />
    );
  }
}