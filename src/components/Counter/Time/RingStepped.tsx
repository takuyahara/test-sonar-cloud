import _ from 'lodash';
import Ring, { IProps as IPropsRing, IState as IStateRing } from './Ring';

interface IProps extends IPropsRing {
  step: number;
}
interface IState extends IStateRing {
  // nothing to extend
}
class RingStepped extends Ring<IProps, IState> {
  private step: number;

  public constructor(props: IProps) {
    super(props);
    this.step = props.step;
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
    const progressStepped = Math.floor((progress * this.step)) / this.step;
    this.setProgress(progressStepped);
    this.postMouseMove(e);
  }
  protected mouseDown(e: React.MouseEvent | React.TouchEvent): void {
    const isMouseEvent = e.type.substr(0, 5) === 'mouse';
    isMouseEvent && e.preventDefault();
    
    const clientX = isMouseEvent ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).changedTouches[0].clientX;
    const clientY = isMouseEvent ? (e as React.MouseEvent).clientY : (e as React.TouchEvent).changedTouches[0].clientY;
    const progress = this.getRatio(clientX, clientY);
    const progressStepped = Math.floor((progress * this.step)) / this.step;
    this.setProgress(progressStepped);
    this.postMouseDown(e);
    this.setState({
      isTapped: true,
    });
  }
  /* istanbul ignore next */
  public init(props: IProps): void {
    super.init();
    this.step = props.step;
  }
  /* istanbul ignore next */
  public componentWillReceiveProps(newProps: IProps): void {
    if (_.isEqual(this.props, newProps)) {
      return;
    }

    this.init(newProps);
    this.reset();
  }
}
export default RingStepped;