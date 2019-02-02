import React, { createRef, RefObject } from 'react';
import _ from 'lodash';
// import style from './BeatAxl.module.scss';
import Beat from './Beat';
import StatusBase from './Status';
import Utils, { ICssSelector } from 'utils/Utils';
const style = {};

interface IProps {
  tempo: ITempo;
  remaining: number;
  postProcess?: {
    onAccelerate?: () => void;
    onTick?: () => void;
    onStart?: () => void;
    onStop?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onComplete?: () => void;
  };
  inheritedSelector?: ICssSelector;
}
interface IState {
  // empty
}
interface ITempo {
  from: number;
  to: number;
}
enum StatusExtend {
  NeverIncrement = "NeverIncrement",
}
export type StatusIncrement = StatusBase | StatusExtend;
export const StatusIncrement = { ...StatusBase, ...StatusExtend };
export type StatusBeat = StatusBase;
export const StatusBeat = StatusBase;
class BeatAxl extends React.Component<IProps, IState> {
  // Initialize in init()
  private refBeat!: RefObject<Beat>;
  private timerId!: NodeJS.Timer | number;
  private incrementStatus: StatusIncrement;
  private tempo: ITempo;
  private remaining: number;
  private interval: number;
  private cntAcceleration!: number;
  private postAccelerate: () => void;
  private postTick: () => void;
  private postStart: () => void;
  private postStop: () => void;
  private postPause: () => void;
  private postResume: () => void;
  private postComplete: () => void;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      // empty
    };

    // Ref
    this.refBeat = createRef<Beat>();

    // Post process
    this.postAccelerate = props.postProcess && props.postProcess.onAccelerate ? props.postProcess.onAccelerate : () => {};
    this.postTick = props.postProcess && props.postProcess.onTick ? props.postProcess.onTick : () => {};
    this.postStart = props.postProcess && props.postProcess.onStart ? props.postProcess.onStart : () => {};
    this.postStop = props.postProcess && props.postProcess.onStop ? props.postProcess.onStop : () => {};
    this.postPause = props.postProcess && props.postProcess.onPause ? props.postProcess.onPause : () => {};
    this.postResume = props.postProcess && props.postProcess.onResume ? props.postProcess.onResume : () => {};
    this.postComplete = props.postProcess && props.postProcess.onComplete ? props.postProcess.onComplete : () => {};

    // Function binding
    this.accelerate = this.accelerate.bind(this);
    this.onAccelerate = this.onAccelerate.bind(this);
    this.onTick = this.onTick.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onResume = this.onResume.bind(this);
    this.onComplete = this.onComplete.bind(this);

    // Local variable
    this.tempo = props.tempo;
    this.remaining = props.remaining;
    this.cntAcceleration = this.getCntAcceleration(0.0);
    this.interval = this.getInterval(0.0);
    this.incrementStatus = this.isTempoStable() ? StatusIncrement.NeverIncrement : StatusIncrement.Stopped;
  }
  private accelerate(): void {
    // Stop when tempo has reached to `this.props.tempo.to`
    if (this.cntAcceleration <= 0) {
      this.onComplete();
      return;
    }

    // Increment
    const refBeat = this.refBeat.current!;
    const currentTempo = refBeat.getTempo();
    if (this.tempo.to > this.tempo.from) {
      refBeat.setTempo(currentTempo + 1);
    } else if (this.tempo.to < this.tempo.from) {
      refBeat.setTempo(currentTempo - 1);
    }
    this.cntAcceleration--;
    this.onAccelerate();
  }
  private isTempoStable(): boolean {
    const tempoRange = this.tempo;
    const tempoDiff = tempoRange.to - tempoRange.from;
    return tempoDiff === 0;
  }
  private getCntAcceleration(progress: number): number {
    const tempoRange = this.tempo;
    const tempoDiff = tempoRange.to - tempoRange.from;
    const tempoDiffAbs = Math.abs(tempoDiff);
    const tempoCurrent = tempoRange.from + Math.round(tempoDiff * progress);
    const remaining = Math.round(this.props.remaining * Utils.safeSubtraction(1, progress));
    const remainingFixed = remaining + 1;
    const cntAccelerationStable = remainingFixed;
    const cntAccelerationUnstable = Math.abs(tempoRange.to - tempoCurrent);
    // console.log(cntAccelerationStable);
    return this.isTempoStable() ? cntAccelerationStable : cntAccelerationUnstable;
  }
  private getInterval(progress: number): number {
    const tempoRange = this.tempo;
    const tempoDiff = tempoRange.to - tempoRange.from;
    const tempoDiffAbs = Math.abs(tempoDiff);
    // const tempoCurrent = tempoRange.from + Math.round(tempoDiff * progress);
    // const isTempoStable = tempoDiff === 0;
    const remaining = Math.round(this.remaining * Utils.safeSubtraction(1, progress));
    const remainingFixed = remaining + 1;
    const tempoDiffFixed = tempoDiffAbs - Math.round(tempoDiffAbs * progress) + 1;
    // const intervalStable = (remainingFixed / (this.cntAcceleration + 1)) * 1000;
    // const intervalUnstable = (remainingFixed / tempoDiffFixed) * 1000;
    // return isTempoStable ? intervalStable : intervalUnstable;
    // console.log(remainingFixed / tempoDiffFixed * 1000);
    return remainingFixed / tempoDiffFixed * 1000;
  }
  private onAccelerate(): void {
    this.postAccelerate();
  }
  private onTick(): void {
    this.postTick();
  }
  private onStart(): void {
    this.start();
    this.postStart();
  }
  private onStop(): void {
    this.stop();
    this.postStop();
  }
  private onPause(): void {
    this.pause();
    this.postPause();
  }
  private onResume(): void {
    this.resume();
    this.postResume();
  }
  private onComplete(): void {
    const refBeat = this.refBeat.current!;
    refBeat.stop();
    this.stop();
    this.postComplete();
  }
  public start(): void {
    if (this.isTempoStable()) {
      this.timerId = setInterval(this.onComplete, this.remaining * 1000);
      this.incrementStatus = StatusIncrement.NeverIncrement;
    } else {
      this.timerId = setInterval(this.accelerate, this.interval);
      this.incrementStatus = StatusIncrement.Running;
    }
  }
  public stop(): void {
    clearInterval(this.timerId as number);
    this.setProgress(0.0);
    if (!this.isTempoStable()) {
      this.incrementStatus = StatusIncrement.Stopped;
    }
  }
  public pause(): void {
    clearInterval(this.timerId as number);
    if (!this.isTempoStable()) {
      this.incrementStatus = StatusIncrement.Paused;
    }
  }
  public resume(): void {
    if (this.isTempoStable()) {
      const remaining = this.remaining;
      this.timerId = setInterval(this.onComplete, remaining * 1000);
      this.incrementStatus = StatusIncrement.NeverIncrement;
    } else {
      this.timerId = setInterval(this.accelerate, this.interval);
      this.incrementStatus = StatusIncrement.Running;
    }
  }
  public setProgress(progress: number): void {
    const tempo = this.tempo;
    const tempoDiff = tempo.to - tempo.from;
    const refBeat = this.refBeat.current!;
    const newTempo = tempo.from + Math.round(tempoDiff * progress);
    refBeat.setTempo(newTempo);
    this.cntAcceleration = this.getCntAcceleration(progress);
    this.interval = this.getInterval(progress);
  }
  public setTempoRange(newTempo: ITempo): void {
    this.tempo = newTempo;
    if (this.isTempoStable()) {
      this.incrementStatus = StatusIncrement.NeverIncrement;
    }
  }
  public getTempo(): number {
    const refBeat = this.refBeat.current!;
    return refBeat.getTempo();
  }
  public getStatusBeat(): StatusBeat {
    const refBeat = this.refBeat.current!;
    return refBeat.getStatus();
  }
  public getStatusIncrement(): StatusIncrement {
    return this.incrementStatus;
  }
  /* istanbul ignore next */
  public init(newProps: IProps): void {
    this.tempo = newProps.tempo;
    this.remaining = newProps.remaining;

    clearInterval(this.timerId as number);
    this.setProgress(0.0);
    // if (!_.isEqual(this.props.tempo, newProps.tempo)) {
      const refBeat = this.refBeat.current!;
      refBeat.init({
        tempo: newProps.tempo.from,
      });
    // }
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (this.props.inheritedSelector) {
      // Utils.inheritSelector(style, this.props.inheritedSelector);
      Utils.inheritSelector(this.props.inheritedSelector, {});
    }
  }
  /* istanbul ignore next */
  public componentWillUnmount(): void {
    clearInterval(this.timerId as number);
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(nextProps: IProps): void {
    if (_.isEqual(this.props, nextProps)) {
      return;
    }
    this.tempo = nextProps.tempo;
    this.init(nextProps);
  }
  public render(): React.ReactNode {
    return (
      <Beat 
        ref={this.refBeat}
        tempo={this.props.tempo.from} 
        postProcess={{
          onTick: this.onTick,
          onStart: this.onStart,
          onStop: this.onStop,
          onPause: this.onPause,
          onResume: this.onResume,
        }}
        inheritedSelector={style}
      />
    );
  }
}
export default BeatAxl;
