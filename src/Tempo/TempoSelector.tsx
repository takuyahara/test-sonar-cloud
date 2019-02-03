import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import Tempo from './Tempo';
import style from './TempoSelector.module.scss';
import Utils, { ICssSelector } from '../Utils';

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
  isHandlerEnabled?: boolean;
  isDescEnabled?: boolean;
  inheritedSelector?: ICssSelector;
}
interface IState {
  isHandlerEnabled: boolean;
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
  private isHandlerEnabled!: boolean;
  private isDescEnabled!: boolean;

  // Ref
  private refTempoFrom: RefObject<Tempo>;
  private refTempoTo: RefObject<Tempo>;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      isHandlerEnabled: true,
    };

    // Method binding
    this.onChangeTempo = this.onChangeTempo.bind(this);
    
    // Ref
    this.refTempoFrom = createRef<Tempo>();
    this.refTempoTo = createRef<Tempo>();

    // Initialize
    this.init(props);
  }
  private init(props: IProps): void {
    this.defaultTempo = props.defaultTempo;
    this.range = props.range;
    this.maxDelta = props.maxDelta;
    this.isHandlerEnabled = props.isHandlerEnabled !== undefined ? props.isHandlerEnabled : true;
    this.isDescEnabled = props.isDescEnabled !== undefined ? props.isDescEnabled : false;
  }
  private verifyTempo(caller: Tempo): void
  {
    const refTempoFrom = this.refTempoFrom.current!;
    const refTempoTo = this.refTempoTo.current!;
    const tempoFrom = parseInt(refTempoFrom.tempo.toString());
    const tempoTo = parseInt(refTempoTo.tempo.toString());

    if (tempoFrom > tempoTo) {
      const peer = this.getPeer(caller.props.role);
      peer.changeTempo(caller.tempo, true);
    }
  }
  private onChangeTempo(caller: Tempo): void {
    // Verify if isDescEnabled is false
    !this.isDescEnabled && this.verifyTempo(caller);
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
  public toggleTempoChange(): void {
    const refTempoFrom = this.refTempoFrom.current!;
    const refTempoTo = this.refTempoTo.current!;
    refTempoFrom.toggleHandler();
    refTempoTo.toggleHandler();
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
      from: children.from.tempo,
      to: children.to.tempo,
    };
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
    
    this.init(newProps);
    this.setState({
      isHandlerEnabled: this.isHandlerEnabled,
    });
    !this.isDescEnabled && this.verifyTempo(this.refTempoTo.current!);
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
          isHandlerEnabled={this.state.isHandlerEnabled} 
          onChangeTempo={this.onChangeTempo}
          inheritedSelector={style}
          />
        <Tempo 
          ref={this.refTempoTo} 
          role="to" 
          tempo={this.defaultTempo.to} 
          range={this.range} 
          maxDelta={this.maxDelta} 
          isHandlerEnabled={this.state.isHandlerEnabled} 
          onChangeTempo={this.onChangeTempo}
          inheritedSelector={style}
          />
      </div>
    );
  }
}
export default TempoSelector;