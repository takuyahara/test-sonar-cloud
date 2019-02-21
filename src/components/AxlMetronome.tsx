import React, { Component, createRef, RefObject } from 'react';
import isEqual from 'lodash/isEqual';
import style from './AxlMetronome.module.scss';
import TempoSelector from './Tempo/TempoSelector';
import Counter from './Counter/Counter';
import Status from './Counter/Time/Status';
import ConfigCat, { IConfig } from 'utils/ConfigCat';

const NODE_CONFIG = JSON.parse(process.env.NODE_CONFIG!);
const ccConfig = NODE_CONFIG.ConfigCat;

interface IProps {
  tempo: ITempo;
  range: IRange;
  maxDelta: number;
  remaining: number;
  isDescEnabled: boolean;
}
interface IState {
  isConfigLoaded: boolean;
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
      isConfigLoaded: false,
      tempo: props.tempo,
    };

    // Ref
    this.refTempoSelector = createRef<TempoSelector>();
    this.refCounter = createRef<Counter>();

    // Bind
    this.onChangeTempo = this.onChangeTempo.bind(this);
    this.reload = this.reload.bind(this);

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
  private reload(newConfig: IConfig): void {
    // Intended to be called when ConfigCat loads values.
    this.init({
      tempo: {
        from: newConfig.tempoFrom as number,
        to: newConfig.tempoTo as number,
      },
      range: {
        from: newConfig.rangeFrom as number,
        to: newConfig.rangeTo as number,
      },
      maxDelta: newConfig.maxDelta as number,
      remaining: newConfig.remaining as number,
      isDescEnabled: newConfig.isDescEnabled as boolean,
    });
    this.setState({
      isConfigLoaded: true,
      tempo: {
        from: newConfig.tempoFrom as number,
        to: newConfig.tempoTo as number,
      },
    });
  }
  public getState(): Status {
    const refCounter = this.refCounter.current!;
    return refCounter.getState();
  }
  public componentWillMount(): void {
    // if (process.env.NODE_ENV === 'production') {
      const configcat = new ConfigCat(ccConfig.API, {
        identifier: ccConfig.ID,
      });
      configcat.setDefaultConfig({
        tempoFrom: this.props.tempo.from,
        tempoTo: this.props.tempo.to,
        rangeFrom: this.props.range.from,
        rangeTo: this.props.range.to,
        maxDelta: this.props.maxDelta,
        remaining: this.props.remaining,
        isDescEnabled: true,
      }).load(this.reload, 800);
    // }
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (isEqual(this.props, newProps)) {
      return;
    }

    const refTempoSelector = this.refTempoSelector.current!;
    const childrenTempo = refTempoSelector.getChildrenTempo();
    const isTempoFixed = this.props.isDescEnabled && !newProps.isDescEnabled && childrenTempo.from > childrenTempo.to;
    this.setState({
      tempo: {
        from: isTempoFixed ? childrenTempo.to : childrenTempo.from,
        to: childrenTempo.to,
      },
    });
  }
  public render(): React.ReactNode {
    if (!this.state.isConfigLoaded) {
      return (
        <div 
          className={style.AxlMetronome} 
          data-is-ready={false} 
        />
      );
    }
    return (
      <div 
        className={style.AxlMetronome} 
        data-is-ready={true} 
      >
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
          inheritedSelector={style} 
        />
      </div>
    );
  }
}

export default AxlMetronome;
