const { exec } = require("child_process");
exec('adb -s R3CN203BDKN pull storage/self/primary/duckstation/savestates/SLPS-03177_0.sav', (err, stdout, stderr) => {
  exec('adb -s emulator-5554 push SLPS-03177_0.sav storage/self/primary/duckstation/savestates/SLPS-03177_0.sav', (err, stdout, stderr) => {
    console.log('Sync from phone to emulator');
  })
})