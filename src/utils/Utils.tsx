import cn from 'classnames';

export interface ICssSelector {
  [s: string]: string;
}

class Utils {
  private constructor() {
    // Just implement static functions
  }
  public static safeSubtraction(a: number, b: number): number {
    const aDecimalUnit = a.toString().indexOf(`.`) === -1 ? 0 : a.toString().split(`.`)[1].length;
    const bDecimalUnit = b.toString().indexOf(`.`) === -1 ? 0 : b.toString().split(`.`)[1].length;
    const exponential = aDecimalUnit > bDecimalUnit ? aDecimalUnit : bDecimalUnit;
    return (a * Math.pow(10, exponential) - b * Math.pow(10, exponential)) / Math.pow(10, exponential);
  }
  public static inheritSelector(base: ICssSelector, extend: ICssSelector): void {
    Object.keys(base).forEach((style: string) => {
      if (extend[style]) {
        base[style] = cn(base[style], extend[style]);
      }
    });
  }
}
export default Utils;
