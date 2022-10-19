const { checkIsGoodLevelUp} = require('../../check-level');
const PlayingPage = require('../pageobjects/playing.page');
const { sleep } = require('./common');

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
    const goodCondition = {
      count: 5,  // min increase
      1: 0, // must have strength
      2: 0, // skill
      3: 0, // speed
      4: 0, // luck
      5: 0, // def
      6: 0, // magic
      7: 0, // mastery
      8: 0, // hp
    }

    const forceRandom = `
    up-left
    up-left
    up-left
    up-left
    `
    const fight = `
    left
    O
    `

    let steps = `
    ${forceRandom}
    O
    X
    save
    ${fight}
    confirm
    finish
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

