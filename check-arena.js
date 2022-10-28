const sharp = require('sharp');
const _ = require('lodash');
const fs = require('fs');
sharp.cache(false);

const areaColorsJson = fs.readFileSync('arena-color.json');
const areaColors = JSON.parse(areaColorsJson.toString());

const isArenaConfirm = async (filename) => {
  const image = sharp(filename);
  const panel = await image.extract({
    left: 0,
    top: 510,
    width: 1073,
    height: 300,
  });
  const buffer = await image.toFormat('jpg').raw().toBuffer()
  const colors = [];
  for (let i = 0; i < buffer.length; i+=4) {
    colors.push([buffer[i], buffer[i+1], buffer[i+2]]);
  }

  let same = 0;

  for (let i = 0; i < colors.length; i++) {
    const newColor = (
      areaColors[i][0] - colors[i][0] + areaColors[i][1] - colors[i][1] + areaColors[i][2] - colors[i][2]
    );
    if (newColor < 1) {
      same += 1;
    }
  }
  const percentage = same / colors.length;
  return percentage > 0.98;
}

const test = async () => {
  console.log(await isArenaConfirm('example/arena/current.png'));
  console.log(await isArenaConfirm('example/arena/level-up-3.png'));
  console.log(await isArenaConfirm('example/arena/Screenshot_1666965174.png'));
}

module.exports = {isArenaConfirm}