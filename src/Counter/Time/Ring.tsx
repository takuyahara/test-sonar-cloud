import React, { Component, createRef, RefObject } from 'react';
import style from './Ring.module.scss';
import Utils, { ICssSelector } from '../../Utils';

export interface IProps {
  mouseEvent?: {
    onMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
    onMouseUp: (e: React.MouseEvent | React.TouchEvent) => void;
  };
  inheritedSelector?: ICssSelector;
}
export interface IState {
  strokeDasharray: string;
  isTapped: boolean;
}
class Ring<P extends IProps = IProps, S extends IState = IState> extends Component<P, S> {
  // Initialize in init()
  protected progress: number = 0;
  protected postMouseMove!: (e: React.MouseEvent | React.TouchEvent) => void;
  protected postMouseDown!: (e: React.MouseEvent | React.TouchEvent) => void;
  protected postMouseUp!: (e: React.MouseEvent | React.TouchEvent) => void;

  // Ref
  protected refRing: RefObject<SVGSVGElement>;
  protected refMask: RefObject<SVGCircleElement>;

  public constructor(props: P) {
    super(props);
    this.state = {
      strokeDasharray: "",
      isTapped: false,
    } as S;

    // Ref
    this.refRing = createRef<SVGSVGElement>();
    this.refMask = createRef<SVGCircleElement>();

    // Post process
    this.postMouseMove = props.mouseEvent ? props.mouseEvent.onMouseMove : () => {};
    this.postMouseDown = props.mouseEvent ? props.mouseEvent.onMouseDown : () => {};
    this.postMouseUp = props.mouseEvent ? props.mouseEvent.onMouseUp : () => {};

    // Method binding
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);

    // Initialize
    this.progress = 0;
  }
  protected getBoundingClientRect(elem: Element): DOMRect {
    // Excluded to be replaced in test.
    return elem.getBoundingClientRect() as DOMRect;
  }
  protected getRatio(clientX: number, clientY: number): number {
    const refRing = this.refRing.current!;
    const ringGeometry = this.getBoundingClientRect(refRing);
    const centerX = ringGeometry.x + ringGeometry.width / 2;
    const centerY = ringGeometry.y + ringGeometry.height / 2;
    const dist = {
      x: clientX - centerX,
      y: clientY - centerY,
    };
    const radian = Math.atan2(dist.y, dist.x);
    const degree = radian * 180 / Math.PI;
    const ratio = (degree + 180) / 360;
    return ratio;
  }
  protected mouseMove(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();
    if (!this.state.isTapped) {
      return;
    }

    const clientX = isMouseEvent ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    const clientY = isMouseEvent ? (e as React.MouseEvent).clientY : (e as React.TouchEvent).changedTouches[0].clientY;
    const progress = this.getRatio(clientX, clientY);
    this.setProgress(progress);
    this.postMouseMove(e);
  }
  protected mouseDown(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();
    
    const clientX = isMouseEvent ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    const clientY = isMouseEvent ? (e as React.MouseEvent).clientY : (e as React.TouchEvent).changedTouches[0].clientY;
    const progress = this.getRatio(clientX, clientY);
    this.setProgress(progress);
    this.postMouseDown(e);
    this.setState({
      isTapped: true,
    });
  }
  protected mouseUp(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();

    this.postMouseUp(e);
    this.setState({
      isTapped: false,
    });
  }
  /* istanbul ignore next */
  protected getR(svgObject: SVGElement): number {
    return parseInt(getComputedStyle(svgObject).getPropertyValue('r'));
  }
  protected updateStrokeDasharray(): void {
    const refMask = this.refMask.current!;
    const r = this.getR(refMask);
    const pieLength = r * 2 * Math.PI;
    const strokeDasharray = this.progress * pieLength + " " + pieLength;
    this.setState({
      strokeDasharray,
    });
  }
  public reset(): void {
    this.setProgress(0.0);
  }
  public setProgress(progress: number): void {
    this.progress = progress;
    this.updateStrokeDasharray();
  }
  public getProgress(): number {
    return this.progress;
  }
  /* istanbul ignore next */
  // tslint:disable-next-line:no-any
  public init(...args: any): void {
    this.reset();
  }
  /* istanbul ignore next */
  public componentWillMount(): void {
    if (this.props.inheritedSelector) {
      Utils.inheritSelector(style, this.props.inheritedSelector!);
    }
  }
  /* istanbul ignore next */
  public componentDidMount(): void {
    this.updateStrokeDasharray();
  }
  public render(): React.ReactNode {
    return (
      <div 
        className={style.ring} 
      >
        <svg
          ref={this.refRing} 
        >
          <defs>
              <radialGradient gradientUnits="userSpaceOnUse" id="maskGradient" spreadMethod="reflect">
                <stop offset="30%" />
                <stop offset="100%" />
              </radialGradient>
          </defs>
          <circle 
            className={style.remaining} 
          />
          <circle ref={this.refMask} 
            className={style.mask} 
            stroke="url(#maskGradient)" 
            strokeDasharray={this.state.strokeDasharray} 
          />
          <circle 
            className={style.tapArea} 
            data-testid="ring-taparea" 
            onMouseDown={this.mouseDown} 
            onTouchStart={this.mouseDown} 
          />
          <circle 
            className={style.tapAreaMask} 
          />
        </svg>
        <div 
          className={style.globalTapArea} 
          data-testid="ring-global-taparea" 
          data-is-bubbled={this.state.isTapped} 
          onMouseUp={this.mouseUp} 
          onMouseMove={this.mouseMove} 
          onTouchEnd={this.mouseUp} 
          onTouchMove={this.mouseMove} 
        />
      </div>
    );
  }
}
export default Ring;