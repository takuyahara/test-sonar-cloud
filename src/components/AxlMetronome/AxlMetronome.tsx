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
  private tempo: ITempo;
  private range: IRange;
  private maxDelta: number;
  private remaining: number;
  private isDescEnabled: boolean;

  // Ref
  private refTempoSelector: RefObject<TempoSelector>;
  private refCounter: RefObject<Counter>;

  public constructor(props: IProps) {
    super(props);
    /* istanbul ignore next */
    this.state = {
      isConfigLoaded: process.env.NODE_ENV === 'production' ? false : true,
      tempo: props.tempo,
    };

    // Ref
    this.refTempoSelector = createRef<TempoSelector>();
    this.refCounter = createRef<Counter>();

    // Bind
    this.onChangeTempo = this.onChangeTempo.bind(this);
    this.reload = this.reload.bind(this);

    this.tempo = this.props.tempo;
    this.range = this.props.range;
    this.maxDelta = this.props.maxDelta;
    this.remaining = this.props.remaining;
    this.isDescEnabled = this.props.isDescEnabled;
  }
  private onChangeTempo(newTempo: ITempo): void {
    const refCounter = this.refCounter.current!;
    refCounter.setTempo(newTempo);
  }
  /* istanbul ignore next */
  private reload(newConfig: IConfig): void {
    // Intended to be called when ConfigCat loads values.
    this.tempo = {
      from: newConfig.tempoFrom as number,
      to: newConfig.tempoTo as number,
    };
    this.range = {
      from: newConfig.rangeFrom as number,
      to: newConfig.rangeTo as number,
    };
    this.maxDelta = newConfig.maxDelta as number;
    this.remaining = newConfig.remaining as number;
    this.isDescEnabled = newConfig.isDescEnabled as boolean;

    this.setState({
      isConfigLoaded: true,
      tempo: {
        from: newConfig.tempoFrom as number,
        to: newConfig.tempoTo as number,
      },
    });
  }
  public getStatus(): Status {
    const refCounter = this.refCounter.current!;
    return refCounter.getStatus();
  }
  public init(newProps: IProps): void {
    const refTempoSelector = this.refTempoSelector.current!;
    const refCounter = this.refCounter.current!;
    refTempoSelector.init({
      defaultTempo: newProps.tempo,
      range: newProps.range,
      maxDelta: newProps.maxDelta,
      isDescEnabled: newProps.isDescEnabled,
    });
    refCounter.init(newProps);
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (process.env.NODE_ENV === 'production') {
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
        isDescEnabled: this.props.isDescEnabled,
      }).load(this.reload, 800);
    }
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (isEqual(this.props, newProps)) {
      return;
    }

    const lowerTempo = newProps.tempo.from < newProps.tempo.to ? newProps.tempo.from : newProps.tempo.to;
    const greaterTempo = newProps.tempo.from < newProps.tempo.to ? newProps.tempo.to : newProps.tempo.from;
    if (newProps.range.from > newProps.range.to) {
      throw new RangeError(`Range.from cannot be greater than Range.to.`);
    }
    if (!newProps.isDescEnabled && newProps.tempo.from > newProps.tempo.to) {
      throw new RangeError(`Tempo.From cannot be greater than Tempo.To when isDescEnabled is false.`);
    }
    if (greaterTempo > newProps.range.to) {
      throw new RangeError(`Tempo cannot be greater than Range.To.`);
    }
    if (lowerTempo < newProps.range.from) {
      throw new RangeError(`Tempo cannot be less than Range.From.`);
    }
    this.init(newProps);
  }
  public render(): React.ReactNode {
    /* istanbul ignore if */
    if (!this.state.isConfigLoaded) {
      return (
        <div 
          className={style.AxlMetronome} 
          data-is-ready={false} 
        >
          <noscript key="noscript" id={style.noscript}>
            This app works with JavaScript.
          </noscript>
        </div>
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
          remaining={this.remaining} 
          tempo={this.tempo} 
        />
      </div>
    );
  }
}

export default AxlMetronome;
