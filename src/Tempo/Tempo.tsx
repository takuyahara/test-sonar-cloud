import React, { Component, createRef, RefObject } from 'react';
import _ from 'lodash';
import style from './Tempo.module.scss';
import Utils, { ICssSelector } from '../Utils';

interface IState {
  tempoCurr: number;
}
interface IProps {
  role: string;
  tempo: number;
  maxDelta: number;
  range: {
    from: number;
    to: number;
  };
  onChangeTempo?: (t: Tempo) => void;
  inheritedSelector?: ICssSelector;
}
interface IBCRSize {
  width: number;
  height: number;
}
class Tempo extends Component<IProps, IState> {
  // Initialize in init()
  private tempoPrev!: number;
  private role!: IProps['role'];
  private maxDelta!: IProps['maxDelta'];
  private range!: IProps['range'];
  private isTapped!: boolean;
  private distFrom!: number;
  private postChangeTempo!: (t: Tempo) => void;

  // Ref
  private refDiv: RefObject<HTMLDivElement>;

  public constructor(props: IProps) {
    super(props);
    this.state = {
      tempoCurr: props.tempo,
    };
    this.init(props);

    // Ref
    this.refDiv = createRef<HTMLDivElement>();

    // Method binding
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
  }
  private init(props: IProps): void {
    // Props
    this.role = props.role;
    this.maxDelta = props.maxDelta;
    this.range = props.range;
    
    // Misc
    this.isTapped = false;
    this.distFrom = 0;
    this.tempoPrev = this.state.tempoCurr;
    this.postChangeTempo = props.onChangeTempo !== undefined  ? props.onChangeTempo : () => {};
  }
  /* istanbul ignore next */
  private isPortrait(): boolean {
    // return ['portrait-primary', 'portrait-secondary'].includes(
    //   // tslint:disable-next-line:no-any
    //   ((screen as any).orientation || (screen as any).mozOrientation || (screen as any).msOrientation).type,
    // );
    return document.body.clientHeight > document.body.clientWidth;
  }
  private mouseMove(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();
    if (!this.isTapped) { return; }
    
    const tempoPrev = this.tempoPrev;
    const clientX = isMouseEvent ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    const clientY = isMouseEvent ? (e as React.MouseEvent).clientY : (e as React.TouchEvent).changedTouches[0].clientY;
    const dist = this.isPortrait() ? this.getDist(this.distFrom, clientX) : this.getDist(clientY, this.distFrom);
    const newTempo = tempoPrev + parseInt(dist.toString());
    this.changeTempo(newTempo);
  }
  private mouseDown(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();

    const clientX = isMouseEvent ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    const clientY = isMouseEvent ? (e as React.MouseEvent).clientY : (e as React.TouchEvent).changedTouches[0].clientY;
    this.distFrom = this.isPortrait() ? clientX : clientY;
    this.isTapped = true;
    this.tempoPrev = this.state.tempoCurr;
  }
  private mouseUp(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();

    this.isTapped = false;
    this.tempoPrev = this.state.tempoCurr;
  }
  /* istanbul ignore next */
  private getBCRSize(elem: HTMLElement): IBCRSize {
    // Excluded to be replaced in test.
    const { width, height } = elem.getBoundingClientRect();
    return {
      width,
      height,
    };
  }
  private normalizeTempo(tempo: number): number {
    let newTempo = tempo;
    if (newTempo < this.range.from) { 
      newTempo = this.range.from; 
    } else if (newTempo > this.range.to) { 
      newTempo = this.range.to; 
    }
    return newTempo;
  }
  public getTempo(): number {
    return this.state.tempoCurr;
  }
  public changeTempo(tempo: number, dontRunCallback?: boolean): void {
    const newTempo = this.normalizeTempo(tempo);
    
    const cbSetState = () => {
      if (!dontRunCallback) {
        const caller = this;
        this.postChangeTempo(caller);
      }
    };
    this.setState({
      tempoCurr: newTempo,
    }, cbSetState);
  }
  public getDist(distFrom: number, distTo: number): number {
    const refDiv = this.refDiv.current!;
    const { width, height } = this.getBCRSize(refDiv);
    const dist = distTo - distFrom;
    const length = this.isPortrait() ? width : height;
    const distNormalized = (dist / length) * this.maxDelta;
    return distNormalized;
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
    newProps.tempo !== this.props.tempo && this.changeTempo(newProps.tempo, true);
    const updateRange = (newRange: IProps['range']) => {
      if (this.state.tempoCurr < newRange.from) { 
        this.setState({
          tempoCurr: newRange.from,
        });
        this.tempoPrev = newRange.from;
      } else if (this.state.tempoCurr > newRange.to) { 
        this.setState({
          tempoCurr: newRange.to,
        });
        this.tempoPrev = newRange.to;
      }
    };
    updateRange(newProps.range);
  }
  public render(): React.ReactNode {
    return (
      <div 
        ref={this.refDiv} 
        className={style[this.role]} 
        data-testid={`temposelector-${this.role}`}
        onMouseDown={this.mouseDown} 
        onMouseUp={this.mouseUp} 
        onMouseMove={this.mouseMove} 
        onTouchStart={this.mouseDown} 
        onTouchEnd={this.mouseUp} 
        onTouchMove={this.mouseMove} 
      >
        <span>
          {this.state.tempoCurr}
        </span>
      </div>
    );
  }
}
export default Tempo;
