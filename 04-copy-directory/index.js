const fs = require('fs');
const path = require('path');

function onlyCopy(currentPath, copyPath){
  fs.promises.mkdir(copyPath, { recursive: true }).then(function() {
    fs.promises.readdir(currentPath, {withFileTypes: true}).then(filenames =>  filenames.forEach(filename => {
      fs.promises.copyFile(path.join(currentPath, filename.name), path.join(copyPath, filename.name));
    }));
  });
}

function copyDir(currentPath, copyPath) {
  fs.stat(copyPath, function(err) {
    if (!err) {
      fs.promises.readdir(copyPath, {withFileTypes: true}).then(filenames =>  {
        filenames.forEach(filename => {
          fs.unlink(path.join(copyPath, filename.name), (err) => {
            if (err) console.error(err);
          });
        });
        fs.rmdir(copyPath, err => {
          if(!err) onlyCopy(currentPath, copyPath);
        });
      });
    }
    else if (err.code === 'ENOENT') onlyCopy(currentPath, copyPath);
  });
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));