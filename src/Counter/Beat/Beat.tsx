import React from 'react';
import _ from 'lodash';
import style from './Beat.module.scss';
import SoundPlayer from './SoundPlayer';
import Status from './Status';
import Utils, { ICssSelector } from '../../Utils';

const DEFAULT_TEMPO_RANGE = {
  from: 1,
  to: 999,
};

interface IProps {
  tempo: number;
  tempoRange?: ITempoRange;
  postProcess?: {
    onTick?: () => void;
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onStop?: () => void;
  };
  inheritedSelector?: ICssSelector;
}
interface IState {
  tempo: number;
}
interface ITempoRange {
  from: number;
  to: number;
}
class Beat extends React.Component<IProps, IState> {
  private timerId!: NodeJS.Timer | number;
  private interval: number;
  private soundPlayer: SoundPlayer;
  private beatState: Status;
  private postTick: () => void;
  private postStart: () => void;
  private postPause: () => void;
  private postResume: () => void;
  private postStop: () => void;
  private tempoRange!: ITempoRange;

  public constructor(props: IProps) {
    super(props);
    this.tempoRange = props.tempoRange ? props.tempoRange : DEFAULT_TEMPO_RANGE;
    const verifiedTempo = this.verifyTempo(props.tempo);
    this.state = {
      tempo: verifiedTempo,
    };
    this.beatState = Status.Stopped;

    // Post process
    this.postTick = props.postProcess && props.postProcess.onTick ? props.postProcess.onTick : () => {};
    this.postStart = props.postProcess && props.postProcess.onStart ? props.postProcess.onStart : () => {};
    this.postPause = props.postProcess && props.postProcess.onPause ? props.postProcess.onPause : () => {};
    this.postResume = props.postProcess && props.postProcess.onResume ? props.postProcess.onResume : () => {};
    this.postStop = props.postProcess && props.postProcess.onStop ? props.postProcess.onStop : () => {};

    // Function binding
    this.onClick = this.onClick.bind(this);
    this.tick = this.tick.bind(this);

    // Initialize
    this.soundPlayer = SoundPlayer.getSoundPlayer();
    this.interval = this.getInterval(verifiedTempo);
  }
  private getInterval(tempo: number): number {
    return 60 / tempo;
  }
  private onClick(e: React.MouseEvent | React.TouchEvent): void {
    this.toggle();
  }
  private verifyTempo(newTempo: number): number {
    const tempoRange = this.tempoRange;
    const lowerTempo = tempoRange.from < tempoRange.to ? tempoRange.from : tempoRange.to;
    const greaterTempo = tempoRange.from < tempoRange.to ? tempoRange.to : tempoRange.from;
    if (newTempo < lowerTempo) {
      throw new RangeError(`Passed tempo is lower than ${lowerTempo}.`);
    } else if (newTempo > greaterTempo) {
      throw new RangeError(`Passed tempo is greater than ${greaterTempo}.`);
    }
    return Math.floor(newTempo);
  }
  private tick(): void {
    this.soundPlayer.start();
    this.timerId = setTimeout(this.tick, this.interval * 1000);
    this.postTick();
  }
  public start(): void {
    this.beatState = Status.Running;
    this.postStart();
    this.tick();
  }
  public pause(): void {
    this.soundPlayer.stop();
    clearTimeout(this.timerId as number);
    this.beatState = Status.Paused;
    this.postPause();
  }
  public resume(): void {
    this.soundPlayer.start();
    this.timerId = setTimeout(this.tick, this.interval * 1000);
    this.beatState = Status.Running;
    this.postResume();
  }
  public stop(): void {
    this.soundPlayer.stop();
    clearTimeout(this.timerId as number);
    this.beatState = Status.Stopped;
    this.postStop();
  }
  public toggle(): void {
    switch (this.beatState) {
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
  public getState(): Status {
    return this.beatState;
  }
  public getTempo(): number {
    return this.state.tempo;
  }
  public setTempo(newTempo: number): void {
    const verifiedTempo = this.verifyTempo(newTempo);
    this.setState({
      tempo: verifiedTempo,
    });
    this.interval = this.getInterval(verifiedTempo);
  }
  /* istanbul ignore next */
  public init(props: IProps): void {
    this.soundPlayer.stop();
    clearTimeout(this.timerId as number);
    this.beatState = Status.Stopped;
    this.tempoRange = props.tempoRange ? props.tempoRange : DEFAULT_TEMPO_RANGE;
    this.setTempo(props.tempo);
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (this.props.inheritedSelector) {
      Utils.inheritSelector(style, this.props.inheritedSelector);
    }
  }
  /* istanbul ignore next */
  public componentWillUnmount(): void {
    this.soundPlayer.stop();
    clearTimeout(this.timerId as number);
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(nextProps: IProps): void {
    if (_.isEqual(this.props, nextProps)) {
      return;
    }
    this.init(nextProps);
  }
  public render(): React.ReactNode {
    return (
      <div 
        className={style.tempo} 
      >
        <div 
          className={style.tapArea} 
          data-testid="beat-taparea" 
          onClick={this.onClick}
        >
          { this.state.tempo }
        </div>
      </div>
    );
  }
}
export default Beat;
