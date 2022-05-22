const fs = require('fs');
const path = require('path');

const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}).then(filenames => {
  filenames.forEach(filename => {
    const filePath = path.join(__dirname, 'styles', filename.name);
    if(filename.isFile() && path.extname(filePath) === '.css') fs.createReadStream(filePath).pipe(outputStream);
  });
});