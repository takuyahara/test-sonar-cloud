import { TempoSelector, Ring } from '../support/utils';

describe(`Smart Phone`, () => {
  describe(`TempoSelector`, () => {
    beforeEach(() => {
      cy.viewport(`iphone-6`, `portrait`);
      cy.visit(`http://localhost:8000/`);
      cy.get(`[data-testid=temposelector-from]`).as(`tsFrom`);
      cy.get(`[data-testid=temposelector-to]`).as(`tsTo`);
      cy.get(`[data-testid=beat-taparea]`).as(`beat-taparea`);
    });

    describe(`swipe Tempo.From`, () => {
      it(`tempo.from < tempo.to`, () => {
        TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 3);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `120`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `120`);

        TempoSelector.Portrait.decreaseTempo10(`@tsFrom`, 3);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
      });

      it(`tempo.from > tempo.to`, () => {
        TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 8);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `170`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `170`);

        TempoSelector.Portrait.decreaseTempo10(`@tsFrom`, 8);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
      });

      it(`tempo.from stays in range`, () => {
        TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 75);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `780`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `780`);

        TempoSelector.Portrait.decreaseTempo10(`@tsFrom`, 80);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `60`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `60`);
      });
    });

    describe(`swipe Tempo.To`, () => {
      it(`tempo.from < tempo.to`, () => {
        TempoSelector.Portrait.decreaseTempo10(`@tsTo`, 3);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `120`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);

        TempoSelector.Portrait.increaseTempo10(`@tsTo`, 3);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
      });

      it(`tempo.from > tempo.to`, () => {
        TempoSelector.Portrait.decreaseTempo10(`@tsTo`, 8);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `70`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);

        TempoSelector.Portrait.increaseTempo10(`@tsTo`, 8);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
      });

      it(`tempo.from stays in range`, () => {
        TempoSelector.Portrait.decreaseTempo10(`@tsTo`, 15);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `60`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);

        TempoSelector.Portrait.increaseTempo10(`@tsTo`, 80);
        cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
        cy.get(`@tsTo`).children(`span`).should(`have.text`, `780`);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
      });
    });

    describe(`change orientation`, () => {
      it(`swipe Tempo.From`, () => {
        // Increase Tempo
        let nextTempo;
        for (let i = 90, l = 780 - 200; i < l; i += 200)
        {
          nextTempo = (i + 100).toString();
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, nextTempo);

          nextTempo = (i + 200).toString();
          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.increaseTempo10(`@tsFrom`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, nextTempo);
        }
        TempoSelector.Landscape.increaseTempo10(`@tsFrom`, 9);
        for (let i = 0, l = 5; i < l; i++)
        {
          // Expected Tempo not to change
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.increaseTempo10(`@tsFrom`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `780`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, `780`);

          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.increaseTempo10(`@tsFrom`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `780`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, `780`);
        }

        // Decrease Tempo
        for (let i = 780, l = 60 + 200; i > l; i -= 200)
        {
          nextTempo = (i - 100).toString();
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.decreaseTempo10(`@tsFrom`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, nextTempo);

          nextTempo = (i - 200).toString();
          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.decreaseTempo10(`@tsFrom`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, nextTempo);
        }
        TempoSelector.Landscape.decreaseTempo10(`@tsFrom`, 12);
        for (let i = 0, l = 5; i < l; i++)
        {
          // Expected Tempo not to change
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.decreaseTempo10(`@tsFrom`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `60`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, `60`);

          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.decreaseTempo10(`@tsFrom`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `60`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
          cy.get(`@beat-taparea`).should(`have.text`, `60`);
        }
      });

      it(`swipe Tempo.To`, () => {
        // Increase Tempo
        let nextTempo;
        for (let i = 150, l = 780 - 200; i < l; i += 200)
        {
          nextTempo = (i + 100).toString();
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.increaseTempo10(`@tsTo`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);

          nextTempo = (i + 200).toString();
          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.increaseTempo10(`@tsTo`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);
        }
        TempoSelector.Landscape.increaseTempo10(`@tsTo`, 3);
        for (let i = 0, l = 5; i < l; i++)
        {
          // Expected Tempo not to change
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.increaseTempo10(`@tsTo`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `780`);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);

          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.increaseTempo10(`@tsTo`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `780`);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);
        }

        // Decrease Tempo
        for (let i = 780, l = 60 + 200; i > l; i -= 200)
        {
          nextTempo = (i - 100).toString();
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.decreaseTempo10(`@tsTo`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);

          nextTempo = (i - 200).toString();
          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.decreaseTempo10(`@tsTo`, 10);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, nextTempo);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);
        }
        TempoSelector.Landscape.decreaseTempo10(`@tsTo`, 12);
        for (let i = 0, l = 5; i < l; i++)
        {
          // Expected Tempo not to change
          cy.viewport(`iphone-6`, `portrait`);
          TempoSelector.Portrait.decreaseTempo10(`@tsTo`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `60`);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);

          cy.viewport(`iphone-6`, `landscape`);
          TempoSelector.Landscape.decreaseTempo10(`@tsTo`);
          cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
          cy.get(`@tsTo`).children(`span`).should(`have.text`, `60`);
          cy.get(`@beat-taparea`).should(`have.text`, `90`);
        }
      });
    });
  });

  describe(`Beat`, () => {
    beforeEach(() => {
      cy.clock(Date.now(), [
        `setInterval`, `clearInterval`,
      ]);
      cy.viewport(`iphone-6`);
      cy.visit(`http://localhost:8000/`);
      cy.get(`[data-testid=temposelector-from]`).as(`tsFrom`);
      cy.get(`[data-testid=temposelector-to]`).as(`tsTo`);
      cy.get(`[data-testid=beat-taparea]`).as(`beat-taparea`);
    });

    it(`click to toggle`, () => {
      // Start
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);

      // Pause
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);

      // Resume
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);

      // Repeat one more time
      // Pause
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);

      // Resume
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `135`);
    });

    describe(`click => complete`, () => {
      it(`tempo.from < tempo.to`, () => {
        cy.get(`@beat-taparea`)
          .trigger(`click`);
  
        // 450 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `105`);
  
        // 900 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `120`);
  
        // 1,350 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `135`);
  
        // 1,771 sec have passed and tempo should be as specified by Tempo.From
        cy.tick(450000 - 29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // 1,800 secs have passed and tempo should be reset
        cy.tick(29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
  
        // Metronome should be stopped and tempo shouldn't change
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
  
        // Repeat one more time
        cy.get(`@beat-taparea`)
          .trigger(`click`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `105`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `120`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `135`);
        cy.tick(450000 - 29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `90`);
      });

      it(`tempo.from > tempo.to`, () => {
        TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 10);
        cy.get(`@beat-taparea`)
          .trigger(`click`);
  
        // 450 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `180`);
  
        // 900 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `170`);
  
        // 1,350 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `160`);
  
        // 1,771 sec have passed and tempo should be as specified by Tempo.From
        cy.tick(450000 - 29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // 1,800 secs have passed and tempo should be reset
        cy.tick(29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `190`);
  
        // Metronome should be stopped and tempo shouldn't change
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `190`);
  
        // Repeat one more time
        cy.get(`@beat-taparea`)
          .trigger(`click`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `180`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `170`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `160`);
        cy.tick(450000 - 29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `190`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `190`);
      });

      it(`tempo.from === tempo.to`, () => {
        TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 6);
        cy.get(`@beat-taparea`)
          .trigger(`click`);
  
        // 450 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // 900 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // 1,350 secs have passed
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // 1,771 sec have passed and tempo should be as specified by Tempo.From
        cy.tick(450000 - 29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // 1,800 secs have passed and tempo should be reset
        cy.tick(29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // Metronome should be stopped and tempo shouldn't change
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
  
        // Repeat one more time
        cy.get(`@beat-taparea`)
          .trigger(`click`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(450000 - 29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(29017);
        cy.tick(1000); // factor of safety
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
        cy.tick(450000);
        cy.get(`@beat-taparea`).should(`have.text`, `150`);
      });
    });
  });

  describe(`Ring`, () => {
    beforeEach(() => {
      cy.viewport(`iphone-6`);
      cy.visit(`http://localhost:8000/`);
      cy.get(`[data-testid=ring-taparea]`).as(`ring`);
      cy.get(`[data-testid=beat-taparea]`).as(`beat-taparea`);
    });

    it(`mousedown => mouseup`, () => {
      Ring.click.setProgress25(`@ring`);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);
    });

    it(`mousedown => mousemove => mouseup`, () => {
      Ring.drag.setProgress25to50(`@ring`);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);
    });
  });

  describe(`Integration`, () => {
    beforeEach(() => {
      cy.clock(Date.now(), [
        `setInterval`, `clearInterval`,
      ]);
      cy.viewport(`iphone-6`);
      cy.visit(`http://localhost:8000/`);
      cy.get(`[data-testid=temposelector-from]`).as(`tsFrom`);
      cy.get(`[data-testid=temposelector-to]`).as(`tsTo`);
      cy.get(`[data-testid=ring-taparea]`).as(`ring`);
      cy.get(`[data-testid=beat-taparea]`).as(`beat-taparea`);
    });

    it(`don't change tempo when touchend isn't invoked`, () => {
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);

      cy.get(`@ring`).then(el => {
        const offset = el.offset()!;
        const x = 150 + offset.left;
        const y = 37.5 + offset.top;
        cy.get(`body`)
          .trigger(`touchstart`, x, y, {
            changedTouches: [
              {
                clientX: x,
                clientY: y,
              },
            ],
          });
      });
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);
      
      cy.get(`@ring`).then(el => {
        const offset = el.offset()!;
        const x = 150 + offset.left;
        const y = 37.5 + offset.top;
        cy.get(`body`)
          .trigger(`touchend`, x, y, {
            changedTouches: [
              {
                clientX: x,
                clientY: y,
              },
            ],
          });
      });
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);
    });

    it(`start => changeProgress => complete`, () => {
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);

      Ring.click.setProgress50(`@ring`);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);
      
      cy.tick(900000);
      cy.tick(1000); // factor of safety, minimum effective value is 983
      cy.get(`@beat-taparea`).should(`have.text`, `90`);

      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `90`);
    });

    it(`start => pause => changeProgress => resume => complete`, () => {
      // start
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `105`);

      // pause
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      Ring.click.setProgress50(`@ring`);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);
      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);
      
      // resume
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(900000);
      cy.tick(1000); // factor of safety, minimum effective value is 983
      cy.get(`@beat-taparea`).should(`have.text`, `90`);

      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `90`);
    });

    it(`changeTempo => start => changeProgress => complete`, () => {
      TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 5);
      TempoSelector.Portrait.increaseTempo10(`@tsTo`, 5);
      cy.get(`@tsFrom`).children(`span`).should(`have.text`, `140`);
      cy.get(`@tsTo`).children(`span`).should(`have.text`, `200`);
      cy.get(`@beat-taparea`).should(`have.text`, `140`);

      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(300000);
      cy.get(`@beat-taparea`).should(`have.text`, `150`);

      Ring.drag.setProgress25to50(`@ring`);
      cy.get(`@beat-taparea`).should(`have.text`, `170`);

      cy.tick(900000);
      cy.tick(1000); // factor of safety, minimum effective value is 964
      cy.get(`@beat-taparea`).should(`have.text`, `140`);

      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `140`);
    });

    it(`start => changeTempo => changeProgress => complete`, () => {
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(300000);
      cy.get(`@beat-taparea`).should(`have.text`, `100`);

      TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 5);
      TempoSelector.Portrait.increaseTempo10(`@tsTo`, 5);
      cy.get(`@tsFrom`).children(`span`).should(`have.text`, `140`);
      cy.get(`@tsTo`).children(`span`).should(`have.text`, `200`);
      cy.get(`@beat-taparea`).should(`have.text`, `150`);

      Ring.drag.setProgress25to50(`@ring`);
      cy.get(`@beat-taparea`).should(`have.text`, `170`);

      cy.tick(900000);
      cy.tick(1000); // factor of safety, minimum effective value is 964
      cy.get(`@beat-taparea`).should(`have.text`, `140`);

      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `140`);
    });

    it(`start => changeTempo (from > to) => complete`, () => {
      cy.get(`@beat-taparea`)
        .trigger(`click`);
      cy.tick(300000);
      cy.get(`@beat-taparea`).should(`have.text`, `100`);

      TempoSelector.Portrait.increaseTempo10(`@tsFrom`, 10);
      cy.tick(300000);
      cy.get(`@tsFrom`).children(`span`).should(`have.text`, `190`);
      cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
      cy.get(`@beat-taparea`).should(`have.text`, `177`);

      TempoSelector.Portrait.decreaseTempo10(`@tsFrom`, 10);
      cy.tick(300000);
      cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
      cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
      cy.get(`@beat-taparea`).should(`have.text`, `120`);

      TempoSelector.Portrait.decreaseTempo10(`@tsTo`, 8);
      cy.tick(300000);
      cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
      cy.get(`@tsTo`).children(`span`).should(`have.text`, `70`);
      cy.get(`@beat-taparea`).should(`have.text`, `77`);

      TempoSelector.Portrait.increaseTempo10(`@tsTo`, 8);
      cy.tick(300000);
      cy.get(`@tsFrom`).children(`span`).should(`have.text`, `90`);
      cy.get(`@tsTo`).children(`span`).should(`have.text`, `150`);
      cy.get(`@beat-taparea`).should(`have.text`, `140`);

      cy.tick(300000);
      cy.tick(1000); // factor of safety
      cy.get(`@beat-taparea`).should(`have.text`, `90`);

      cy.tick(450000);
      cy.get(`@beat-taparea`).should(`have.text`, `90`);
    });
  });
});
