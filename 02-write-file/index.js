const fs = require('fs');
const path = require('path');

const outputStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdout, stdin, exit } = process;

stdout.write('Здраствуйте, пожалуйста введите текст:\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.emit('SIGINT');
  else outputStream.write(data);
});

process.on('SIGINT', () => {
  stdout.write('Удачи в изучении Node.js!');
  exit();
});