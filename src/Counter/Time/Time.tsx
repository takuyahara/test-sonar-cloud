import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import Indicator from './Indicator';
import { default as Ring } from './RingStepped';
import style from './Time.module.scss';
import Status from './Status';
import Utils, { ICssSelector } from '../../Utils';

interface IProps {
  remaining: number;
  postProcess?: {
    Ring?: {
      onMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
      onMouseMove?: (e: React.MouseEvent | React.TouchEvent) => void;
      onMouseUp?: (e: React.MouseEvent | React.TouchEvent) => void;
    };
    Indicator?: {
      onCount?: () => void;
      onCountStart?: () => void;
      onCountStop?: () => void;
      onCountPause?: () => void;
      onCountResume?: () => void;
      onCountComplete?: () => void;
    };
  };
  inheritedSelector?: ICssSelector;
}
interface IState {
  // empty
}
class Time extends Component<IProps, IState> {
  private postProcess: {
    Ring: {
      onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
      onMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
      onMouseUp: (e: React.MouseEvent | React.TouchEvent) => void;
    };
    Indicator: {
      onCount: () => void;
      onCountStart: () => void;
      onCountStop: () => void;
      onCountPause: () => void;
      onCountResume: () => void;
      onCountComplete: () => void;
    };
  };
  private isDragging: boolean = false;
  private refIndicator: RefObject<Indicator>;
  private refRing: RefObject<Ring>;

