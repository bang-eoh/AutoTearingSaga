const { checkIsLevelUp, extractLevelUpPanel } = require('../../check-level');
const { sleep } = require('../specs/common');
const sharp = require('sharp')
const Page = require('./page');
sharp.cache(false);


/**
 * sub page containing specific selectors and methods for a specific page
 */
class PlayingPage extends Page {
  /**
   * define selectors using getter methods
   */
  get buttonX() {
    return $('id=com.github.stenzek.duckstation:id/controller_button_cross');
  }

  get buttonO() {
    return $('id=com.github.stenzek.duckstation:id/controller_button_circle');
  }

  get buttonSquare() {
    return $('id=com.github.stenzek.duckstation:id/controller_button_square');
  }

  get buttonTriangle() {
    return $('id=com.github.stenzek.duckstation:id/controller_button_triangle');
  }

  get pad() {
    return $('id=com.github.stenzek.duckstation:id/controller_dpad')
  }

  get buttonPause () {
    return $('id=com.github.stenzek.duckstation:id/controller_button_pause')
  }

  get buttonLoadState () {
    return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.recyclerview.widget.RecyclerView/android.widget.LinearLayout[1]/android.widget.RelativeLayout')
  }

  get buttonSaveState () {
    return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.recyclerview.widget.RecyclerView/android.widget.LinearLayout[2]/android.widget.RelativeLayout')
  }

  get buttonQuickSave () {
    return $('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/androidx.appcompat.widget.LinearLayoutCompat/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.ListView/android.widget.RelativeLayout[1]')
  }

  async moveUp() {
    await this.pad.touchAction({action: 'tap', x: 168, y:30});
  }

  async moveUpLeft() {
    await this.pad.touchAction({action: 'tap', x: 30, y:30});
  }

  async moveUpRight() {
    await this.pad.touchAction({action: 'tap', x: 306, y:30});
  }

  async moveDown() {
    await this.pad.touchAction({action: 'tap', x: 168, y:280});
  }

  async moveDownLeft() {
    await this.pad.touchAction({action: 'tap', x: 30, y:280});
  }
  async moveDownRight() {
    await this.pad.touchAction({action: 'tap', x: 328, y:280});
  }


  async moveLeft() {
    await this.pad.touchAction({action: 'tap', x: 30, y:168});

  }

  async moveRight() {
    await this.pad.touchAction({action: 'tap', x: 328, y:168});

  }

  async pressO() {
    await this.buttonO.touchAction({action: 'tap', x: 10, y:10});
  }

  async pressX() {
    await this.buttonX.touchAction({action: 'tap', x: 10, y:10});
  }

  async pressSquare() {

  }

  async pressTriangle() {

  }

  async reload() {
    this.buttonPause.touchAction({action: 'tap', x: 10, y:10});
    this.buttonLoadState.touchAction({action: 'tap', x: 10, y:10});
    this.buttonQuickSave.touchAction({action: 'tap', x: 10, y:10});
    sleep(500)
  }

  async quicksave() {
    this.buttonPause.touchAction({action: 'tap', x: 10, y:10});
    this.buttonSaveState.touchAction({action: 'tap', x: 10, y:10});
    this.buttonQuickSave.touchAction({action: 'tap', x: 10, y:10});
    sleep(500)
  }

  async spamO () {
    await this.pressO();
    await this.pressO();
    await this.pressO();
    await this.pressO();
    await this.pressO();
    await this.pressO();
    await this.pressO();
    await this.pressO();
  }
  async finish() {
    await sleep(6000);
  }
  async finishBoss () {
    await sleep(12000);
    await this.spamO();
    await sleep(6000);
  }

  async takePic (num) {
    await driver.saveScreenshot(`current.png`);
    await sleep(400);
  }

  async waitLevelUp() {
    for (let i = 0; i < 30; i++) {
      await driver.saveScreenshot(`current.png`);
      const image = sharp(`current.png`);
      const cropImage = await extractLevelUpPanel(image);
      if (await checkIsLevelUp(cropImage)) {
        return;
      }
      await sleep(1000)
    }
  }
 
  async perform(step) {
    const parts = step.split(' ');
    let count = 1;
    if (parts[1]) {
      count = parseInt(parts[1], 10);
    }
    for (let i = 0; i < count; i++) {
      switch (parts[0]) {
        case 'left':
          await this.moveLeft();
          await sleep(300);
          break;
        case 'right':
          await this.moveRight();
          await sleep(300);
          break;
        case 'up':
          await this.moveUp();
          await sleep(300);
          break;
        case 'down':
          await this.moveDown();
          await sleep(300);
          break;
        case 'X':
          await this.pressX();
          await sleep(1000);
          break;
        case 'O':
          await this.pressO();
          await sleep(1000);
          break;
        case '2O':
          await this.pressO();
          await sleep(200);
          await this.pressO();
          await sleep(200);
          break;
        case 'square':
          await this.pressSquare();
          await sleep(500);
          break;
        case 'triangle':
          await this.pressTriangle();
          await sleep(500);
          break;
        case 'save':
          await this.quicksave()
          await sleep(1000);
          break;
        case 'up-left':
          await this.moveUpLeft();
          await sleep(300);
          break;
        case 'up-right':
          await this.moveUpRight();
          await sleep(300);
          break;
        case 'down-left':
          await this.moveDownLeft();
          await sleep(300);
          break;
        case 'down-right':
          await this.moveDownRight();
          await sleep(300);
          break;
        case 'confirm':
          await this.spamO();
          break;
        case 'boss':
          await this.finishBoss();
          break;
        case 'finish':
          await this.finish();
          break;
        case 'wait':
          await sleep(1000);
          break;
        case 'pic':
          await this.takePic();
          break
        case 'wait-level-up':
          await this.waitLevelUp();
        default:
          break;
      }
    }
  }
}

module.exports = new PlayingPage();
