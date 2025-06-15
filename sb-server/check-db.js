const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./switchboard.sqlite');

// Presets 테이블 조회
db.all('SELECT * FROM Presets', [], (err, rows) => {
  if (err) {
    console.error('Presets 조회 에러:', err);
  } else {
    console.log('\n=== Presets 테이블 ===');
    console.log(JSON.stringify(rows, null, 2));
  }

  // PresetCommands 테이블 조회
  db.all('SELECT * FROM PresetCommands', [], (err, rows) => {
    if (err) {
      console.error('PresetCommands 조회 에러:', err);
    } else {
      console.log('\n=== PresetCommands 테이블 ===');
      console.log(JSON.stringify(rows, null, 2));
    }
    db.close();
  });
}); 