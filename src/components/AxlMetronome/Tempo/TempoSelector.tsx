import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import Tempo from './Tempo';
import style from './TempoSelector.module.scss';
import Utils, { ICssSelector } from 'utils/Utils';

interface IProps {
  defaultTempo: {
    from: number;
    to: number;
  };
  range: {
    from: number;
    to: number;
  };
  maxDelta: number;
  isDescEnabled?: boolean;
  postProcess?: {
    onChangeTempo: (childrenTempo: IChildrenTempo) => void;
  };
  inheritedSelector?: ICssSelector;
}
interface IState {
  // empty
}
interface IChildren {
  from: Tempo;
  to: Tempo;
  [key: string]: Tempo;
}
interface IChildrenTempo {
  from: number;
  to: number;
}
class TempoSelector extends Component<IProps, IState> {
  // Initialize in init()
  private defaultTempo!: IProps['defaultTempo'];
  private range!: IProps['range'];
  private maxDelta!: IProps['maxDelta'];
  private isDescEnabled!: boolean;
  private postChangeTempo!: (childrenTempo: IChildrenTempo) => void;

  // Ref
  private refTempoFrom: RefObject<Tempo>;
  private refTempoTo: RefObject<Tempo>;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      // empty
    };

    // Post process
    this.postChangeTempo = props.postProcess && props.postProcess.onChangeTempo ? 
      props.postProcess.onChangeTempo : (childrenTempo: IChildrenTempo) => {};

    // Method binding
    this.onChangeTempo = this.onChangeTempo.bind(this);
    
    // Ref
    this.refTempoFrom = createRef<Tempo>();
    this.refTempoTo = createRef<Tempo>();

    // Initialize
    this.defaultTempo = props.defaultTempo;
    this.range = props.range;
    this.maxDelta = props.maxDelta;
    this.isDescEnabled = props.isDescEnabled !== undefined ? props.isDescEnabled : false;
  }
  private verifyTempo(caller: Tempo): void
  {
    const refTempoFrom = this.refTempoFrom.current!;
    const refTempoTo = this.refTempoTo.current!;
    const tempoFrom = parseInt(refTempoFrom.getTempo().toString());
    const tempoTo = parseInt(refTempoTo.getTempo().toString());

    if (tempoFrom > tempoTo) {
      const peer = this.getPeer(caller.props.role);
      peer.changeTempo(caller.getTempo(), true);
    }
  }
  private onChangeTempo(caller: Tempo): void {
    // Verify if isDescEnabled is false
    !this.isDescEnabled && this.verifyTempo(caller);
    this.postChangeTempo(this.getChildrenTempo());
  }
  private getPeer(className: string): Tempo {
    const refTempoFrom = this.refTempoFrom.current!;
    const refTempoTo = this.refTempoTo.current!;
    const children: IChildren = {
      from: refTempoTo,
      to: refTempoFrom,
    };
    return children[className];
  }
  public getChildren(): IChildren {
    const refTempoFrom = this.refTempoFrom.current!;
    const refTempoTo = this.refTempoTo.current!;
    return {
      from: refTempoFrom,
      to: refTempoTo,
    };
  }
  public getChildrenTempo(): IChildrenTempo {
    const children = this.getChildren();
    return {
      from: children.from.getTempo(),
      to: children.to.getTempo(),
    };
  }
  public init(props: IProps): void {
    this.defaultTempo = props.defaultTempo;
    this.range = props.range;
    this.maxDelta = props.maxDelta;
    this.isDescEnabled = props.isDescEnabled !== undefined ? props.isDescEnabled : false;

    const refTempoFrom = this.refTempoFrom.current!;
    const refTempoTo = this.refTempoTo.current!;
    refTempoFrom.init({
      role: "from",
      tempo: props.defaultTempo.from,
      maxDelta: props.maxDelta,
      range: props.range,
    });
    refTempoTo.init({
      role: "to",
      tempo: props.defaultTempo.to,
      maxDelta: props.maxDelta,
      range: props.range,
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
    
    if (newProps.range.from > newProps.range.to) {
      throw new RangeError(`Range.from cannot be greater than Range.to.`);
    }
    if (!newProps.isDescEnabled && newProps.defaultTempo.from > newProps.defaultTempo.to) {
      throw new RangeError(`DefaultTempo.From cannot be greater than DefaultTempo.To when isDescEnabled is false.`);
    }
    this.init(newProps);
  }
  public render(): React.ReactNode {
    return (
      <div className={style.tempoSelector}>
        <Tempo 
          ref={this.refTempoFrom} 
          role="from" 
          tempo={this.defaultTempo.from} 
          range={this.range} 
          maxDelta={this.maxDelta} 
          onChangeTempo={this.onChangeTempo}
          inheritedSelector={style}
          />
        <Tempo 
          ref={this.refTempoTo} 
          role="to" 
          tempo={this.defaultTempo.to} 
          range={this.range} 
          maxDelta={this.maxDelta} 
          onChangeTempo={this.onChangeTempo}
          inheritedSelector={style}
          />
      </div>
    );
  }
}
export default TempoSelector;