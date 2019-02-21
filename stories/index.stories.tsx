import React, { createRef, RefObject } from 'react';
import { storiesOf } from '@storybook/react';
import { button, number, boolean } from '@storybook/addon-knobs';

import AxlMetronome from 'AxlMetronome/AxlMetronome';
import Counter from 'AxlMetronome/Counter/Counter';
import BeatAxl from 'AxlMetronome/Counter/Beat/BeatAxl';
import Beat from 'AxlMetronome/Counter/Beat/Beat';
import Time from 'AxlMetronome/Counter/Time/Time';
import Indicator from 'AxlMetronome/Counter/Time/Indicator';
import RingStepped from 'AxlMetronome/Counter/Time/RingStepped';
import Ring from 'AxlMetronome/Counter/Time/Ring';
import TempoSelector from 'AxlMetronome/Tempo/TempoSelector';
import Tempo from 'AxlMetronome/Tempo/Tempo';

const refAxlMetronome: RefObject<AxlMetronome> = createRef<AxlMetronome>();
const refCounter: RefObject<Counter> = createRef<Counter>();
const refBeatAxl: RefObject<BeatAxl> = createRef<BeatAxl>();
const refBeat: RefObject<Beat> = createRef<Beat>();
const refTime: RefObject<Time> = createRef<Time>();
const refIndicator: RefObject<Indicator> = createRef<Indicator>();
const refRingStepped: RefObject<RingStepped> = createRef<RingStepped>();
const refRing: RefObject<Ring> = createRef<Ring>();
const refTempoSelector: RefObject<TempoSelector> = createRef<TempoSelector>();
const refTempo: RefObject<Tempo> = createRef<Tempo>();

storiesOf('Axl Metronome', module)
  .add('Axl Metronome', () => {
    const tempo = {
      from: number('Tempo from', 90),
      to: number('Tempo to', 160),
    };
    const range = {
      from: number('Range from', 60),
      to: number('Range to', 780),
    };
    const maxDelta = number('maxDelta', 100);
    const remaining = number('Remaining time', 30 * 60);
    const isDescEnabled = boolean('isDescEnabled', false);
    return (
        <AxlMetronome 
          ref={refAxlMetronome} 
          tempo={tempo}
          range={range}
          maxDelta={maxDelta}
          remaining={remaining}
          isDescEnabled={isDescEnabled}
        />
    );
  }, {
    notes: {
      markdown: [
        `Combination of BeatAxl and Time that provides the following features:`,
        `* Indicates current tempo and increases/decreases beat`,
        `* Indicates remaining time by Ring`,
        `* Click button at center to start/pause beat`,
        `* Drag ring to change remaining time`,
      ].join("\n"),
    },
  });
