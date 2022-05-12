const fs = require('fs');
const path = require('path');

fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}).then(filenames => {
  filenames.forEach(filename => {
    if(filename.isFile()) {
      const filenamePath = path.join(__dirname, 'secret-folder', filename.name);
      fs.stat(filenamePath, (err, stats) => {
        console.log(`${path.basename(filenamePath, path.extname(filenamePath))} - ${path.extname(filenamePath).substring(1)} - ${stats.size/1000}kb`);
      });
    }
  });
});
  
