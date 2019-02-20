import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Timer from 'Counter/Time/Timer';
import Status from 'Counter/Time/Status';

interface ISpy {
  [s: string]: sinon.SinonSpy;
}

configure({ adapter: new Adapter() });

// tslint:disable:no-any
describe('Timer', () => {
  let timer: ReactWrapper;
  let timerInstance: Timer;
  let spy: ISpy = {};
  let clock: sinon.SinonFakeTimers;
  
  afterEach(() => {
    timerInstance.stop();
    sinon.restore();
    timer.unmount();
  });

  describe('General', () => {
    beforeEach(() => {
      spy = {
        start: sinon.spy(Timer.prototype, 'start'),
        stop: sinon.spy(Timer.prototype, 'stop'),
        pause: sinon.spy(Timer.prototype, 'pause'),
        resume: sinon.spy(Timer.prototype, 'resume'),
        timerRunner: sinon.spy(Timer.prototype as any, 'timerRunner'),
        isTimerCompleted: sinon.spy(Timer.prototype as any, 'isTimerCompleted'),
      };
      clock = sinon.useFakeTimers();
      timer = mount(<Timer 
        timeToCount={10} 
      />);
      timerInstance = timer.instance() as Timer;
      sinon.resetHistory();
    });

    it('sets/gets progress', () => {
      expect(timerInstance.getProgress()).toBe(0);
      timerInstance.setProgress(0.25);
      expect(timerInstance.getProgress()).toBe(0.2);
    });

    it('returns fixed progress', () => {
      timerInstance.setProgress(0.7);
      expect(timerInstance.getProgress()).toBe(0.7);
      timerInstance.setProgress(0.8);
      expect(timerInstance.getProgress()).toBe(0.8);
      timerInstance.setProgress(0.9);
      expect(timerInstance.getProgress()).toBe(0.9);
    });
  });

  describe('without post process', () => {
    beforeEach(() => {
      spy = {
        start: sinon.spy(Timer.prototype, 'start'),
        stop: sinon.spy(Timer.prototype, 'stop'),
        pause: sinon.spy(Timer.prototype, 'pause'),
        resume: sinon.spy(Timer.prototype, 'resume'),
        timerRunner: sinon.spy(Timer.prototype as any, 'timerRunner'),
        isTimerCompleted: sinon.spy(Timer.prototype as any, 'isTimerCompleted'),
      };
      clock = sinon.useFakeTimers();
      timer = mount(<Timer 
        timeToCount={900} 
      />);
      timerInstance = timer.instance() as Timer;
      sinon.resetHistory();
    });
    
    it('toggles 1 time', () => {
      expect(timerInstance.getState()).toBe(Status.Stopped);
      expect(timerInstance.getProgress()).toBe(0);
      timerInstance.toggle();
      clock.tick(225 * 1000);

      expect(spy.start.calledOnce).toBe(true);
      expect(spy.timerRunner.callCount).toBe(225);
      expect(spy.isTimerCompleted.calledOnceWith(-1)).toBe(false);
      expect(timerInstance.getState()).toBe(Status.Running);
      expect(timerInstance.getProgress()).toBe(0.25);
    });

    it('toggles 2 times', () => {
      // First toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);
      sinon.resetHistory();

      // Second toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);

      expect(spy.pause.calledOnce).toBe(true);
      expect(spy.timerRunner.callCount).toBe(0);
      expect(spy.isTimerCompleted.calledOnceWith(-1)).toBe(false);
      expect(timerInstance.getState()).toBe(Status.Paused);
      expect(timerInstance.getProgress()).toBe(0.25);
    });

    it('toggles 3 times', () => {
      // First toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);

      // Second toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);
      sinon.resetHistory();

      // Third toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);

      expect(spy.resume.calledOnce).toBe(true);
      expect(spy.timerRunner.callCount).toBe(225);
      expect(spy.isTimerCompleted.calledOnceWith(-1)).toBe(false);
      expect(timerInstance.getState()).toBe(Status.Running);
      expect(timerInstance.getProgress()).toBe(0.5);
    });

    it('stops when countdown finished', () => {
      timerInstance.toggle();
      clock.tick(900 * 1000);
      clock.tick(1000);

      expect(spy.stop.calledOnce).toBe(true);
      expect(spy.timerRunner.callCount).toBe(901);
      expect(spy.isTimerCompleted.lastCall.args).toEqual([-1]);
      expect(timerInstance.getState()).toBe(Status.Stopped);
      expect(timerInstance.getProgress()).toBe(0);
    });
  });

  describe('with post process', () => {
    beforeEach(() => {
      spy = {
        onCount: sinon.spy(),
        onCountStart: sinon.spy(),
        onCountStop: sinon.spy(),
        onCountPause: sinon.spy(),
        onCountResume: sinon.spy(),
        onCountComplete: sinon.spy(),
      };
      clock = sinon.useFakeTimers();
      timer = mount(<Timer 
        timeToCount={900} 
        postProcess={spy}
      />);
      timerInstance = timer.instance() as Timer;
      sinon.resetHistory();
    });

    it('toggles 1 time', () => {
      timerInstance.toggle();
      clock.tick(225 * 1000);

      expect(spy.onCount.callCount).toBe(225);
      expect(spy.onCountStart.callCount).toBe(1);
      expect(spy.onCountStop.callCount).toBe(0);
      expect(spy.onCountPause.callCount).toBe(0);
      expect(spy.onCountResume.callCount).toBe(0);
      expect(spy.onCountComplete.callCount).toBe(0);
    });

    it('toggles 2 times', () => {
      // First toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);
      sinon.resetHistory();

      // Second toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);

      expect(spy.onCount.callCount).toBe(0);
      expect(spy.onCountStart.callCount).toBe(0);
      expect(spy.onCountStop.callCount).toBe(0);
      expect(spy.onCountPause.callCount).toBe(1);
      expect(spy.onCountResume.callCount).toBe(0);
      expect(spy.onCountComplete.callCount).toBe(0);
    });

    it('toggles 3 times', () => {
      // First toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);

      // Second toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);
      sinon.resetHistory();

      // Third toggle
      timerInstance.toggle();
      clock.tick(225 * 1000);

      expect(spy.onCount.callCount).toBe(225);
      expect(spy.onCountStart.callCount).toBe(0);
      expect(spy.onCountStop.callCount).toBe(0);
      expect(spy.onCountPause.callCount).toBe(0);
      expect(spy.onCountResume.callCount).toBe(1);
      expect(spy.onCountComplete.callCount).toBe(0);
    });

    it('stops when countdown finished', () => {
      timerInstance.toggle();
      clock.tick(900 * 1000);
      clock.tick(1000);

      expect(spy.onCount.callCount).toBe(900);
      expect(spy.onCountStart.callCount).toBe(1);
      expect(spy.onCountStop.callCount).toBe(1);
      expect(spy.onCountPause.callCount).toBe(0);
      expect(spy.onCountResume.callCount).toBe(0);
      expect(spy.onCountComplete.callCount).toBe(1);
    });
  });
});
