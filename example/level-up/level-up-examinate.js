const sharp = require('sharp');
const _ = require('lodash');
const fs = require('fs');
const { findColor } = require('../../check-level');

sharp.cache(false);

const rawColorGroup = (raw) => {
  const colors = {};
  for (let i = 0; i < raw.length; i++) {
    const color = raw[i];
    if (!colors[color]) {
      colors[color] = 0;
    }
    colors[color] += 1;
  }
  return colors;
}

const examilate = async () => {
  const image = sharp(`${__dirname}/level-up.jpg`);
  await image.greyscale().toFile(`${__dirname}/level-up-gray.jpg`);

  const raw = await image.greyscale().raw().toBuffer();
  const colors = rawColorGroup(raw);

  const colorsArray = [];
  for (const k in colors) {
    colorsArray.push([k, colors[k]]);
  }
  colorsArray.sort((a, b) => -a[1] + b[1]);
  let sum = 0;
  const sampleColors = [];
  for (let i = 0; i < colorsArray.length; i++) {
    sum += colorsArray[i][1];
    sampleColors.push(colorsArray[i][0]);

    if (sum/ raw.length > 0.8) {
      console.log(i);
      fs.writeFileSync('sample-color.json', JSON.stringify(sampleColors))      
      break;
    }
  }
}

const colorSampleFile = fs.readFileSync('sample-color.json');
let sampleColors = JSON.parse(colorSampleFile);
sampleColors = sampleColors.map((x) => parseInt(x, 10));


const checkIsLevelUp = async (newImage) => {
  newImage = await newImage.greyscale().raw().toBuffer();
  // console.log(colors);
  let count = 0;
  // r g b s
  for (let j = 0; j < newImage.length; j++) {
    const color = newImage[j];
    if (sampleColors.includes(color)) {
      count += 1;
    }
  }
  const percentage = count / newImage.length;
  return percentage >= 0.7; // examinate existing image
}

const test = async () => {
  const image = sharp(`${__dirname}/crop-level-up-1.jpg`);
  console.log(await checkIsLevelUp(image))
}

test();