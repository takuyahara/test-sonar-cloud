import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import AxlMetronome from '../src/AxlMetronome';
import { default as Ring } from 'Counter/Time/RingStepped';
import { default as Beat } from 'Counter/Beat/BeatAxl';
import SoundPlayer from 'Counter/Beat/SoundPlayer';
import Status from 'Counter/Time/Status';
import Tempo from 'Tempo/Tempo';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy,
  };
}

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

// tslint:disable:no-any
describe('Axl Metronome', () => {
  let axlMetronome: ReactWrapper;
  let axlMetronomeInstance: AxlMetronome;
  let spy: ISpy = {};
  let clock: sinon.SinonFakeTimers;
  
  beforeEach(() => {
    // Sinon
    spy = {
      Beat: {
        onAccelerate: sinon.spy(Beat.prototype as any, 'onAccelerate'),
      },
    };

    // Replace
    sinon.replace(SoundPlayer.prototype as any, 'load', () => {});
    sinon.replace(SoundPlayer.prototype as any, 'createBufferSource', () => {});
    sinon.replace(SoundPlayer.prototype as any, 'getAudioSource', () => {
      return {
        start: () => {},
        stop: () => {},
        disconnect: () => {},
      };
    });
    sinon.replace(Ring.prototype as any, 'getR', () => 145);
    sinon.replace(Element.prototype as any, 'getBoundingClientRect', () => ({
      x: 0, 
      y: 0, 
      width: 300, 
      height: 300, 
    }));
    sinon.replace(Tempo.prototype as any, 'isPortrait', () => true);
    sinon.replace(Tempo.prototype as any, 'getBCRSize', () => ({
      width: 500,
      height: 800,
    }));

    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    axlMetronome.update();
    expect(axlMetronome).toMatchSnapshot();
    sinon.restore();
    axlMetronome.unmount();
  });

  describe('isDescEnabled = true', () => {
    beforeEach(() => {
      axlMetronome = mount(
        <AxlMetronome 
          tempo={{
            from: 90,
            to: 150,
          }} 
          range={{
            from: 60,
            to: 780,
          }} 
          maxDelta={100} 
          remaining={30 * 60} 
          isDescEnabled={true} 
        />);
      axlMetronomeInstance = axlMetronome.instance() as AxlMetronome;

      // Sinon - reset
      sinon.resetHistory();
    });

    it('swipe tempo.from => tempo.from > tempo.to', () => {
      axlMetronome.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 50,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 450,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-from')).simulate('mouseup');
      expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);
    });

    it('swipe tempo.to => tempo.from > tempo.to', () => {
      axlMetronome.find(sel('temposelector-to')).simulate('mousedown', {
        clientX: 450,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-to')).simulate('mousemove', {
        clientX: 50,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-to')).simulate('mouseup');
      expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);
    });

    it('swipe tempo.from 10 times => tempo.from is in range', () => {
      // tempo.from += 800
      for (let i = 0, l = 10; i < l; i++)
      {
        axlMetronome.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 50,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 450,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-from')).simulate('mouseup');
      }
    });

    it('swipe tempo.to 10 times => tempo.to is in range', () => {
      // tempo.to -= 800
      for (let i = 0, l = 10; i < l; i++)
      {
        axlMetronome.find(sel('temposelector-to')).simulate('mousedown', {
          clientX: 450,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-to')).simulate('mousemove', {
          clientX: 50,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-to')).simulate('mouseup');
      }
    });

    it('reset metronome if tempo has change when running', () => {
      // Tempo change by tempo.from
      axlMetronome.find(sel('beat-taparea')).simulate('click');
      expect(axlMetronomeInstance.getState()).toBe(Status.Running);
      
      axlMetronome.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 50,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 450,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-from')).simulate('mouseup');
      expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);

      // Tempo change by tempo.to
      axlMetronome.find(sel('beat-taparea')).simulate('click');
      expect(axlMetronomeInstance.getState()).toBe(Status.Running);
      
      axlMetronome.find(sel('temposelector-to')).simulate('mousedown', {
        clientX: 450,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-to')).simulate('mousemove', {
        clientX: 50,
        clientY: 0,
      });
      axlMetronome.find(sel('temposelector-to')).simulate('mouseup');
      expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);
    });

    describe('tempo.from < tempo.to', () => {
      // tempo.from = 90; tempo.to = 150;
      it('start metronome', () => {
        axlMetronome.find(sel('beat-taparea')).simulate('click');
        clock.tick(15 * 60 * 1000);
        expect(spy.Beat.onAccelerate.callCount).toBe(30);
        expect(axlMetronomeInstance.getState()).toBe(Status.Running);
      });

      it('start metronome => complete', () => {
        axlMetronome.find(sel('beat-taparea')).simulate('click');
        clock.tick(30 * 60 * 1000); // wait until countdown finishes
        clock.tick(1000); // delay to show that tempo has reached to the end
        clock.tick(500); // factor of safety
        expect(spy.Beat.onAccelerate.callCount).toBe(60);
        expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);
      });
    });

    describe('tempo.from > tempo.to', () => {
      // tempo.from = 90; tempo.to = 70;
      beforeEach(() => {
        axlMetronome.find(sel('temposelector-to')).simulate('mousedown', {
          clientX: 450,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-to')).simulate('mousemove', {
          clientX: 50,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-to')).simulate('mouseup');
      });
      
      it('start metronome', () => {
        axlMetronome.find(sel('beat-taparea')).simulate('click');
        clock.tick(15 * 60 * 1000);
        clock.tick(500); // factor of safety
        expect(spy.Beat.onAccelerate.callCount).toBe(10);
        expect(axlMetronomeInstance.getState()).toBe(Status.Running);
      });

      it('start metronome => complete', () => {
        axlMetronome.find(sel('beat-taparea')).simulate('click');
        clock.tick(30 * 60 * 1000); // wait until countdown finishes
        clock.tick(1000); // delay to show that tempo has reached to the end
        clock.tick(500); // factor of safety
        expect(spy.Beat.onAccelerate.callCount).toBe(20);
        expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);
      });
    });

    describe('tempo.from === tempo.to', () => {
      // tempo.from = 150; tempo.to = 150;
      beforeEach(() => {
        axlMetronome.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 100,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 400,
          clientY: 0,
        });
        axlMetronome.find(sel('temposelector-from')).simulate('mouseup');
      });
      
      it('start metronome', () => {
        axlMetronome.find(sel('beat-taparea')).simulate('click');
        clock.tick(15 * 60 * 1000);
        clock.tick(500); // factor of safety
        expect(spy.Beat.onAccelerate.callCount).toBe(15 * 60 + 1);
        expect(axlMetronomeInstance.getState()).toBe(Status.Running);
      });

      it('start metronome => complete', () => {
        axlMetronome.find(sel('beat-taparea')).simulate('click');
        clock.tick(30 * 60 * 1000); // wait until countdown finishes
        clock.tick(1000); // delay to show that tempo has reached to the end
        clock.tick(500); // factor of safety
        expect(spy.Beat.onAccelerate.callCount).toBe(30 * 60 + 1);
        expect(axlMetronomeInstance.getState()).toBe(Status.Stopped);
      });
    });
  });
});