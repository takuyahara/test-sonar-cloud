import React, { createRef, RefObject } from 'react';
import _ from 'lodash';
import Utils from '../../Utils';
import Status from './Status';

interface IProps {
  timeToCount: number;
  postProcess?: IPostProcess;
}
interface IState {
  // empty
}
interface IPostProcess {
  onCount?: (remaining: number) => void;
  onCountStart?: () => void;
  onCountStop?: () => void;
  onCountPause?: () => void;
  onCountResume?: () => void;
  onCountComplete?: () => void;
}
class Timer extends React.Component<IProps, IState> {
  // Post process
  private postCount: (remaining: number) => void;
  private postCountStart: () => void;
  private postCountStop: () => void;
  private postCountPause: () => void;
  private postCountResume: () => void;
  private postCountComplete: () => void;

  // Initialize in init()
  private status: Status;
  private timerId!: NodeJS.Timer | number;
  private remaining!: number;

  public constructor(props: IProps) {
    super(props);

    // Post process
    this.postCount = props.postProcess && props.postProcess.onCount ? props.postProcess.onCount : (remaining: number) => {};
    this.postCountStart = props.postProcess && props.postProcess.onCountStart ? props.postProcess.onCountStart : () => {};
    this.postCountStop = props.postProcess && props.postProcess.onCountStop ? props.postProcess.onCountStop : () => {};
    this.postCountPause = props.postProcess && props.postProcess.onCountPause ? props.postProcess.onCountPause : () => {};
    this.postCountResume = props.postProcess && props.postProcess.onCountResume ? props.postProcess.onCountResume : () => {};
    this.postCountComplete = props.postProcess && props.postProcess.onCountComplete ? props.postProcess.onCountComplete : () => {};

    // Method binding
    this.timerRunner = this.timerRunner.bind(this);

    // Local variable
    this.status = Status.Stopped;
    this.remaining = props.timeToCount;
  }
  private isTimerCompleted(remaining: number): boolean {
    return remaining < 0;
  }
  private timerRunner(): void {
    this.remaining--;
    if (this.isTimerCompleted(this.remaining)) {
      this.stop();
      this.postCountComplete();
    } else {
      this.postCount(this.remaining);
    }
  }
  public start(): void {
    this.timerId = setInterval(this.timerRunner, 1000);
    this.postCountStart();
    this.status = Status.Running;
  }
  public stop(): void {
    clearInterval(this.timerId as NodeJS.Timer);
    this.postCountStop();
    this.status = Status.Stopped;
    this.remaining = this.props.timeToCount;
  }
  public pause(): void {
    clearInterval(this.timerId as NodeJS.Timer);
    this.postCountPause();
    this.status = Status.Paused;
  }
  public resume(): void {
    this.timerId = setInterval(this.timerRunner, 1000);
    this.postCountResume();
    this.status = Status.Running;
  }
  public getState(): Status {
    return this.status;
  }
  public getTimeToCount(): number {
    return this.props.timeToCount;
  }
  public setProgress(progress: number): void {
    this.remaining = Math.round(this.props.timeToCount * Utils.safeSubtraction(1, progress));
  }
  public getProgress(): number {
    return Utils.safeSubtraction(1, this.remaining / this.props.timeToCount);
  }
  public toggle(): void {
    switch (this.status) {
        case Status.Running:
        this.pause();
        break;
      case Status.Paused:
        this.resume();
        break;
      case Status.Stopped:
        this.start();
        break;
    }
  }
  /* istanbul ignore next */
  public init(props: IProps): void {
    clearInterval(this.timerId as NodeJS.Timer);
    this.status = Status.Stopped;
    this.remaining = props.timeToCount;
  }
  /* istanbul ignore next */
  public componentWillUnmount(): void {
    clearInterval(this.timerId as NodeJS.Timer);
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }
    this.init(newProps);
  }
  public render(): React.ReactNode {
    return null;
  }
}
export default Timer;
