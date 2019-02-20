import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Counter from 'Counter/Counter';
import { default as Ring } from 'Counter/Time/RingStepped';
import { default as Beat } from 'Counter/Beat/BeatAxl';
import SoundPlayer from 'Counter/Beat/SoundPlayer';
import Status from 'Counter/Time/Status';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy;
  };
}

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

// tslint:disable:no-any
describe('Counter', () => {
  let counter: ReactWrapper;
  let counterInstance: Counter;
  let spy: ISpy = {};
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    // Spy
    spy = {
      Beat: {
        accelerate: sinon.spy(Beat.prototype as any, 'accelerate'),
        onStart: sinon.spy(Beat.prototype as any, 'onStart'),
        onPause: sinon.spy(Beat.prototype as any, 'onPause'),
        onStop: sinon.spy(Beat.prototype as any, 'onStop'),
        onComplete: sinon.spy(Beat.prototype as any, 'onComplete'),
        stop: sinon.spy(Beat.prototype as any, 'stop'),
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

    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    counter.unmount();
    sinon.restore();
  });

  describe('tempo.from < tempo.to', () => {
    beforeEach(() => {
      counter = mount(<Counter 
        remaining={30} 
        tempo={{
          from: 90,
          to: 150,
        }}
      />);
      counterInstance = counter.instance() as Counter;
      sinon.resetHistory();
    });

    describe('MouseEvent', () => {
      afterEach(() => {
        counter.update();
        expect(counter).toMatchSnapshot();
      });

      describe('Timer is not started', () => {
        it('Ring.mousedown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click 1 time', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click 2 times', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          sinon.resetHistory();
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          expect(spy.Beat.accelerate.callCount).toBe(0);
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Indicator.click 3 times', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          sinon.resetHistory();
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click => complete countdown', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(61);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(15000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(31);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });


        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(22500); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(47);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });
      });

      describe('Timer is running', () => {
        beforeEach(() => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
        });

        it('Ring.mousedown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mouseup => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          sinon.resetHistory();
          clock.tick(15000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(31);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          sinon.resetHistory();
          clock.tick(22500); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(47);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });
      });
    });
  });

  describe('tempo.from > tempo.to', () => {
    beforeEach(() => {
      counter = mount(<Counter 
        remaining={30} 
        tempo={{
          from: 150,
          to: 90,
        }}
      />);
      counterInstance = counter.instance() as Counter;
      sinon.resetHistory();
    });

    describe('MouseEvent', () => {
      afterEach(() => {
        counter.update();
        expect(counter).toMatchSnapshot();
      });

      describe('Timer is not started', () => {
        it('Ring.mousedown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click 1 time', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click 2 times', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          sinon.resetHistory();
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          expect(spy.Beat.accelerate.callCount).toBe(0);
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Indicator.click 3 times', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          sinon.resetHistory();
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(3);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click => complete countdown', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(61);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(15000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(31);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });


        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(22500); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(47);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });
      });

      describe('Timer is running', () => {
        beforeEach(() => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
        });

        it('Ring.mousedown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mouseup => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          sinon.resetHistory();
          clock.tick(15000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(31);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          sinon.resetHistory();
          clock.tick(22500); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(47);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });
      });
    });
  });

  describe('tempo.from === tempo.to', () => {
    beforeEach(() => {
      counter = mount(<Counter 
        remaining={30} 
        tempo={{
          from: 90,
          to: 90,
        }}
      />);
      counterInstance = counter.instance() as Counter;
      sinon.resetHistory();
    });

    describe('MouseEvent', () => {
      afterEach(() => {
        counter.update();
        expect(counter).toMatchSnapshot();
      });

      describe('Timer is not started', () => {
        it('Ring.mousedown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(2);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(2);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click 1 time', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(2);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click 2 times', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          sinon.resetHistory();
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          
          expect(spy.Beat.accelerate.callCount).toBe(0);
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Indicator.click 3 times', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          sinon.resetHistory();
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);

          expect(spy.Beat.accelerate.callCount).toBe(2);
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Indicator.click => complete countdown', () => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(30000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(32);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(15000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(17);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });


        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(22500); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(25);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });
      });

      describe('Timer is running', () => {
        beforeEach(() => {
          counter.find(sel('beat-taparea')).simulate('click');
          clock.tick(2000);
          sinon.resetHistory();
        });

        it('Ring.mousedown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mousemove', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          expect(counterInstance.getState()).toBe(Status.Running);
        });

        it('Ring.mousedown => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => Indicator.click', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          counter.find(sel('beat-taparea')).simulate('click');
          expect(counterInstance.getState()).toBe(Status.Paused);
        });

        it('Ring.mousedown => Ring.mouseup => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          sinon.resetHistory();
          clock.tick(15000); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(17);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });

        it('Ring.mousedown => Ring.mousemove => Ring.mouseup => complete countdown', () => {
          counter.find(sel('ring-taparea')).simulate('mousedown', {
            clientX: 300,
            clientY: 150,
          });
          counter.find(sel('ring-global-taparea')).simulate('mousemove', {
            clientX: 150,
            clientY: 0,
          });
          counter.find(sel('ring-global-taparea')).simulate('mouseup');
          sinon.resetHistory();
          clock.tick(22500); // wait until countdown finishes
          clock.tick(1000); // delay to show that tempo has reached to the end
          clock.tick(1000); // factor of safety

          expect(spy.Beat.accelerate.callCount).toBe(25);
          expect(counterInstance.getState()).toBe(Status.Stopped);
        });
      });
    });
  });
});
