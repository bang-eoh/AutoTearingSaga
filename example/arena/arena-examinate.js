const sharp = require('sharp');
const _ = require('lodash');
const fs = require('fs');

const isArenaConfirm = async (image) => {
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
  fs.writeFileSync('arena-color.json', JSON.stringify(colors));
}

const test = async () => {
  const image = sharp(`${__dirname}/current.png`);
  console.log(await isArenaConfirm(image))
}

test();