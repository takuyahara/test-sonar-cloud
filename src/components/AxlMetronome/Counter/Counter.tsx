import React, { createRef, RefObject } from 'react';
import _ from 'lodash';
import Time from './Time/Time';
import Beat, { StatusBeat, StatusIncrement } from './Beat/BeatAxl';
import StatusTime from './Time/Status';

interface IProps {
  tempo: ITempo;
  remaining: number;
}
interface IState {
  tempo: ITempo;
}
interface ITempo {
  from: number; 
  to: number; 
}
class Counter extends React.Component<IProps, IState> {
  private refTime!: RefObject<Time>;
  private refBeat!: RefObject<Beat>;
  private tempoDiff: number;
  public constructor(props: IProps) {
    super(props);
    this.state = {
      tempo: props.tempo,
    };

    // Ref
    this.refTime = createRef<Time>();
    this.refBeat = createRef<Beat>();
    
    // Method binding
    this.onBeatTick = this.onBeatTick.bind(this);
    this.onBeatStart = this.onBeatStart.bind(this);
    this.onBeatStop = this.onBeatStop.bind(this);
    this.onBeatPause = this.onBeatPause.bind(this);
    this.onBeatResume = this.onBeatResume.bind(this);
    this.onBeatComplete = this.onBeatComplete.bind(this);
    this.onRingMouseDown = this.onRingMouseDown.bind(this);
    this.onRingMouseMove = this.onRingMouseMove.bind(this);
    this.onRingMouseUp = this.onRingMouseUp.bind(this);

    // Local variable
    this.tempoDiff = this.props.tempo.to - this.props.tempo.from;
  }

  // Beat's post-process
  private onBeatTick(): void {
    // do nothing
  }
  private onBeatStart(): void {
    const refTime = this.refTime.current!;
    refTime.start();
  }
  private onBeatStop(): void {
    // const refTime = this.refTime.current!;
    // refTime.stop();
  }
  private onBeatPause(): void {
    const refTime = this.refTime.current!;
    refTime.pause();
  }
  private onBeatResume(): void {
    const refTime = this.refTime.current!;
    refTime.resume();
  }
  private onBeatComplete(): void {
    // const refTime = this.refTime.current!;
    // refTime.stop();
  }

  // Ring's post process
  private onRingMouseDown(e: React.MouseEvent | React.TouchEvent): void {
    const refTime = this.refTime.current!;
    const refBeat = this.refBeat.current!;
    const progress = refTime.getProgress();
    refTime.setProgress(progress);
    refBeat.setProgress(progress);
    if (refTime.getStatus() === StatusTime.Paused) {
      refBeat.pause();
    }
  }
  private onRingMouseMove(e: React.MouseEvent | React.TouchEvent): void {
    const refTime = this.refTime.current!;
    const refBeat = this.refBeat.current!;
    const progress = refTime.getProgress();
    refTime.setProgress(progress);
    refBeat.setProgress(progress);
  }
  private onRingMouseUp(e: React.MouseEvent | React.TouchEvent): void {
    const refTime = this.refTime.current!;
    const refBeat = this.refBeat.current!;
    // const progress = refTime.getProgress();
    // refBeat.setProgress(progress);
    if (refTime.getStatus() === StatusTime.Running) {
      refBeat.resume();
    }
  }
  public setTempo(newTempo: ITempo): void {
    const refTime = this.refTime.current!;
    const refBeat = this.refBeat.current!;
    const progress = refTime.getProgress();
    refBeat.setTempoRange(newTempo);
    refBeat.setProgress(progress);
    if (this.getStatus() === StatusTime.Running) {
      refTime.pause();
      refBeat.pause();
      refTime.resume();
      refBeat.resume();
    }
  }
  public getStatus(): StatusTime {
    const refTime = this.refTime.current!;
    const refBeat = this.refBeat.current!;
    /* istanbul ignore if */
    if (refBeat.getStatusIncrement() !== StatusIncrement.NeverIncrement && refTime.getStatus() !== refBeat.getStatusIncrement()) {
      throw new Error(`Status between Time and Beat mismatches. Time=${refTime.getStatus()}, Beat=${refBeat.getStatusIncrement()}`);
    }
    return refTime.getStatus();
  }
  /* istanbul ignore next */
  public init(newProps: IProps): void {
    this.tempoDiff = newProps.tempo.to - newProps.tempo.from;

    const refTime = this.refTime.current!;
    const refBeat = this.refBeat.current!;
    // if (_.isEqual(this.props.remaining, newProps.remaining)) {
      refTime.init({
        remaining: newProps.remaining,
      });
    // }
    // if (
    //   _.isEqual(this.props.tempo, newProps.tempo) && 
    //   _.isEqual(this.props.remaining, newProps.remaining)
    //   ) {
      refBeat.init({
        tempo: newProps.tempo,
        remaining: newProps.remaining,
      });
    // }
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    // Do nothing if props are not changed.
    if (_.isEqual(this.props, newProps)) {
      return;
    }
    this.init(newProps);
  }
  public render(): React.ReactNode {
    return (
      <div>
        <Time 
          ref={this.refTime} 
          remaining={this.props.remaining}
          postProcess={{
            Ring: {
              onMouseDown: this.onRingMouseDown,
              onMouseMove: this.onRingMouseMove,
              onMouseUp: this.onRingMouseUp,
            },
          }} 
        />
        <Beat 
          ref={this.refBeat} 
          tempo={this.props.tempo} 
          remaining={this.props.remaining} 
          postProcess={{
            onTick: this.onBeatTick,
            onStart: this.onBeatStart,
            onStop: this.onBeatStop,
            onPause: this.onBeatPause,
            onResume: this.onBeatResume,
            onComplete: this.onBeatComplete,            
          }} 
        />
      </div>
    );
  }
}
export default Counter;