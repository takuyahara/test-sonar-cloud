import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import Remaining from './Remaining';
import Timer from './Timer';
import Status from './Status';
// import style from './Indicator.module.scss';
import Utils, { ICssSelector } from '../../Utils';

interface IProps {
  timeToCount: number;
  postProcess?: IPostProcess;
  inheritedSelector?: ICssSelector;
}
interface IState {
  timeToCount: number;
}
interface IPostProcess {
  onCount?: (remaining: number) => void;
  onCountStart?: () => void;
  onCountStop?: () => void;
  onCountPause?: () => void;
  onCountResume?: () => void;
  onCountComplete?: () => void;
}
class Indicator extends Component<IProps, IState> {
  // Initialize in init()
  private timer!: Timer;

  // Ref
  private refRemaining: RefObject<Remaining>;
  private refTimer: RefObject<Timer>;

  // Post process
  private postCount: (remaining: number) => void;
  private postCountStart: () => void;
  private postCountStop: () => void;
  private postCountPause: () => void;
  private postCountResume: () => void;
  private postCountComplete: () => void;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      timeToCount: props.timeToCount,
    };

    // Ref
    this.refRemaining = createRef<Remaining>();
    this.refTimer = createRef<Timer>();

    // Binding
    this.onClick = this.onClick.bind(this);
    this.onCount = this.onCount.bind(this);
    this.onCountStart = this.onCountStart.bind(this);
    this.onCountStop = this.onCountStop.bind(this);
    this.onCountPause = this.onCountPause.bind(this);
    this.onCountResume = this.onCountResume.bind(this);
    this.onCountComplete = this.onCountComplete.bind(this);

    // Post process
    this.postCount = props.postProcess && props.postProcess.onCount ? props.postProcess.onCount : (remaining: number) => {};
    this.postCountStart = props.postProcess && props.postProcess.onCountStart ? props.postProcess.onCountStart : () => {};
    this.postCountStop = props.postProcess && props.postProcess.onCountStop ? props.postProcess.onCountStop : () => {};
    this.postCountPause = props.postProcess && props.postProcess.onCountPause ? props.postProcess.onCountPause : () => {};
    this.postCountResume = props.postProcess && props.postProcess.onCountResume ? props.postProcess.onCountResume : () => {};
    this.postCountComplete = props.postProcess && props.postProcess.onCountComplete ? props.postProcess.onCountComplete : () => {};
  }
  private onClick(e: React.MouseEvent | React.TouchEvent): void {
    const timer = this.refTimer.current!;
    timer.toggle();
  }
  private onCount(remaining: number): void {
    const refRemaining = this.refRemaining.current!;
    refRemaining.setRemaining(remaining);
    this.postCount(remaining);
  }
  private onCountStart(): void {
    this.postCountStart();
  }
  private onCountStop(): void {
    this.postCountStop();
  }
  private onCountPause(): void {
    this.postCountPause();
  }
  private onCountResume(): void {
    this.postCountResume();
  }
  private onCountComplete(): void {
    // this.setState({
    //   timeToCount: this.props.timeToCount,
    // });
    const refRemaining = this.refRemaining.current!;
    refRemaining.setRemaining(this.props.timeToCount);
    this.postCountComplete();
  }
  public toggle(): void {
    const timer = this.refTimer.current!;
    timer.toggle();
  }
  public start(): void {
    const timer = this.refTimer.current!;
    timer.start();
  }
  public stop(): void {
    const timer = this.refTimer.current!;
    timer.stop();
  }
  public pause(): void {
    const timer = this.refTimer.current!;
    timer.pause();
  }
  public resume(): void {
    const timer = this.refTimer.current!;
    timer.resume();
  }
  public getTimeToCount(): number {
    const timer = this.refTimer.current!;
    return timer.getTimeToCount();
  }
  public setProgress(newProgress: number): void {
    const refRemaining = this.refRemaining.current!;
    const refTimer = this.refTimer.current!;
    refRemaining.setRemaining(Math.round((1 - newProgress) * this.props.timeToCount));
    refTimer.setProgress(newProgress);
  }
  public getProgress(): number {
    const timer = this.refTimer.current!;
    return timer.getProgress();
  }
  public getState(): Status {
    const timer = this.refTimer.current!;
    return timer.getState();
  }
  /* istanbul ignore next */
  public init(newProps: IProps): void {
    this.stop();
    this.setState({
      timeToCount: newProps.timeToCount,
    });

    const refRemaining = this.refRemaining.current!;
    const refTimer = this.refTimer.current!;
    refRemaining.init({
      timeToCount: newProps.timeToCount,
    });
    refTimer.init({
      timeToCount: newProps.timeToCount,
    });
  }
  // /* istanbul ignore next */
  // public componentWillMount(): void {
  //   if (this.props.inheritedSelector) {
  //     Utils.inheritSelector(style, this.props.inheritedSelector);
  //   }
  // }
  /* istanbul ignore next */
  public componentWillUnmount(): void {
    this.stop();
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }
    this.init(newProps);
  }
  public render(): React.ReactNode {
    return (
      <>
        <Remaining 
          ref={this.refRemaining}
          timeToCount={this.state.timeToCount}
          postProcess={{
            onClick: this.onClick,
            onTouchEnd: this.onClick,
          }}
          inheritedSelector={this.props.inheritedSelector} 
          // inheritedSelector={style} 
          />
        <Timer 
          ref={this.refTimer}
          timeToCount={this.state.timeToCount} 
          postProcess={{
            onCount: this.onCount,
            onCountStart: this.onCountStart,
            onCountStop: this.onCountStop,
            onCountPause: this.onCountPause,
            onCountResume: this.onCountResume,
            onCountComplete: this.onCountComplete,
          }} 
          />
      </>
    );
  }
}
export default Indicator;
