import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { default as Beat } from 'Counter/Beat/BeatAxl';
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
  });
  afterEach(() => {
    beat.update();
    expect(beat).toMatchSnapshot();
    beat.unmount();
    sinon.restore();
  });

  describe('General', () => {
    beforeEach(() => {
      beat = mount(<Beat
        remaining={30} 
        tempo={{
          from: 90, 
          to: 150, 
        }}
        />);
      beatInstance = beat.instance() as Beat;
    });

    it('set/get tempo', () => {
      expect(beatInstance.getTempo()).toBe(90);
      beatInstance.setProgress(0.25);
      expect(beatInstance.getTempo()).toBe(105);
    });
  });

  describe('without post process', () => {
    beforeEach(() => {
      spy = {
        onAccelerate: sinon.spy(Beat.prototype as any, 'onAccelerate'),
        onTick: sinon.spy(Beat.prototype as any, 'onTick'),
        onStart: sinon.spy(Beat.prototype as any, 'onStart'),
        onStop: sinon.spy(Beat.prototype as any, 'onStop'),
        onPause: sinon.spy(Beat.prototype as any, 'onPause'),
        onResume: sinon.spy(Beat.prototype as any, 'onResume'),
        onComplete: sinon.spy(Beat.prototype as any, 'onComplete'),
      };
    });

    describe('Tempo increases', () => {
      beforeEach(() => {
        beat = mount(<Beat
          remaining={30} 
          tempo={{
            from: 90, 
            to: 150, 
          }}
          />);
        beatInstance = beat.instance() as Beat;
        clock = sinon.useFakeTimers();
      });
  
      describe('Mouseevent', () => {
        it('click 1 time / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(3);
          expect(spy.onTick.callCount).toBe(4);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 2 times / Paused', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Paused);
          expect(spy.onAccelerate.callCount).toBe(0);
          expect(spy.onTick.callCount).toBe(0);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(1);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 3 times / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          clock.tick(32); // offset that caused by clearTimeout
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(4);
          expect(spy.onTick.callCount).toBe(3);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(1);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click and finish', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety
  
          expect(beatInstance.getState()).toBe(Status.Stopped);
          expect(spy.onAccelerate.callCount).toBe(60);
          expect(spy.onTick.callCount).toBe(62);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(1);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(1);
        });
      });
    });
  
    describe('Tempo decreases', () => {
      beforeEach(() => {
        beat = mount(<Beat
          remaining={30} 
          tempo={{
            from: 150, 
            to: 90, 
          }}
          />);
        beatInstance = beat.instance() as Beat;
        clock = sinon.useFakeTimers();
      });
  
  
      describe('Mouseevent', () => {
        it('click 1 time / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(3);
          expect(spy.onTick.callCount).toBe(5);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 2 times / Paused', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Paused);
          expect(spy.onAccelerate.callCount).toBe(0);
          expect(spy.onTick.callCount).toBe(0);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(1);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 3 times / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          clock.tick(55); // offset that caused by clearTimeout

          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(4);
          expect(spy.onTick.callCount).toBe(5);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(1);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click and finish', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(31000); // wait until countdown finishes
          // clock.tick(5150); // offset that caused by clearTimeout
  
          expect(beatInstance.getState()).toBe(Status.Stopped);
          expect(spy.onAccelerate.callCount).toBe(60);
          expect(spy.onTick.callCount).toBe(63);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(1);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(1);
        });
      });
    });
    
    describe(`Tempo doesn't change`, () => {
      beforeEach(() => {
        beat = mount(<Beat
          remaining={30} 
          tempo={{
            from: 90, 
            to: 90, 
          }}
          />);
        beatInstance = beat.instance() as Beat;
        clock = sinon.useFakeTimers();
      });
  
      describe('Mouseevent', () => {
        it('click 1 time / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(2);
          expect(spy.onTick.callCount).toBe(4);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 2 times / Paused', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Paused);
          expect(spy.onAccelerate.callCount).toBe(0);
          expect(spy.onTick.callCount).toBe(0);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(1);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 3 times / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(2);
          expect(spy.onTick.callCount).toBe(3);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(1);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click and finish', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety
  
          expect(beatInstance.getState()).toBe(Status.Stopped);
          expect(spy.onAccelerate.callCount).toBe(31);
          expect(spy.onTick.callCount).toBe(47);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(1);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(1);
        });
      });
    });
  });

  describe('with post process', () => {
    beforeEach(() => {
      spy = {
        onAccelerate: sinon.spy(),
        onTick: sinon.spy(),
        onStart: sinon.spy(),
        onStop: sinon.spy(),
        onPause: sinon.spy(),
        onResume: sinon.spy(),
        onComplete: sinon.spy(),
      };
    });
    describe('Tempo increases', () => {
      beforeEach(() => {
        beat = mount(<Beat
          remaining={30} 
          tempo={{
            from: 90, 
            to: 150, 
          }}
          postProcess={spy}
          />);
        beatInstance = beat.instance() as Beat;
        clock = sinon.useFakeTimers();
      });
  
      describe('Mouseevent', () => {
        it('click 1 time / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(3);
          expect(spy.onTick.callCount).toBe(4);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 2 times / Paused', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Paused);
          expect(spy.onAccelerate.callCount).toBe(0);
          expect(spy.onTick.callCount).toBe(0);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(1);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 3 times / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          clock.tick(32); // offset that caused by clearTimeout
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(4);
          expect(spy.onTick.callCount).toBe(3);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(1);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click and finish', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety
  
          expect(beatInstance.getState()).toBe(Status.Stopped);
          expect(spy.onAccelerate.callCount).toBe(60);
          expect(spy.onTick.callCount).toBe(62);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(1);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(1);
        });
      });
    });
  
    describe('Tempo decreases', () => {
      beforeEach(() => {
        beat = mount(<Beat
          remaining={30} 
          tempo={{
            from: 150, 
            to: 90, 
          }}
          postProcess={spy}
          />);
        beatInstance = beat.instance() as Beat;
        clock = sinon.useFakeTimers();
      });
  
  
      describe('Mouseevent', () => {
        it('click 1 time / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(3);
          expect(spy.onTick.callCount).toBe(5);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 2 times / Paused', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Paused);
          expect(spy.onAccelerate.callCount).toBe(0);
          expect(spy.onTick.callCount).toBe(0);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(1);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 3 times / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          clock.tick(55); // offset that caused by clearTimeout
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(4);
          expect(spy.onTick.callCount).toBe(5);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(1);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click and finish', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety
  
          expect(beatInstance.getState()).toBe(Status.Stopped);
          expect(spy.onAccelerate.callCount).toBe(60);
          expect(spy.onTick.callCount).toBe(63);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(1);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(1);
        });
      });
    });
    
    describe(`Tempo doesn't change`, () => {
      beforeEach(() => {
        beat = mount(<Beat
          remaining={30} 
          tempo={{
            from: 90, 
            to: 90, 
          }}
          postProcess={spy}
          />);
        beatInstance = beat.instance() as Beat;
        clock = sinon.useFakeTimers();
      });
  
      describe('Mouseevent', () => {
        it('click 1 time / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(2);
          expect(spy.onTick.callCount).toBe(4);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 2 times / Paused', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Paused);
          expect(spy.onAccelerate.callCount).toBe(0);
          expect(spy.onTick.callCount).toBe(0);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(1);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click 3 times / Running', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          sinon.resetHistory();
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
    
          expect(beatInstance.getState()).toBe(Status.Running);
          expect(spy.onAccelerate.callCount).toBe(2);
          expect(spy.onTick.callCount).toBe(3);
          expect(spy.onStart.callCount).toBe(0);
          expect(spy.onStop.callCount).toBe(0);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(1);
          expect(spy.onComplete.callCount).toBe(0);
        });
    
        it('click and finish', () => {
          beat.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety
  
          expect(beatInstance.getState()).toBe(Status.Stopped);
          expect(spy.onAccelerate.callCount).toBe(31);
          expect(spy.onTick.callCount).toBe(47);
          expect(spy.onStart.callCount).toBe(1);
          expect(spy.onStop.callCount).toBe(1);
          expect(spy.onPause.callCount).toBe(0);
          expect(spy.onResume.callCount).toBe(0);
          expect(spy.onComplete.callCount).toBe(1);
        });
      });
    });
  });
});