storiesOf('Counter', module)
  .add('Counter', () => {
    const remaining = number('Remaining time', 30);
    const tempo = {
      from: number('Tempo from', 90),
      to: number('Tempo to', 160),
    };
    return (
      <Counter 
        ref={refCounter}
        remaining={remaining} 
        tempo={tempo} 
      />
    );
  }, {
    notes: {
      markdown: [
        `Combination of BeatAxl and Time that provides the following features:`,
        `* Indicates current tempo and increases/decreases beat`,
        `* Indicates remaining time by Ring`,
        `* Click button at center to start/pause beat`,
        `* Drag ring to change remaining time`,
      ].join("\n"),
    },
  })
  .add('BeatAxl', () => {
    const remaining = number('Remaining time', 30);
    const tempo = {
      from: number('Tempo from', 90),
      to: number('Tempo to', 150),
    };
    return (
      <BeatAxl
        ref={refBeatAxl}
        tempo={tempo} 
        remaining={remaining}
      />
    );
  }, {
    notes: `Indicates current tempo and increases/decreases beat.`,
  })
  .add('Beat', () => {
    const tempo = number('Tempo', 90);
    return (
      <Beat 
        ref={refBeat}
        tempo={tempo} 
      />
    );
  }, {
    notes: `Indicates current tempo and beats in consistent tempo.`,
  })
  .add('Time', () => {
    const remaining = number('Remaining time in seconds', 10);
    return (
      <Time 
        ref={refTime}
        remaining={remaining} 
      />
    );
  }, {
    notes: [
      `Combination of Indicator and Ring.`,
      `Click Indicator to start/stop counting time. Ring also indicates remaining time.`,
      `Click and drag Ring to change time to count. Indicator stops counting and value will be reflected immediately.current!.`,
    ].join("\n"),
  })
  .add('Indicator', () => {
    const remaining = number('Remaining time in seconds', 900);
    const postProcess = {
      onCount: (_remaining: number) => {},
      onCountStart: () => {},
      onCountStop: () => {},
      onCountComplete: () => {},
    };
    return (
      <Indicator 
        ref={refIndicator} 
        timeToCount={remaining} 
        postProcess={{...postProcess}}
      />
    );
  }, {
    notes: [
      `Button to start/stop counting time and to indicate remaining time.`,
      `Click to start/stop counting. When counting completed value turns back to original one.`,
    ].join("\n"),
  })
  .add('Stepped Ring', () => {
    const step = number('Step', 10, {
      range: true,
      min: 1,
      max: 100,
      step: 1,
    });
    button('getProgress()', () => {
      console.log(refRingStepped.current!.getProgress());
    });
    button('reset()', () => {
      refRingStepped.current!.reset();
    });
    button('setProgress(0.25)', () => {
      refRingStepped.current!.setProgress(0.25);
    });
    button('setProgress(0.75)', () => {
      refRingStepped.current!.setProgress(0.75);
    });
    return (
      <RingStepped 
        ref={refRingStepped} 
        step={step}
      />
    );
  }, {
    notes: [
      `Ring to set and to indicate remaining time.`,
      `Click and drag is available.`,
    ].join("\n"),
  })
  .add('Non-stepped Ring', () => {
    button('reset()', () => {
      refRing.current!.reset();
    });
    button('setProgress(0.375)', () => {
      refRing.current!.setProgress(0.375);
    });
    button('setProgress(0.5)', () => {
      refRing.current!.setProgress(0.5);
    });
    return (
      <Ring 
        ref={refRing} 
      />
    );
  }, {
    notes: [
      `Ring to set and to indicate remaining time.`,
      `Click and drag is available.`,
    ].join("\n"),
  });
storiesOf('Tempo', module)
  .add('selector', () => {
      const defaultTempo = {
        from: number('Default tempo from', 90),
        to: number('Default tempo to', 120),
      };
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200),
      };
      const maxDelta = number('Max delta', 100);
      const isDescEnabled = boolean('isDescEnabled', false);
      button('getChildrenTempo()', () => {
        console.log(refTempoSelector.current!.getChildrenTempo());
      });
      return (
        <TempoSelector 
          ref={refTempoSelector} 
          defaultTempo={defaultTempo} 
          range={range} 
          maxDelta={maxDelta} 
          isDescEnabled={isDescEnabled} 
        />
      );
    }, {
      notes: `Buttons to set beginning/final tempo.`,
    },
  )
  .add('from', () => {
      const tempo = number('Tempo', 80);
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200),
      };
      const maxDelta = number('Max delta', 100);
      button('getTempo()', () => {
        console.log(refTempo.current!.getTempo());
      });
      return (
        <Tempo 
          ref={refTempo} 
          role="from" 
          tempo={tempo} 
          range={range} 
          maxDelta={maxDelta} 
        />
      );
    }, {
      notes: [
        `A button to set beginning tempo.`,
        `Slide to change value.`,
      ].join("\n"),
    },
  )
  .add('to', () => {
      const tempo = number('Tempo', 150);
      const range = {
        from: number('Range from', 50),
        to: number('Range to', 200),
      };
      const maxDelta = number('Max delta', 100);
      button('getTempo()', () => {
        console.log(refTempo.current!.getTempo());
      });
      return (
        <Tempo 
          ref={refTempo} 
          role="to" 
          tempo={tempo} 
          range={range} 
          maxDelta={maxDelta} 
        />
      );
    }, {
      notes: [
        `A button to set beginning tempo.`,
        `Slide to change value.`,
      ].join("\n"),
    },
  );
