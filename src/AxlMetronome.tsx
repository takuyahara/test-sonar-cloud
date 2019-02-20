import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './AxlMetronome.module.scss';
import TempoSelector from './Tempo/TempoSelector';
import Counter from './Counter/Counter';
import Status from './Counter/Time/Status';

interface IProps {
  tempo: ITempo;
  range: IRange;
  maxDelta: number;
  remaining: number;
  isDescEnabled: boolean;
}
interface IState {
  tempo: ITempo;
}
interface ITempo {
  from: number;
  to: number;
}
interface IRange {
  from: number;
  to: number;
}

class AxlMetronome extends Component<IProps, IState> {
  // Initialize in init()
  private tempo!: ITempo;
  private range!: IRange;
  private maxDelta!: number;
  private remaining!: number;
  private isDescEnabled!: boolean;

  // Ref
  private refTempoSelector: RefObject<TempoSelector>;
  private refCounter: RefObject<Counter>;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      tempo: props.tempo,
    };

    // Ref
    this.refTempoSelector = createRef<TempoSelector>();
    this.refCounter = createRef<Counter>();

    // Bind
    this.onChangeTempo = this.onChangeTempo.bind(this);

    this.init(props);
  }
  private init(props: IProps): void {
    this.tempo = props.tempo;
    this.range = props.range;
    this.maxDelta = props.maxDelta;
    this.remaining = props.remaining;
    this.isDescEnabled = props.isDescEnabled;
  }
  private onChangeTempo(childrenTempo: ITempo): void {
    this.setState({
      tempo: childrenTempo,
    });
  }
  public getState(): Status {
    const refCounter = this.refCounter.current!;
    return refCounter.getState();
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }

    const refTempoSelector = this.refTempoSelector.current!;
    const childrenTempo = refTempoSelector.getChildrenTempo();
    const isTempoFixed = this.props.isDescEnabled && !newProps.isDescEnabled && childrenTempo.from > childrenTempo.to;
    this.init(newProps);
    this.setState({
      tempo: {
        from: isTempoFixed ? childrenTempo.to : childrenTempo.from,
        to: childrenTempo.to,
      },
    });
  }
  public render(): React.ReactNode {
    return (
      <div className={style.AxlMetronome}>
        <TempoSelector 
          ref={this.refTempoSelector}
          defaultTempo={this.tempo} 
          range={this.range} 
          maxDelta={this.maxDelta}
          isDescEnabled={this.isDescEnabled} 
          postProcess={{
            onChangeTempo: this.onChangeTempo,
          }}
          inheritedSelector={style}
        />
        <Counter 
          ref={this.refCounter}
          remaining={this.props.remaining} 
          tempo={this.state.tempo} 
        />
      </div>
    );
  }
}

export default AxlMetronome;
