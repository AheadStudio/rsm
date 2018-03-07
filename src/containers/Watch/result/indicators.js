import React from "react";
import moment from "moment/moment";
import Dygraph from "dygraphs/src-es5/dygraph";

export default class ResultFilter extends React.Component {
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
  loadGraphic(props) {
    if (props.report[0] && props.report[0].time.length) {
      let data = [];
      let labels = ["Date"];
      props.report[0].time.map((item, index) => {
        data.push([item]);
        return props.report[0].values.map((item) => {
          return item.map((it) => {
            if (it.value[index] === null) {
              data[index].push(0);
            } else {
              data[index].push(it.value[index]);
            }
          });
        });
      });
      props.report[0].values.map((item) => {
        return item.map((it) => {
          labels.push(it.brName);
        });
      });
      this.setState({
        graphic: new Dygraph(
          this.graphic,
          data,
          {
            legendFormatter: (data) => {
              let range = null;
              for (let key in props.report[0].background) {
                let findRange = props.report[0].background[key].duration.find((item) => data.x > item.beg && data.x < item.end);
                if(findRange) {
                  range = props.report[0].background[key].value;
                }
              }
              if (data.x == null) {
                return '<br>' + data.series.map(function(series) { return series.dashHTML + ' ' + series.labelHTML; }).join('<br>');
              }
              let html = `<div class="wrap-label"><p>Дата</p><p>${moment(data.x).format("DD.MM.YY")} ${moment(data.x).format("HH:mm:ss")}</p></span></div><div class="wrap-label"><p>Режим</p><p>
${range === 1 ? "Дорожный режим" :
                range === 2 ? "Выключен" :
                  range === 3 ? "Простой с вкл. двигателем" :
                    range === 4 ? "Комбайнирование" : "Нет связи"}</p></span></div>`;
              data.series.forEach(function(series) {
                if (!series.isVisible) return;

                let labeledData =  `<div class="wrap-label__item"><p>${series.labelHTML}</p><p>${series.yHTML}</p></span></div>`;
                if (series.isHighlighted) {
                  labeledData = `<div class="wrap-label__children">${series.labeledData}</div>`;
                }
                html += labeledData;
              });
              return html;
            },
            legend: "follow",
            underlayCallback: (canvas, area, g) => {
              function highlight_period(x_start, x_end, mod) {
                var mode = [];
                mode[0] = 'rgba(128, 128, 128, 0.1)';
                mode[1] = 'rgba(0, 0, 255, 0.1)';
                mode[2] = 'rgba(255, 255, 0, 0.1)';
                mode[3] = 'rgba(255, 0, 0, 0.1)';
                mode[4] = 'rgba(0, 255, 0, 0.1)';
                canvas.fillStyle = mode[mod];
                var canvas_left_x = g.toDomXCoord(x_start);
                var canvas_right_x = g.toDomXCoord(x_end);
                var canvas_width = canvas_right_x - canvas_left_x;
                canvas.fillRect(canvas_left_x, area.y, canvas_width, area.h);
              }
              
              var MOD = props.report[0].background;

              for (var i in MOD) {
                MOD[i].duration.map((item) => {
                  highlight_period(item.beg, item.end, MOD[i].value);
                });
              }
            },
            labels,
            axes: {
              x: {
                axisLabelFormatter: (text) => {
                  return "<div style='font-size:10px'>" + moment(text).format("DD.MM.YY") + "<br/>" + moment(text).format("HH:mm:ss") + "</div>";
                },
                valueFormatter: (text) => {
                  return moment(text).format("DD.MM.YY");
                }
              },
              y: {
                valueFormatter: (text) => {
                  return text.toFixed(1);
                },
                axisLabelFormatter: (text) => {
                  return text.toFixed(1);
                }
              }
            },
            axisLabelFormatter: (d) => {
              var res = "<div style='font-size:10px'>" + d + "</div>";
              return res;
            }

          }
        ),
      }, () => {
        labels.map((item, index) => {
          if (index !== 0) {
            this.state.graphic.setVisibility(index, false);
          }
        });
      });
    }
  }

  render() {
    const parameters = [];
    this.props.report[0].values.map((item) => {
      return item.map((it) => {
        parameters.push(it);
      });
    });
    return (
      <div>{this.props.report && this.props.report[0].time.length ? (
        <div>
          <div
            id="graphic-dygraph"
            ref={(graphic) => this.graphic = graphic}
          />
          <div className="watch__control">
            <div className="watch__control-top">
              <p>Выберите графики (2/{parameters.length})</p>
            </div>
            <div className="watch__control-data">
              {parameters.map((item, index) =>
                <ItemParam
                  name={item.brName}
                  index={index}
                  key={index + 1}
                  checkParam={this.state.graphic}
                />
              )}
            </div>
          </div>
        </div>
      ) : <div style={{display: "flex", justifyContent: "center", padding: "20px"}}>
        <p>Нет данных</p>
      </div>}
      </div>
    );
  }
}

class ItemParam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentWillMount() {
    if (this.props.index === 0) {
      this.setState({
        show: true
      });
    }
  }

  render() {
    return (
      <div
        className="watch__control-item"
      >
        <input
          id={`${this.props.index}`}
          type="checkbox"
          checked={this.state.show}
        />
        <label
          htmlFor={`${this.props.index}`}
          onClick={() => {
            this.setState({
              show: !this.state.show
            });
            setTimeout(() => {
              this.props.checkParam.setVisibility(this.props.index, this.state.show);
            });
          }}
        >
          {this.props.name}
        </label>
      </div>
    );
  }
}