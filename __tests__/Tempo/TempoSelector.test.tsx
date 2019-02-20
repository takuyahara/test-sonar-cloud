import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import TempoSelector from 'Tempo/TempoSelector';
import Tempo from 'Tempo/Tempo';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy,
  };
}

configure({ adapter: new Adapter() });

let tempoSelector: ReactWrapper;
let tempoSelectorInstance: TempoSelector;
let spy: ISpy = {};

// tslint:disable:no-any
describe('isDescEnabled = true', () => {
  beforeEach(() => {
    // Sinon
    spy = {
      TempoSelector: {
        onChangeTempo: sinon.spy(TempoSelector.prototype as any, 'onChangeTempo'),
      },
    };
    sinon.replace(Tempo.prototype as any, 'isPortrait', () => true);
    sinon.replace(Tempo.prototype as any, 'getBCRSize', () => ({
      width: 500,
      height: 800,
    }));

    // Enzyme
    tempoSelector = mount(
      <TempoSelector 
        maxDelta={100} 
        defaultTempo={{
          from: 90,
          to: 120,
        }} 
        range={{
          from: 50,
          to: 200,
        }} 
        isDescEnabled={true} 
      />);
    tempoSelectorInstance = tempoSelector.instance() as TempoSelector;

    // Sinon - reset
    sinon.resetHistory();
  });
  afterEach(() => {
    expect(tempoSelector).toMatchSnapshot();
    sinon.restore();
    tempoSelector.unmount();
  });

  it('returns default tempo', () => {
    expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
      from: 90, 
      to: 120,
    });
  });

  describe('MouseEvent', () => {
    it('normal', () => {
      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find('.to').simulate('mousedown', {
        type: 'mousedown',
        clientX: 350,
        clientY: 0,
      });
      tempoSelector.find('.to').simulate('mousemove', {
        type: 'mousemove',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.to').simulate('mouseup', {
        type: 'mouseup',
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 90,
        to: 70,
      });
    });

    it('toggleTempoChange => .from MouseEvent', () => {
      tempoSelectorInstance.toggleTempoChange();
      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });

    it('toggleTempoChange => .to MouseEvent', () => {
      tempoSelectorInstance.toggleTempoChange();
      tempoSelector.find('.to').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.to').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find('.to').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });
  });

  describe('TouchEvent', () => {
    it('normal', () => {
      tempoSelector.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchend', {
        type: "touchend",
      });

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchend', {
        type: "touchend",
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find('.to').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 350,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.to').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.to').simulate('touchend', {
        type: "touchend",
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 90,
        to: 70,
      });
    });

    it('toggleTempoChange => .from TouchEvent', () => {
      tempoSelectorInstance.toggleTempoChange();
      tempoSelector.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchend', {
        type: "touchend",
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });

    it('toggleTempoChange => .to TouchEvent', () => {
      tempoSelectorInstance.toggleTempoChange();
      tempoSelector.find('.to').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.to').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });

      tempoSelector.find('.to').simulate('touchend', {
        type: "touchend",
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });
  });
});

describe('isDescEnabled = false', () => {
  beforeEach(() => {
    // Sinon
    spy = {
      TempoSelector: {
        onChangeTempo: sinon.spy(TempoSelector.prototype as any, 'onChangeTempo'),
      },
    };
    sinon.replace(Tempo.prototype as any, 'isPortrait', () => true);
    sinon.replace(Tempo.prototype as any, 'getBCRSize', () => ({
      width: 500,
      height: 800,
    }));

    // Enzyme
    tempoSelector = mount(
      <TempoSelector 
        maxDelta={100} 
        defaultTempo={{
          from: 90,
          to: 120,
        }} 
        range={{
          from: 50,
          to: 200,
        }} 
      />);
    tempoSelectorInstance = tempoSelector.instance() as TempoSelector;

    // Sinon - reset
    sinon.resetHistory();
  });
  afterEach(() => {
    expect(tempoSelector).toMatchSnapshot();
    sinon.restore();
    tempoSelector.unmount();
  });


  it('returns default tempo', () => {
    expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
      from: 90, 
      to: 120,
    });
  });

  describe('MouseEvent', () => {
    it('normal', () => {
      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 200,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 110,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 130,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find('.to').simulate('mousedown', {
        type: 'mousedown',
        clientX: 350,
        clientY: 0,
      });
      tempoSelector.find('.to').simulate('mousemove', {
        type: 'mousemove',
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find('.to').simulate('mouseup', {
        type: 'mouseup',
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 70,
        to: 70,
      });
    });

    it('.from 90 => 150, .to 150 => 140', () => {
      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });

      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 400,
        clientY: 0,
      });

      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });

      tempoSelector.find('.to').simulate('mousedown', {
        type: 'mousedown',
        clientX: 250,
        clientY: 0,
      });

      tempoSelector.find('.to').simulate('mousemove', {
        type: 'mousemove',
        clientX: 200,
        clientY: 0,
      });

      tempoSelector.find('.to').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 140,
        to: 140,
      });
    });

    it('toggleTempoChange => .from MouseEvent', () => {
      tempoSelectorInstance.toggleTempoChange();

      tempoSelector.find('.from').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });

      tempoSelector.find('.from').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });

      tempoSelector.find('.from').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });

    it('toggleTempoChange => .to MouseEvent', () => {
      tempoSelectorInstance.toggleTempoChange();

      tempoSelector.find('.to').simulate('mousedown', {
        type: 'mousedown',
        clientX: 100,
        clientY: 0,
      });

      tempoSelector.find('.to').simulate('mousemove', {
        type: 'mousemove',
        clientX: 300,
        clientY: 0,
      });

      tempoSelector.find('.to').simulate('mouseup', {
        type: 'mouseup',
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });
  });

  describe('TouchEvent', () => {
    it('normal', () => {
      tempoSelector.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 200,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find('.from').simulate('touchend', {
        type: "touchend",
      });
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 110,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });

      tempoSelector.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      
      tempoSelector.find('.from').simulate('touchend', {
        type: "touchend",
      });

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 130,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find('.to').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 350,
            clientY: 0,
          },
        ],
      });

      tempoSelector.find('.to').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      
      tempoSelector.find('.to').simulate('touchend', {
        type: "touchend",
      });

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 70,
        to: 70,
      });
    });

    it('toggleTempoChange => .from TouchEvent', () => {
      tempoSelectorInstance.toggleTempoChange();

      tempoSelector.find('.from').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });

      tempoSelector.find('.from').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      
      tempoSelector.find('.from').simulate('touchend', {
        type: "touchend",
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });

    it('toggleTempoChange => .to TouchEvent', () => {
      tempoSelectorInstance.toggleTempoChange();

      tempoSelector.find('.to').simulate('touchstart', {
        type: "touchstart",
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });

      tempoSelector.find('.to').simulate('touchmove', {
        type: "touchmove",
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      
      tempoSelector.find('.to').simulate('touchend', {
        type: "touchend",
      });

      expect(spy.TempoSelector.onChangeTempo.notCalled).toBe(true);
    });
  });
});
