import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Remaining from 'Counter/Time/Remaining';

interface ISpy {
  [s: string]: sinon.SinonSpy;
}

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

// tslint:disable:no-any
describe('Indicator', () => {
  let remaining: ReactWrapper;
  let remainingInstance: Remaining;
  let spy: ISpy = {};
  
  afterEach(() => {
    remaining.update();
    expect(remaining).toMatchSnapshot();
    sinon.restore();
    remaining.unmount();
  });

  describe('without post process', () => {
    beforeEach(() => {
      remaining = mount(<Remaining 
        timeToCount={900} 
      />);
      remainingInstance = remaining.instance() as Remaining;
      sinon.resetHistory();
    });

    it('formats number', () => {
      expect((remainingInstance as any).formatTime(0)).toBe('00:00');
      expect((remainingInstance as any).formatTime(9)).toBe('00:09');
      expect((remainingInstance as any).formatTime(10)).toBe('00:10');
      expect((remainingInstance as any).formatTime(59)).toBe('00:59');
      expect((remainingInstance as any).formatTime(60)).toBe('01:00');
      expect((remainingInstance as any).formatTime(69)).toBe('01:09');
      expect((remainingInstance as any).formatTime(70)).toBe('01:10');
      expect((remainingInstance as any).formatTime(600)).toBe('10:00');
      expect((remainingInstance as any).formatTime(3599)).toBe('59:59');
    });
  
    it('setRemaining', () => {
      remainingInstance.setRemaining(60);
    });

    describe('MouseEvent', () => {
      it('click', () => {
        const postClick = sinon.spy(remainingInstance as any, 'postClick');
        remaining.find(sel('indicator-remaining')).simulate('click');
        expect(postClick.calledOnce).toBe(true);
      });  
    });

    describe('TouchEvent', () => {
      it('touchEnd', () => {
        const postTouchEnd = sinon.spy(remainingInstance as any, 'postTouchEnd');
        remaining.find(sel('indicator-remaining')).simulate('touchend');
        expect(postTouchEnd.calledOnce).toBe(true);
      });  
    });
  });

  describe('with post process', () => {
    beforeEach(() => {
      spy = {
        onClick: sinon.spy(),
        onTouchEnd: sinon.spy(),
      };
      remaining = mount(<Remaining 
        timeToCount={900} 
        postProcess={spy} 
      />);
      remainingInstance = remaining.instance() as Remaining;
      sinon.resetHistory();
    });

    describe('MouseEvent', () => {
      it('invokes postClick', () => {
        remaining.find(sel('indicator-remaining')).simulate('click');
        expect(spy.onClick.calledOnce).toBe(true);
      });
    });

    describe('TouchEvent', () => {
      it('invokes postTouchEnd', () => {
        remaining.find(sel('indicator-remaining')).simulate('touchend');
        expect(spy.onTouchEnd.calledOnce).toBe(true);
      });
    });
  });
});
