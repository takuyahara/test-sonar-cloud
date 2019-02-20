import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Beat from 'Counter/Beat/Beat';
import SoundPlayer from 'Counter/Beat/SoundPlayer';
import Status from 'Counter/Beat/Status';

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

// tslint:disable:no-any
describe('Beat', () => {
  let beat: ReactWrapper;
  let beatInstance: Beat;
  let spy: {
    [s: string]: sinon.SinonSpy;
  };
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    sinon.replace(SoundPlayer.prototype as any, 'load', () => {});
    sinon.replace(SoundPlayer.prototype as any, 'createBufferSource', () => {});
    sinon.replace(SoundPlayer.prototype as any, 'getAudioSource', () => {
      return {
        start: () => {},
        stop: () => {},
        disconnect: () => {},
      };
    });
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    beat.update();
    expect(beat).toMatchSnapshot();
    beat.unmount();
    sinon.restore();
  });

  describe('General', () => {
    it('returns interval from tempo', () => {
      beat = mount(<Beat
        tempo={120} 
        />);
      beatInstance = beat.instance() as Beat;
      expect((beatInstance as any).getInterval(120)).toBe(0.5);
    });
  });


  describe('with tempoRange', () => {
    it('verify tempo / Math.floor(tempo)', () => {
      beat = mount(<Beat
        tempo={120} 
        />);
      beatInstance = beat.instance() as Beat;
      beatInstance.setTempo(180.5);
      expect(beatInstance.getTempo()).toBe(180);
    });

    describe('use default', () => {
      beforeEach(() => {
        spy = {
          verifyTempo: sinon.spy(Beat.prototype as any, 'verifyTempo'),
        };
        beat = mount(<Beat
          tempo={120} 
          />);
        beatInstance = beat.instance() as Beat;
      });
      
      it('verify tempo / tempo < 1', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(-1);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is lower than 1.`);
      });

      it('verify tempo / tempo > 999', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(10000);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is greater than 999.`);
      });
    });

    describe('specify / from < to', () => {
      beforeEach(() => {
        spy = {
          verifyTempo: sinon.spy(Beat.prototype as any, 'verifyTempo'),
        };
        beat = mount(<Beat
          tempo={120} 
          tempoRange={{
            from: 100,
            to: 200,
          }}
          />);
        beatInstance = beat.instance() as Beat;
      });
      
      it('verify tempo / tempo < 100', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(90);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is lower than 100.`);
      });

      it('verify tempo / tempo > 200', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(300);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is greater than 200.`);
      });
    });

    describe('specify / from > to', () => {
      beforeEach(() => {
        spy = {
          verifyTempo: sinon.spy(Beat.prototype as any, 'verifyTempo'),
        };
        beat = mount(<Beat
          tempo={120} 
          tempoRange={{
            from: 200,
            to: 100,
          }}
          />);
        beatInstance = beat.instance() as Beat;
      });
      
      it('verify tempo / tempo < 100', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(90);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is lower than 100.`);
      });

      it('verify tempo / tempo > 200', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(300);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is greater than 200.`);
      });
    });

    describe('specify / from === to', () => {
      beforeEach(() => {
        spy = {
          verifyTempo: sinon.spy(Beat.prototype as any, 'verifyTempo'),
        };
        beat = mount(<Beat
          tempo={120} 
          tempoRange={{
            from: 120,
            to: 120,
          }}
          />);
        beatInstance = beat.instance() as Beat;
      });
      
      it('verify tempo / tempo < 120', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(90);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is lower than 120.`);
      });

      it('verify tempo / tempo > 120', () => {
        let errMessage = "";
        try {
          beatInstance.setTempo(300);
        } catch (e) {
          errMessage = e.message;
        }
        expect(spy.verifyTempo.threw(`RangeError`)).toBe(true);
        expect(errMessage).toBe(`Passed tempo is greater than 120.`);
      });
    });
  });

  describe('without post process', () => {
    beforeEach(() => {
      spy = {
        toggle: sinon.spy(Beat.prototype as any, 'toggle'),
        tick: sinon.spy(Beat.prototype as any, 'tick'),
        start: sinon.spy(Beat.prototype, 'start'),
        pause: sinon.spy(Beat.prototype, 'pause'),
        resume: sinon.spy(Beat.prototype, 'resume'),
        stop: sinon.spy(Beat.prototype, 'stop'),
      };
      beat = mount(<Beat
        tempo={120} 
        tempoRange={{
          from: 1,
          to: 999,
        }}
        />);
      beatInstance = beat.instance() as Beat;
    });

    describe('Mouseevent', () => {
      afterEach(() => {
        beat.update();
        expect(beat).toMatchSnapshot();
      });

      it('click 1 time', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(30000);
        expect(beatInstance.getState()).toBe(Status.Running);
        expect(spy.toggle.callCount).toBe(1);
        expect(spy.tick.callCount).toBe(61);
        expect(spy.start.callCount).toBe(1);
        expect(spy.pause.callCount).toBe(0);
        expect(spy.resume.callCount).toBe(0);
        expect(spy.stop.callCount).toBe(0);
      });

      it('click 2 times', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(30000);

        sinon.resetHistory();
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(30000);
        expect(beatInstance.getState()).toBe(Status.Paused);
        expect(spy.toggle.callCount).toBe(1);
        expect(spy.tick.callCount).toBe(0);
        expect(spy.start.callCount).toBe(0);
        expect(spy.pause.callCount).toBe(1);
        expect(spy.resume.callCount).toBe(0);
        expect(spy.stop.callCount).toBe(0);
      });

      it('click 3 times', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(30000);
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(30000);

        sinon.resetHistory();
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(30000);
        expect(beatInstance.getState()).toBe(Status.Running);
        expect(spy.toggle.callCount).toBe(1);
        expect(spy.tick.callCount).toBe(60);
        expect(spy.start.callCount).toBe(0);
        expect(spy.pause.callCount).toBe(0);
        expect(spy.resume.callCount).toBe(1);
        expect(spy.stop.callCount).toBe(0);
      });

      it('click 1 time and stop (intend to be called from parent)', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        beatInstance.stop();
        expect(beatInstance.getState()).toBe(Status.Stopped);
        expect(spy.toggle.callCount).toBe(1);
        expect(spy.tick.callCount).toBe(1);
        expect(spy.start.callCount).toBe(1);
        expect(spy.pause.callCount).toBe(0);
        expect(spy.resume.callCount).toBe(0);
        expect(spy.stop.callCount).toBe(1);
      });
    });
  });

  describe('with post process', () => {
    beforeEach(() => {
      spy = {
        onTick: sinon.spy(),
        onStart: sinon.spy(),
        onPause: sinon.spy(),
        onResume: sinon.spy(),
        onStop: sinon.spy(),
      };
      beat = mount(<Beat
        tempo={120} 
        tempoRange={{
          from: 1,
          to: 999,
        }}
        postProcess={spy}
        />);
      beatInstance = beat.instance() as Beat;
    });

    describe('Mouseevent', () => {
      afterEach(() => {
        beat.update();
        expect(beat).toMatchSnapshot();
      });

      it('click 1 time / invokes onStart()', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);
        expect(spy.onTick.callCount).toBe(5);
        expect(spy.onStart.callCount).toBe(1);
        expect(spy.onPause.callCount).toBe(0);
        expect(spy.onResume.callCount).toBe(0);
        expect(spy.onStop.callCount).toBe(0);
      });

      it('click 2 times / invokes onPause()', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);

        sinon.resetHistory();
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);
        expect(spy.onTick.callCount).toBe(0);
        expect(spy.onStart.callCount).toBe(0);
        expect(spy.onPause.callCount).toBe(1);
        expect(spy.onResume.callCount).toBe(0);
        expect(spy.onStop.callCount).toBe(0);
      });

      it('click 3 times / invokes onResume()', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);

        sinon.resetHistory();
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);
        expect(spy.onTick.callCount).toBe(4);
        expect(spy.onStart.callCount).toBe(0);
        expect(spy.onPause.callCount).toBe(0);
        expect(spy.onResume.callCount).toBe(1);
        expect(spy.onStop.callCount).toBe(0);
      });

      it('click 1 time and stop (intend to be called from parent) / invokes onStop()', () => {
        beat.find(sel('beat-taparea')).simulate('click');
        clock.tick(2000);

        sinon.resetHistory();
        beatInstance.stop();
        expect(spy.onTick.callCount).toBe(0);
        expect(spy.onStart.callCount).toBe(0);
        expect(spy.onPause.callCount).toBe(0);
        expect(spy.onResume.callCount).toBe(0);
        expect(spy.onStop.callCount).toBe(1);
      });
    });
  });

});
