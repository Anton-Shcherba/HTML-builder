const fs = require('fs');
const path = require('path');

const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}).then(filenames => {
  filenames.forEach(filename => {
    if(filename.isFile() && path.extname(path.join(__dirname, 'styles', filename.name)) === '.css') {
      const inputStream = fs.createReadStream(path.join(__dirname, 'styles', filename.name));
      inputStream.pipe(outputStream);
    }
  });
});