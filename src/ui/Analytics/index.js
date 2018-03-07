import React from "react";
import Graphic from "../Graphic/svg";
import {connect} from "react-redux";
import {Link} from "react-router";
import {link} from "../../router";

@connect(state => ({
  data: state.users.get("dataAllMachines"),
}))
export default class Analytics extends React.Component {
  render() {
    return (
      <div className="analytic">
        <div className="analytic__title">
          <p>Убрано
            <span className="analytic__title-bold"> {Number(this.props.data.get("INC_SUMM_AREA")).toFixed(2)} Га</span>
          </p>
        </div>
        <div className="analytic__main">
          <div className="analytic__left">
            <div className="analytic__data">
              <p>Топливо <span>{this.props.data.get("INC_SUMM_FUEL")} литров</span></p>
              <table>
                <tbody>
                <tr>
                  <td>
                    <p className="green">Комбайнирование</p>
                  </td>
                  <td>
                    <p>{this.props.data.get("INC_SUMM_FUEL_COMB")} л</p>
                  </td>
                  <td>
                    <p>{this.props.data.get("INC_SUMM_FUEL_COMB_PERC")} %</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="blue">Дорожный режим</p>
                  </td>
                  <td>
                    <p>{this.props.data.get("INC_SUMM_FUEL_MOVE")} л</p>
                  </td>
                  <td>
                    <p>{this.props.data.get("INC_SUMM_FUEL_MOVE_PERC")} %</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="red">Простой с вкл. двигателем</p>
                  </td>
                  <td>
                    <p>{this.props.data.get("INC_SUMM_FUEL_STOP")} л</p>
                  </td>
                  <td>
                    <p>{this.props.data.get("INC_SUMM_FUEL_STOP_PERC")} %</p>
                  </td>
                </tr>
                </tbody>
              </table>
              <Link to={link.watch}>Анализ</Link>
            </div>
          </div>
          {this.props.data.get("INC_SUMM_FUEL") ? (
            <div className="analytic__right">
              <p>{this.props.data.get("INC_SUMM_FUEL")} л</p>
              <Graphic graphic={[
                {
                  color: 4,
                  value: this.props.data.get("INC_SUMM_FUEL_COMB"),
                  label: "Комбайнирование",
                },
                {
                  color: 1,
                  value: this.props.data.get("INC_SUMM_FUEL_MOVE"),
                  label: "Дорожный режим",

                },
                {
                  color: 3,
                  value: this.props.data.get("INC_SUMM_FUEL_STOP"),
                  label: "Простой с вкл. двигателем",
                }
              ]}
                       width={450}
                       border={"55%"}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}