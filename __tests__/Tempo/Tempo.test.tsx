import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Tempo from 'AxlMetronome/Tempo/Tempo';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy;
  };
}

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

let tempo: ReactWrapper;
let tempoInstance: Tempo;
let spy: ISpy = {};

// tslint:disable:no-any
describe('Tempo', () => {
  beforeEach(() => {
    // Sinon
    spy = {
      Tempo: {
        getDist: sinon.spy(Tempo.prototype, "getDist"),
        changeTempo: sinon.spy(Tempo.prototype, "changeTempo"),
        mouseDown: sinon.spy(Tempo.prototype as any, "mouseDown"),
        mouseMove: sinon.spy(Tempo.prototype as any, "mouseMove"),
        mouseUp: sinon.spy(Tempo.prototype as any, "mouseUp"),        
      },
    };
  });
  afterEach(() => {
    expect(tempo).toMatchSnapshot();
    tempo.unmount();
    sinon.restore();
  });

  describe('isPortrait = true', () => {
    beforeEach(() => {
      sinon.replace(Tempo.prototype as any, 'isPortrait', () => true);
      sinon.replace(Tempo.prototype as any, 'getBCRSize', () => ({
        width: 500,
        height: 800,
      }));
      
      // Enzyme
      tempo = mount(
        <Tempo 
          role="from" 
          tempo={80} 
          maxDelta={100} 
          range={{
            from: 50,
            to: 200,
          }} 
        />);
      tempoInstance = tempo.instance() as Tempo;
    
      // Sinon - reset
      sinon.resetHistory();
    });

    it('changes tempo', () => {
      expect(tempoInstance.getTempo()).toBe(80);
      tempoInstance.changeTempo(150);
      expect(tempoInstance.getTempo()).toBe(150);
    });

    it('normalize tempo to min when passed value is less than than min', () => {
      tempoInstance.changeTempo(30);
      expect(tempoInstance.getTempo()).toBe(50);
    });

    it('normalize tempo to max when passed value is more than than max', () => {
      tempoInstance.changeTempo(300);
      expect(tempoInstance.getTempo()).toBe(200);
    });

    describe('MouseEvent', () => {
      it('mouseMove and nothing happens', () => {
        tempo.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 300,
          clientY: 0,
        });

        expect(spy.Tempo.getDist.notCalled).toBe(true);
        expect(spy.Tempo.changeTempo.notCalled).toBe(true);
      });

      it('mouseDown', () => {
        tempo.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 100,
          clientY: 0,
        });
    
        expect((tempoInstance as any).distFrom).toBe(100);
        expect((tempoInstance as any).isTapped).toBe(true);
      });
    
      it('mouseDown => mouseMove', () => {
        tempo.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 100,
          clientY: 0,
        });
        tempo.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 300,
          clientY: 0,
        });

        expect(spy.Tempo.getDist.calledOnceWith(100, 300)).toBe(true);
        expect(spy.Tempo.getDist.returned(40)).toBe(true);
        expect(spy.Tempo.changeTempo.calledOnceWith(120)).toBe(true);
      });
    
      it('mouseDown => mouseMove => mouseUp', () => {
        tempo.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 100,
          clientY: 0,
        });
        tempo.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 300,
          clientY: 0,
        });
        tempo.find(sel('temposelector-from')).simulate('mouseup');

        expect((tempoInstance as any).isTapped).toBe(false);
      });
    });

    describe('TouchEvent', () => {
      it('touchMove and nothing happens', () => {
        tempo.find(sel('temposelector-from')).simulate('touchmove', {
          changedTouches: [
            {
              clientX: 300,
              clientY: 0,
            },
          ],
        });

        expect(spy.Tempo.getDist.notCalled).toBe(true);
        expect(spy.Tempo.changeTempo.notCalled).toBe(true);
      });

      it('touchStart', () => {
        tempo.find(sel('temposelector-from')).simulate('touchstart', {
          changedTouches: [
            {
              clientX: 100,
              clientY: 0,
            },
          ],
        });
    
        expect((tempoInstance as any).distFrom).toBe(100);
        expect((tempoInstance as any).isTapped).toBe(true);
      });

      it('touchStart => touchMove', () => {
        tempo.find(sel('temposelector-from')).simulate('touchstart', {
          changedTouches: [
            {
              clientX: 100,
              clientY: 0,
            },
          ],
        });
        tempo.find(sel('temposelector-from')).simulate('touchmove', {
          changedTouches: [
            {
              clientX: 300,
              clientY: 0,
            },
          ],
        });

        expect(spy.Tempo.getDist.calledOnceWith(100, 300)).toBe(true);
        expect(spy.Tempo.getDist.returned(40)).toBe(true);
        expect(spy.Tempo.changeTempo.calledOnceWith(120)).toBe(true);
      });

      it('touchStart => touchMove => touchEnd', () => {
        tempo.find(sel('temposelector-from')).simulate('touchstart', {
          changedTouches: [
            {
              clientX: 100,
              clientY: 0,
            },
          ],
        });
        tempo.find(sel('temposelector-from')).simulate('touchmove', {
          changedTouches: [
            {
              clientX: 300,
              clientY: 0,
            },
          ],
        });
        tempo.find(sel('temposelector-from')).simulate('touchend');

        expect((tempoInstance as any).isTapped).toBe(false);
      });
    });
  });

  describe('isPortrait = false', () => {
    beforeEach(() => {
      sinon.replace(Tempo.prototype as any, 'isPortrait', () => false);
      sinon.replace(Tempo.prototype as any, 'getBCRSize', () => ({
        width: 800,
        height: 500,
      }));
      
      // Enzyme
      tempo = mount(
        <Tempo 
          role="from" 
          tempo={80} 
          maxDelta={100} 
          range={{
            from: 50,
            to: 200,
          }} 
        />);
      tempoInstance = tempo.instance() as Tempo;
    
      // Sinon - reset
      sinon.resetHistory();
    });

    describe('MouseEvent', () => {
      it('mouseDown', () => {
        tempo.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 0,
          clientY: 300,
        });
    
        expect((tempoInstance as any).distFrom).toBe(300);
        expect((tempoInstance as any).isTapped).toBe(true);
      });
    
      it('mouseDown => mouseMove', () => {
        tempo.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 0,
          clientY: 300,
        });
        tempo.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 0,
          clientY: 100,
        });
        expect(spy.Tempo.getDist.calledOnceWith(100, 300)).toBe(true);
        expect(spy.Tempo.getDist.returned(40)).toBe(true);
        expect(spy.Tempo.changeTempo.calledOnceWith(120)).toBe(true);
      });
    
      it('mouseDown => mouseMove => mouseUp', () => {
        tempo.find(sel('temposelector-from')).simulate('mousedown', {
          clientX: 0,
          clientY: 300,
        });
        tempo.find(sel('temposelector-from')).simulate('mousemove', {
          clientX: 0,
          clientY: 100,
        });
        tempo.find(sel('temposelector-from')).simulate('mouseup');

        expect((tempoInstance as any).isTapped).toBe(false);
      });
    });

    describe('TouchEvent', () => {
      it('touchStart', () => {
        tempo.find(sel('temposelector-from')).simulate('touchstart', {
          changedTouches: [
            {
              clientX: 0,
              clientY: 300,
            },
          ],
        });
    
        expect((tempoInstance as any).distFrom).toBe(300);
        expect((tempoInstance as any).isTapped).toBe(true);
      });

      it('touchStart => touchMove', () => {
        tempo.find(sel('temposelector-from')).simulate('touchstart', {
          changedTouches: [
            {
              clientX: 0,
              clientY: 300,
            },
          ],
        });
        tempo.find(sel('temposelector-from')).simulate('touchmove', {
          changedTouches: [
            {
              clientX: 0,
              clientY: 100,
            },
          ],
        });

        expect(spy.Tempo.getDist.calledOnceWith(100, 300)).toBe(true);
        expect(spy.Tempo.getDist.returned(40)).toBe(true);
        expect(spy.Tempo.changeTempo.calledOnceWith(120)).toBe(true);
      });

      it('touchStart => touchMove => touchEnd', () => {
        tempo.find(sel('temposelector-from')).simulate('touchstart', {
          changedTouches: [
            {
              clientX: 0,
              clientY: 300,
            },
          ],
        });
        tempo.find(sel('temposelector-from')).simulate('touchmove', {
          changedTouches: [
            {
              clientX: 0,
              clientY: 100,
            },
          ],
        });
        tempo.find(sel('temposelector-from')).simulate('touchend');

        expect((tempoInstance as any).isTapped).toBe(false);
      });
    });
  });
});
