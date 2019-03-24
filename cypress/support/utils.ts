const TempoSelector = {
  Portrait: {
    increaseTempo10: (selector: string, repeat: number = 1) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 100 + offset.left;
        const fromY = 667 / 4 + offset.top;
        const toX = 137.5 + offset.left;
        const toY = 667 / 4 + offset.top;
        for (let i = 0; i < repeat; i++) {
          cy.get(`body`)
            .trigger(`touchstart`, fromX, fromY, {
              changedTouches: [
                {
                  clientX: fromX,
                  clientY: fromY,
                },
              ],
            })
            .trigger(`touchmove`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            })
            .trigger(`touchend`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            });
        }
      });
    },
    decreaseTempo10: (selector: string, repeat: number = 1) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 137.5 + offset.left;
        const fromY = 667 / 4 + offset.top;
        const toX = 100 + offset.left;
        const toY = 667 / 4 + offset.top;
        for (let i = 0; i < repeat; i++) {
          cy.get(`body`)
            .trigger(`touchstart`, fromX, fromY, {
              changedTouches: [
                {
                  clientX: fromX,
                  clientY: fromY,
                },
              ],
            })
            .trigger(`touchmove`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            })
            .trigger(`touchend`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            });
        }
      });
    },
  },
  Landscape: {
    increaseTempo10: (selector: string, repeat: number = 1) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 667 / 4 + offset.left;
        const fromY = 137.5 + offset.top;
        const toX = 667 / 4 + offset.left;
        const toY = 100 + offset.top;
        for (let i = 0; i < repeat; i++) {
          cy.get(`body`)
            .trigger(`touchstart`, fromX, fromY, {
              changedTouches: [
                {
                  clientX: fromX,
                  clientY: fromY,
                },
              ],
            })
            .trigger(`touchmove`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            })
            .trigger(`touchend`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            });
        }
      });
    },
    decreaseTempo10: (selector: string, repeat: number = 1) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 667 / 4 + offset.left;
        const fromY = 100 + offset.top;
        const toX = 667 / 4 + offset.left;
        const toY = 137.5 + offset.top;
        for (let i = 0; i < repeat; i++) {
          cy.get(`body`)
            .trigger(`touchstart`, fromX, fromY, {
              changedTouches: [
                {
                  clientX: fromX,
                  clientY: fromY,
                },
              ],
            })
            .trigger(`touchmove`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            })
            .trigger(`touchend`, toX, toY, {
              changedTouches: [
                {
                  clientX: toX,
                  clientY: toY,
                },
              ],
            });
        }
      });
    },
  },
};
const Ring = {
  click: {
    setProgress25: (selector: string) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 150 + offset.left;
        const fromY = 37.5 + offset.top;
        const toX = fromX;
        const toY = fromY;
        cy.get(`body`)
          .trigger(`touchstart`, fromX, fromY, {
            changedTouches: [
              {
                clientX: fromX,
                clientY: fromY,
              },
            ],
          })
          .trigger(`touchend`, toX, toY, {
            changedTouches: [
              {
                clientX: toX,
                clientY: toY,
              },
            ],
          });
      });
    },
    setProgress50: (selector: string) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 262.5 + offset.left;
        const fromY = 150 + offset.top;
        const toX = fromX;
        const toY = fromY;
        cy.get(`body`)
          .trigger(`touchstart`, fromX, fromY, {
            changedTouches: [
              {
                clientX: fromX,
                clientY: fromY,
              },
            ],
          })
          .trigger(`touchend`, toX, toY, {
            changedTouches: [
              {
                clientX: toX,
                clientY: toY,
              },
            ],
          });
      });
    },
  },
  drag: {
    setProgress25to50: (selector: string) => {
      cy.get(selector).then(el => {
        const offset = el.offset()!;
        const fromX = 150 + offset.left;
        const fromY = 37.5 + offset.top;
        const toX = 262.5 + offset.left;
        const toY = 150 + offset.top;
        cy.get(`body`)
          .trigger(`touchstart`, fromX, fromY, {
            changedTouches: [
              {
                clientX: fromX,
                clientY: fromY,
              },
            ],
          })
          .trigger(`touchmove`, toX, toY, {
            changedTouches: [
              {
                clientX: toX,
                clientY: toY,
              },
            ],
          })
          .trigger(`touchend`, toX, toY, {
            changedTouches: [
              {
                clientX: toX,
                clientY: toY,
              },
            ],
          });
      });
    },
  },
};

export {
  TempoSelector,
  Ring,
};
