import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import TempoSelector from 'AxlMetronome/Tempo/TempoSelector';
import Tempo from 'AxlMetronome/Tempo/Tempo';

interface ISpy {
  [s: string]: {
    [s: string]: sinon.SinonSpy,
  };
}

configure({ adapter: new Adapter() });
const sel = (id: string) => `[data-testid="${id}"]`;

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
      tempoSelector.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find(sel('temposelector-to')).simulate('mousedown', {
        clientX: 350,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-to')).simulate('mousemove', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 90,
        to: 70,
      });
    });
  });

  describe('TouchEvent', () => {
    it('normal', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('touchstart', {
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchmove', {
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchend');

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('touchstart', {
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchmove', {
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchend');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 120,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find(sel('temposelector-to')).simulate('touchstart', {
        changedTouches: [
          {
            clientX: 350,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-to')).simulate('touchmove', {
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchend');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 90,
        to: 70,
      });
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
      tempoSelector.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 200,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 110,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 300,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 130,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find(sel('temposelector-to')).simulate('mousedown', {
        clientX: 350,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-to')).simulate('mousemove', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 70,
        to: 70,
      });
    });

    it('.from 90 => 150, .to 150 => 140', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('mousedown', {
        clientX: 100,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mousemove', {
        clientX: 400,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');

      tempoSelector.find(sel('temposelector-to')).simulate('mousedown', {
        clientX: 250,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-to')).simulate('mousemove', {
        clientX: 200,
        clientY: 0,
      });
      tempoSelector.find(sel('temposelector-from')).simulate('mouseup');

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 140,
        to: 140,
      });
    });
  });

  describe('TouchEvent', () => {
    it('normal', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('touchstart', {
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchmove', {
        changedTouches: [
          {
            clientX: 200,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchend');
      
      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 110,
        to: 120,
      });
    });

    it('`from` > `to`', () => {
      tempoSelector.find(sel('temposelector-from')).simulate('touchstart', {
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchmove', {
        changedTouches: [
          {
            clientX: 300,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchend');

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 130,
        to: 130,
      });
    });

    it('`to` < `from`', () => {
      tempoSelector.find(sel('temposelector-to')).simulate('touchstart', {
        changedTouches: [
          {
            clientX: 350,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-to')).simulate('touchmove', {
        changedTouches: [
          {
            clientX: 100,
            clientY: 0,
          },
        ],
      });
      tempoSelector.find(sel('temposelector-from')).simulate('touchend');

      expect(tempoSelectorInstance.getChildrenTempo()).toMatchObject({
        from: 70,
        to: 70,
      });
    });
  });
});