  public constructor(props: IProps) {
    super(props);
    // this.state = {
    //
    // };

    // Ref
    this.refIndicator = createRef<Indicator>();
    this.refRing = createRef<Ring>();

    // Post process
    this.postProcess = {
      Ring: {
        onMouseDown: props.postProcess && props.postProcess.Ring && props.postProcess.Ring.onMouseDown ? 
          props.postProcess.Ring.onMouseDown : (e: React.MouseEvent | React.TouchEvent) => {},
        onMouseMove: props.postProcess && props.postProcess.Ring && props.postProcess.Ring.onMouseMove ? 
          props.postProcess.Ring.onMouseMove : (e: React.MouseEvent | React.TouchEvent) => {},
        onMouseUp: props.postProcess && props.postProcess.Ring && props.postProcess.Ring.onMouseUp ? 
          props.postProcess.Ring.onMouseUp : (e: React.MouseEvent | React.TouchEvent) => {},
      },
      Indicator: {
        onCount: props.postProcess && props.postProcess.Indicator && props.postProcess.Indicator.onCount ? 
          props.postProcess.Indicator.onCount : () => {},
        onCountStart: props.postProcess && props.postProcess.Indicator && props.postProcess.Indicator.onCountStart ? 
          props.postProcess.Indicator.onCountStart : () => {},
        onCountStop: props.postProcess && props.postProcess.Indicator && props.postProcess.Indicator.onCountStop ? 
          props.postProcess.Indicator.onCountStop : () => {},
        onCountPause: props.postProcess && props.postProcess.Indicator && props.postProcess.Indicator.onCountPause ? 
          props.postProcess.Indicator.onCountPause : () => {},
        onCountResume: props.postProcess && props.postProcess.Indicator && props.postProcess.Indicator.onCountResume ? 
          props.postProcess.Indicator.onCountResume : () => {},
        onCountComplete: props.postProcess && props.postProcess.Indicator && props.postProcess.Indicator.onCountComplete ? 
          props.postProcess.Indicator.onCountComplete : () => {},
      },
    };

    // Method binding
    this.onRingMouseDown = this.onRingMouseDown.bind(this);
    this.onRingMouseMove = this.onRingMouseMove.bind(this);
    this.onRingMouseUp = this.onRingMouseUp.bind(this);
    this.onIndicatorCount = this.onIndicatorCount.bind(this);
    this.onIndicatorCountStart = this.onIndicatorCountStart.bind(this);
    this.onIndicatorCountStop = this.onIndicatorCountStop.bind(this);
    this.onIndicatorCountPause = this.onIndicatorCountPause.bind(this);
    this.onIndicatorCountResume = this.onIndicatorCountResume.bind(this);
    this.onIndicatorCountComplete = this.onIndicatorCountComplete.bind(this);
  }
  private onRingMouseDown(e: React.MouseEvent | React.TouchEvent): void {
    const refRing = this.refRing.current!;
    const refIndicator = this.refIndicator.current!;
    const progress = refRing.getProgress();
    this.setProgress(progress);
    if (refIndicator.getState() === Status.Running) {
      refIndicator.pause();
      this.isDragging = true;
    }
    this.postProcess.Ring.onMouseDown(e);
  }
  private onRingMouseMove(e: React.MouseEvent | React.TouchEvent): void {
    const refRing = this.refRing.current!;
    const progress = refRing.getProgress();
    this.setProgress(progress);
    this.postProcess.Ring.onMouseMove(e);
  }
  private onRingMouseUp(e: React.MouseEvent | React.TouchEvent): void {
    const refIndicator = this.refIndicator.current!;
    if (this.isDragging) {
      refIndicator.resume();
      this.isDragging = false;
    }
    this.postProcess.Ring.onMouseUp(e);
  }
  private onIndicatorCount(): void {
    const refRing = this.refRing.current!;
    const refIndicator = this.refIndicator.current!;
    refRing.setProgress(refIndicator.getProgress());
    this.postProcess.Indicator.onCount();
  }
  private onIndicatorCountStart(): void {
    this.postProcess.Indicator.onCountStart();
  }
  private onIndicatorCountStop(): void {
    this.postProcess.Indicator.onCountStop();
  }
  private onIndicatorCountPause(): void {
    this.postProcess.Indicator.onCountPause();
  }
  private onIndicatorCountResume(): void {
    this.postProcess.Indicator.onCountResume();
  }
  private onIndicatorCountComplete(): void {
    const refRing = this.refRing.current!;
    refRing.reset();
    this.postProcess.Indicator.onCountComplete();
  }
  public start(): void {
    const refIndicator = this.refIndicator.current!;
    refIndicator.start();
  }
  public stop(): void {
    const refIndicator = this.refIndicator.current!;
    const refRing = this.refRing.current!;
    refIndicator.stop();
    refRing.reset();
  }
  public pause(): void {
    const refIndicator = this.refIndicator.current!;
    refIndicator.pause();
  }
  public resume(): void {
    const refIndicator = this.refIndicator.current!;
    refIndicator.resume();
  }
  public setProgress(progress: number): void {
    const refRing = this.refRing.current!;
    const refIndicator = this.refIndicator.current!;
    refRing.setProgress(progress);
    refIndicator.setProgress(progress);
  }
  public getProgress(): number {
    const refRing = this.refRing.current!;
    return refRing.getProgress();
  }
  public getState(): Status {
    const refIndicator = this.refIndicator.current!;
    return refIndicator.getState();
  }
  /* istanbul ignore next */
  public init(newProps: IProps): void {
    const refRing = this.refRing.current!;
    const refIndicator = this.refIndicator.current!;
    refRing.init({
      step: newProps.remaining,
    });
    refIndicator.init({
      timeToCount: newProps.remaining,
    });
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (this.props.inheritedSelector) {
      Utils.inheritSelector(style, this.props.inheritedSelector!);
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
    return (
      <div 
        className={style.time} 
      >
        <Ring 
          ref={this.refRing} 
          step={this.props.remaining}
          mouseEvent={{
            onMouseMove: this.onRingMouseMove,
            onMouseDown: this.onRingMouseDown,
            onMouseUp: this.onRingMouseUp,
          }} 
          inheritedSelector={style} 
        />
        <Indicator 
          ref={this.refIndicator} 
          timeToCount={this.props.remaining} 
          postProcess={{
            onCount: this.onIndicatorCount,
            onCountStart: this.onIndicatorCountStart,
            onCountStop: this.onIndicatorCountStop,
            onCountPause: this.onIndicatorCountPause,
            onCountResume: this.onIndicatorCountResume,
            onCountComplete: this.onIndicatorCountComplete,
          }}
          inheritedSelector={style} 
        />
      </div>
    );
  }
}
export default Time;