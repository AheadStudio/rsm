import React from "react";
import moment from "moment";
import Dygraph from "dygraphs/src-es5/dygraph";

export default class GraphicDigraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphic: null,
      data: null
    };
  }

  componentDidMount() {
    let data = [];
    this.props.data.map((item, index) => {
      const findTimeZp = this.props.listEvent.find((it) => it.startTime <= item.time && it.endTime >= item.time && it.eventName === "Заправка");
      const findTimeSl = this.props.listEvent.find((it) => it.startTime <= item.time && it.endTime >= item.time && it.eventName === "Слив");
      if (findTimeZp) {
        data.push([item.time, item.value, this.props.speed[index].value, item.value, null]);
      } else if (findTimeSl) {
        data.push([item.time, item.value, this.props.speed[index].value, null, item.value]);
      } else {
        data.push([item.time, item.value, this.props.speed[index].value, null, null]);
      }
    });
    this.setState({
      graphic: new Dygraph(
        this.graphic,
        data,
        {
          legendFormatter: (data) => {
            let range = null, fuel = null;
            for (let key in this.props.modes) {
              if(this.props.modes[key].duration.find((item) => data.x >= item.beg && data.x <= item.end)){
                range = this.props.modes[key].value;
              }
            }
            let findEvent = this.props.listEvent.find((event) => {
              if (event.startTime <= data.x && event.endTime >= data.x) {
                return true;
              }
            });
            if (findEvent) {
              const findData = this.props.data.find((d) => d.time === data.x);
              if (findData) {
                fuel = {};
                fuel.type = findEvent.eventType;
                if (findEvent.eventType === 0){
                  fuel.value = findEvent.endValue - findEvent.startValue;
                } else {
                  fuel.value = findEvent.startValue - findEvent.endValue;
                }
              } else {
                fuel = null;
              }
            } else {
              fuel = null;
            }
            if (data.x == null) {
              return '<br>' + data.series.map(function(series) { return series.dashHTML + ' ' + series.labelHTML; }).join('<br>');
            }
            let html = `<div class="wrap-label"><p>Время</p><p>${moment(data.xHTML).format("DD.MM.YY")} ${moment(data.xHTML).format("HH:mm:ss")}</p></div><div class="wrap-label"><p>Режим</p><p>
${range === 1 ? "Дорожный режим" : 
                range === 2 ? "Выключен" : 
                  range === 3 ? "Простой с вкл. двигателем" : 
                    range === 4 ? "Комбайнирование" :
                      range === 5 ? "Простой с признаком уборки" :
                      "Нет связи"}</p></div>`;
            data.series.forEach(function(series) {
              if (!series.isVisible) return;
              if (series.label !== "Заправка" && series.label !== "Слив") {
                let labeledData =  `<div class="wrap-label__item"><p>${series.labelHTML}</p><p>${series.yHTML}</p></span></div>`;
                if (series.isHighlighted) {
                  labeledData = `<div class="wrap-label__children">${series.labeledData}</div>`;
                }
                html += labeledData;
              }
            });
            if (fuel){
              html =  html + `<div class="wrap-label"><p>${fuel.type ? "Слив" : "Заправка"}</p><p>${fuel.value.toFixed(1)}</p></div>`;
            }
            return html;
          },
          underlayCallback: (canvas, area, g) => {
            const eventHighlight = (eventh) => {
              if(eventh.eventType === 1) {
                canvas.fillStyle = '#c70606';
              } else if(eventh.eventType === 0) {
                canvas.fillStyle = '#78C800';
              }
              var canvas_left_x = g.toDomXCoord(eventh.startTime);
              var canvas_right_x = g.toDomXCoord(eventh.endTime);
              var canvas_width = canvas_right_x - canvas_left_x;
              canvas.fillRect(canvas_left_x, area.y, canvas_width, 30);
            };
            this.props.listEvent.map((item) => eventHighlight(item));
            const highlightPeriod = (x_start, x_end, mod) => {
              const mode = ["#dedede", "rgba(6,170,245,0.2)", "rgba(0,0,0,.3)", "rgba(209,11,65,0.4)", "rgba(120,200,0,0.3)", "rgba(222,102,222,.2)"];
              canvas.fillStyle = mode[mod];
              const canvas_width = g.toDomXCoord(x_end) - g.toDomXCoord(x_start);
              canvas.fillRect(g.toDomXCoord(x_start), area.y, canvas_width, area.h);
            };
            for (let key in this.props.modes) {
              this.props.modes[key].duration.map((item) => {
                highlightPeriod(item.beg, item.end, this.props.modes[key].value);
              });
            }
          },
          labels: ["Дата", "Уроветь топлива", "Скорость", "Заправка", "Слив"],
          colors: ["#020202", "#06AAF5", "#78C800", "#c70606"],
          legend: "follow",
          axes: {
            x: {
              axisLabelFormatter: (text) => {
                return `<span class="dygraph-span x">${moment(text).format("DD.MM.YY")}<br/>${moment(text).format("HH:mm:ss")}</span>`;
              }
            },
            y: {
              axisLabelFormatter: (text) => {
                return `<span class="dygraph-span y">${text.toFixed(1)}</span>`;
              }
            }
          }
        }
      )
    });
  }

  render() {
    return (
      <div
        id="graphic-dygraph"
        ref={(graphic) => this.graphic = graphic}
      />
    );
  }
}