const { checkIsGoodLevelUp} = require('../../check-level');
const PlayingPage = require('../pageobjects/playing.page');
const { sleep } = require('./common');
const { forceRandom, fight, isBoss, goodCondition } = require('./levelup');

const checkLevelUpgrade = async (required) => {
  const total = 7;
  for (let i = 1; i <= total; i++) {
    await sleep(400);
    await driver.saveScreenshot(`level-up-${i}.png`);
  }
  return await checkIsGoodLevelUp(total, required);
}

describe('Run auto', () => {
  beforeAll(async () => {
  })

  it('level up', async () => {
    let steps = `
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
    O
    O
    O
    O
    O
    O
    O
    save
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
      for (let i = 0; i < steps.length; i++) {
        console.log({ step: steps[i] })
        await PlayingPage.perform(steps[i]);
      }
      const isGood = await checkLevelUpgrade(goodCondition);

      if (isGood) {
        break;
      }
    }
  }, 9999999);
});

