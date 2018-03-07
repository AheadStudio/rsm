import React from "react";
import { Progress } from 'antd';

export default class DetailLoad extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      progress: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if((nextProps.queries.length && nextProps.progress.length) && (nextProps.progress.length !== this.props.progress.length)) {
      this.setState({
        progress: ((nextProps.progress.length / nextProps.queries.length) * 100).toFixed()
      }, () => {
        if(this.state.progress >= 100) {
          setTimeout(() => {
            this.setState({
              progress: 0,
            });
          }, 500);
        }
      });
    }
  }
  render(){
    return(
      <div>
        {this.state.progress || this.props.queries.length ? (
          <div className="detail-load" style={{padding: this.props.padding}}>
            <Progress
              percent={this.state.progress}
              status="active"
            />
          </div>
        ) : null}
      </div>
    );
  }
}