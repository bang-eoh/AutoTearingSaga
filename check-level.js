const sharp = require('sharp');
const _ = require('lodash');
const { goodCondition } = require('./test/specs/levelup');
sharp.cache(false);

const debug = false;


let levelUpPanelColors = [  // find max color in image
  [247, 247, 214],
  [255, 255, 222],
  [132, 115, 82],
  [214, 197, 140],
  [255, 247, 222],
  [238, 222, 173],
  [254, 254, 221],
  [238, 247, 206],
  [206, 189, 140],
  [239, 247, 207]
]

const findColor = (color, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (_.isEqual(colors[i], color)) {
      return true;
    }
  }
  return false;
}

const checkIsLevelUp = async (newImage) => {
  newImage = await newImage.raw().toBuffer({ resolveWithObject: true });
  let count = 0;
  // r g b s
  for (let j = 0; j < newImage.data.length; j += 4) {
    const color = [newImage.data[j], newImage.data[j + 1], newImage.data[j + 2]];
    if (findColor(color, levelUpPanelColors)) {
      count += 1;
    }
  }
  const percentage = count / (newImage.data.length / 4);
  return percentage >= 0.007; // examinate existing image
}

// real
// [260, ]
// [220, 30]

// stat
// const panelStart = [145, 290];
// const panelStop = [930, 750];


// avd
const panelStart = [140, 227];
const panelStop = [920, 657];


// stat
const statBegin = [420, 270];
const stat2Begin = [700]
const statSize = [200, 30]
const statHeight = 40;

const findTotalStatIncrease = async (newImage, start) => {
  let increase = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  }
  for (let i = 0; i < 5; i++) {
    if (i + 1 <= start) {
      continue
    }
    const statImage = await newImage.clone().extract({
      left: statBegin[0] - panelStart[0],
      top: statBegin[1] + i * statHeight - panelStart[1],
      width: statSize[0],
      height: statSize[1],
    })
    
    if (debug) {
      await statImage.toFormat('jpg').toFile(`xxx1-${i}.jpg`)
    }

    if (await hasIncrease(statImage)) {
      increase[i + 1] = 1;
    }
  }
  for (let i = 0; i < 3; i++) {
    if (i + 6 <= start) {
      continue
    }
    const statImage = await newImage.clone().extract({
      left: stat2Begin[0] - panelStart[0],
      top: statBegin[1] + i * statHeight - panelStart[1],
      width: statSize[0],
      height: statSize[1],
    });

    if (debug) {
      await statImage.toFormat('jpg').toFile(`xxx2-${i}.jpg`)
    }

    if (await hasIncrease(statImage)) {
      increase[i + 6] = 1;
    }
  }
  return increase;
}

const hasIncrease = async (image) => {
  image = await image.raw().toBuffer({ resolveWithObject: true });
  for (let k = 0; k < image.data.length; k += 4) {
    const [r, g, b] = [image.data[k], image.data[k + 1], image.data[k + 2]];
    if ((g >= 220 && r <= 100 && b <= 100) || (g >= 180 && r <= 60 && b <= 60) || (g >= 150 && r <= 10 && b <= 60))  {
      return true;
    }
  }
}

const checkIsGoodLevelUpImg = async (i, startStat) => {
  const image = sharp(`level-up-${i}.png`);
  
  const newImage = image.extract({
    left: panelStart[0],
    top: panelStart[1],
    width: panelStop[0] - panelStart[0],
    height: panelStop[1] - panelStart[1],
  });

  if (debug) {
    await newImage.toFormat('jpg').toFile(`crop-level-up-${i}.jpg`)
  }
  const isLevelUp = await checkIsLevelUp(newImage);
  if (isLevelUp) {
    const totalStatIncrease = await findTotalStatIncrease(image, startStat);
    return totalStatIncrease;
  }
}

const getStatIncreased = async (total) => {
  let increased = {count: 0};
  let lastStatIncreased = 0;
  for (let i = 1; i <= total; i++) {
    // console.error({i});
    const findIncreased = await checkIsGoodLevelUpImg(i, lastStatIncreased);
    if (!findIncreased) {
      continue;
    }
    for (let k = lastStatIncreased + 1; k <= 8; k++) {
      if (findIncreased[k]) {
        increased[k] = 1;
        lastStatIncreased = k;
      }
    }
    if (lastStatIncreased === 8) {
      break;
    }
  }
  for (let k = 1; k <= 8; k++) {
    if (increased[k]) {
      increased.count += 1;
    }
  }
  return increased;
}

const checkIsGoodLevelUp = async (total, required) => {
  const statIncreased = await getStatIncreased(total);
  console.error(statSummary(statIncreased));
  const isGood = checkGoodCondition(statIncreased, required);
  return isGood;
}



const statName = {
  1: 'strength',
  2: 'skill',
  3: 'speed',
  4: 'luck',
  5: 'def',
  6: 'magic',
  7: 'mastery',
  8: 'hp',
}

const statSummary = (stats) => {
  const summary = [stats.count];
  for (let i = 1; i <= 8; i++) {
    if(stats[i]) {
      summary.push(statName[i])
    }
  }
  return summary;
}

const checkGoodCondition = (isGood, required) => {
  if (isGood.count > required.count) {  // more than expect
    return true;
  }

  for (const k in required) { // equal expect
    if (isGood[k] < required[k]) {
      return false;
    }
  }
  return true;
}


module.exports = { checkIsGoodLevelUp, statSummary, checkGoodCondition, checkIsLevelUp }

if (debug) {
  const func = async () => {
    console.log(await checkIsGoodLevelUp(7, goodCondition));
  }
  func();
}

