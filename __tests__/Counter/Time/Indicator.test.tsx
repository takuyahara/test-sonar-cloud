import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Indicator from 'Counter/Time/Indicator';
import Timer from 'Counter/Time/Timer';
import Status from 'Counter/Time/Status';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy,
  };
}

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

// tslint:disable:no-any
describe('Indicator', () => {
  let indicator: ReactWrapper;
  let indicatorInstance: Indicator;
  let spy: ISpy = {};
  let clock: sinon.SinonFakeTimers;
  
  afterEach(() => {
    indicator.update();
    expect(indicator).toMatchSnapshot();
    sinon.restore();
    indicator.unmount();
  });

  describe('without post process', () => {
    beforeEach(() => {
      spy = {
        Timer: {
          start: sinon.spy(Timer.prototype, 'start'),
          stop: sinon.spy(Timer.prototype, 'stop'),
          pause: sinon.spy(Timer.prototype, 'pause'),
          resume: sinon.spy(Timer.prototype, 'resume'),
          timerRunner: sinon.spy(Timer.prototype as any, 'timerRunner'),
        },
      };
      clock = sinon.useFakeTimers();
      indicator = mount(<Indicator 
        timeToCount={900} 
      />);
      indicatorInstance = indicator.instance() as Indicator;
      sinon.resetHistory();
    });
    
    it('changes progress', () => {
      indicatorInstance.setProgress(0.25);
      expect(indicatorInstance.getProgress()).toBe(0.25);
    });

    it('calls control function', () => {
      indicatorInstance.start();
      expect(spy.Timer.start.calledOnce).toBe(true);
      indicatorInstance.pause();
      expect(spy.Timer.pause.calledOnce).toBe(true);
      indicatorInstance.resume();
      expect(spy.Timer.resume.calledOnce).toBe(true);
      indicatorInstance.stop();
      expect(spy.Timer.stop.calledOnce).toBe(true);
    });
    
    it('toggles', () => {
      expect(indicatorInstance.getState()).toBe(Status.Stopped);
      indicatorInstance.toggle();
      expect(indicatorInstance.getState()).toBe(Status.Running);
      indicatorInstance.toggle();
      expect(indicatorInstance.getState()).toBe(Status.Paused);
      indicatorInstance.toggle();
      expect(indicatorInstance.getState()).toBe(Status.Running);
      indicatorInstance.toggle();
      expect(indicatorInstance.getState()).toBe(Status.Paused);
    });

    describe('MouseEvent', () => {
      it('clicks 1 time', () => {
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(225 * 1000);

        expect(spy.Timer.timerRunner.callCount).toBe(225);
        expect(indicatorInstance.getState()).toBe(Status.Running);
        expect(indicatorInstance.getProgress()).toBe(0.25);
      });

      it('clicks 2 times', () => {
        // First click
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(225 * 1000);

        // Second click
        sinon.resetHistory();
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(225 * 1000);

        expect(spy.Timer.timerRunner.callCount).toBe(0);
        expect(indicatorInstance.getState()).toBe(Status.Paused);
        expect(indicatorInstance.getProgress()).toBe(0.25);
      });

      it('clicks 3 times', () => {
        // First click
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(225 * 1000);

        // Second click
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(225 * 1000);

        // Third click
        sinon.resetHistory();
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(225 * 1000);
        
        expect(spy.Timer.timerRunner.callCount).toBe(225);
        expect(indicatorInstance.getState()).toBe(Status.Running);
        expect(indicatorInstance.getProgress()).toBe(0.5);
      });

      it('clicks and completes', () => {
        indicator.find(sel('indicator-remaining')).simulate('click');
        clock.tick(900 * 1000);
        clock.tick(1000);

        expect(indicatorInstance.getState()).toBe(Status.Stopped);
        expect(indicatorInstance.getProgress()).toBe(0);
        expect(indicatorInstance.getTimeToCount()).toBe(900);
      });
    });
  });

  describe('with post process', () => {
    beforeEach(() => {
      spy = {
        Indicator: {
          onCount: sinon.spy(),
          onCountStart: sinon.spy(),
          onCountStop: sinon.spy(),
          onCountPause: sinon.spy(),
          onCountResume: sinon.spy(),
          onCountComplete: sinon.spy(),
        },
      };
      clock = sinon.useFakeTimers();
      indicator = mount(<Indicator 
        timeToCount={900} 
        postProcess={spy.Indicator}
      />);
      indicatorInstance = indicator.instance() as Indicator;
      sinon.resetHistory();
    });

    it('clicks 1 time', () => {
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(225 * 1000);

      expect(spy.Indicator.onCount.callCount).toBe(225);
      expect(spy.Indicator.onCountStart.callCount).toBe(1);
      expect(spy.Indicator.onCountStop.callCount).toBe(0);
      expect(spy.Indicator.onCountPause.callCount).toBe(0);
      expect(spy.Indicator.onCountResume.callCount).toBe(0);
      expect(spy.Indicator.onCountComplete.callCount).toBe(0);
    });

    it('clicks 2 times', () => {
      // First click
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(225 * 1000);

      // Second click
      sinon.resetHistory();
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(225 * 1000);

      expect(spy.Indicator.onCount.callCount).toBe(0);
      expect(spy.Indicator.onCountStart.callCount).toBe(0);
      expect(spy.Indicator.onCountStop.callCount).toBe(0);
      expect(spy.Indicator.onCountPause.callCount).toBe(1);
      expect(spy.Indicator.onCountResume.callCount).toBe(0);
      expect(spy.Indicator.onCountComplete.callCount).toBe(0);
    });

    it('clicks 3 times', () => {
      // First click
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(225 * 1000);

      // Second click
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(225 * 1000);

      // Third click
      sinon.resetHistory();
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(225 * 1000);

      expect(spy.Indicator.onCount.callCount).toBe(225);
      expect(spy.Indicator.onCountStart.callCount).toBe(0);
      expect(spy.Indicator.onCountStop.callCount).toBe(0);
      expect(spy.Indicator.onCountPause.callCount).toBe(0);
      expect(spy.Indicator.onCountResume.callCount).toBe(1);
      expect(spy.Indicator.onCountComplete.callCount).toBe(0);
    });

    it('clicks and completes', () => {
      indicator.find(sel('indicator-remaining')).simulate('click');
      clock.tick(900 * 1000);
      clock.tick(1000);

      expect(spy.Indicator.onCount.callCount).toBe(900);
      expect(spy.Indicator.onCountStart.callCount).toBe(1);
      expect(spy.Indicator.onCountStop.callCount).toBe(1);
      expect(spy.Indicator.onCountPause.callCount).toBe(0);
      expect(spy.Indicator.onCountResume.callCount).toBe(0);
      expect(spy.Indicator.onCountComplete.callCount).toBe(1);
    });
  });
});
