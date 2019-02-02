import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './Remaining.module.scss';
import Utils, { ICssSelector } from '../../Utils';

interface IProps {
  timeToCount: number;
  postProcess?: IPostProcess;
  inheritedSelector?: ICssSelector;
}
interface IState {
  remaining: number;
}
interface IPostProcess {
  onClick?: (e: React.MouseEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}
class Remaining extends Component<IProps, IState> {
  private postClick: (e: React.MouseEvent) => void;
  private postTouchEnd: (e: React.TouchEvent) => void;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      remaining: props.timeToCount,
    };
    this.postClick = props.postProcess && props.postProcess.onClick ? props.postProcess.onClick : (e: React.MouseEvent) => {};
    this.postTouchEnd = props.postProcess && props.postProcess.onTouchEnd ? props.postProcess.onTouchEnd : (e: React.TouchEvent) => {};

    this.onClick = this.onClick.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }
  private onClick(e: React.MouseEvent): void {
    this.postClick(e);
  }
  private onTouchEnd(e: React.TouchEvent): void {
    this.postTouchEnd(e);
  }
  private formatTime(timeInSecond: number): string
  {
    const minute = Math.floor(timeInSecond / 60);
    const second = Math.floor(timeInSecond % 60);
    const minuteStr = minute < 10 ? "0" + minute : "" + minute;
    const secondStr = second < 10 ? "0" + second : "" + second;
    return minuteStr + ":" + secondStr;
  }
  public setRemaining(remaining: number): void {
    this.setState({
      remaining,
    });
  }
  /* istanbul ignore next */
  public init(newProps: IProps): void {
    this.setState({
      remaining: newProps.timeToCount,
    });
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (this.props.inheritedSelector) {
      Utils.inheritSelector(style, this.props.inheritedSelector);
    }
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }
    this.init(newProps);
  }
  public render(): React.ReactNode {
    const formattedTime = this.formatTime(Math.round(this.state.remaining));
    return (
      <div 
        className={style.indicator} 
        data-testid="indicator-remaining"
        onClick={this.onClick}
        onTouchEnd={this.onTouchEnd}
      >
        <div className={style.remaining}>
          {formattedTime}
        </div>
      </div>
    );
  }
}
export default Remaining;
