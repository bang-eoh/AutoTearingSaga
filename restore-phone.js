const { exec } = require("child_process");
exec('adb -s emulator-5554 pull storage/self/primary/duckstation/savestates/SLPS-03177_0.sav', (err, stdout, stderr) => {
  console.log(err)
  exec('adb -s R3CN203BDKN push SLPS-03177_0.sav storage/self/primary/duckstation/savestates/SLPS-03177_0.sav', (err, stdout, stderr) => {
    console.log(err)
    console.log('Sync from emulator to phone');
  })
})