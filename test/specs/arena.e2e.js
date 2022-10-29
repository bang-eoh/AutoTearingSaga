const { isArenaConfirm } = require('../../check-arena');
const { checkLevelUpgrade} = require('../../check-level');
const PlayingPage = require('../pageobjects/playing.page');
const { sleep } = require('./common');
const { forceRandom, fight, isBoss, goodCondition } = require('./levelup');


describe('Run auto', () => {
  beforeAll(async () => {
  })

  it('level up', async () => {
    let reset = `
    X
    O
    O
    wait
    wait
    wait
    wait
    O
    wait
    wait
    wait
    O
    `
    let steps = `
    right
    O
    O
    O
    O
    O
    O
    O
    O
    O
    wait-level-up
  `;

  reset = reset.split('\n').map((x) => {
    x = x.trim();
    if (!x.length) {
      return null;
    }
    return x;
  }).filter((x) => x);
  
  steps = steps.split('\n').map((x) => {
    x = x.trim();
    if (!x.length) {
      return null;
    }
    return x;
  }).filter((x) => x);

    
    while (true) {
      await PlayingPage.reload();
      await sleep(2000);
      for (let i = 0; i < reset.length; i++) {
        await PlayingPage.perform(reset[i]);
      }

      let isAtArenaConfirm = false;
      for (let i = 0; i < 30; i++) {
        await PlayingPage.perform('2O');
        await driver.saveScreenshot('current.png');
        if (await isArenaConfirm('current.png')) {
          isAtArenaConfirm = true;
          break;
        }
      }

      if (isAtArenaConfirm) {
        await PlayingPage.perform('save');
      } else {
        continue;
      }

      for (let i = 0; i < steps.length; i++) {
        await PlayingPage.perform(steps[i]);
      }
      const isGood = await checkLevelUpgrade(goodCondition);

      if (isGood) {
        break;
      }
    }
  }, 9999999);
});

