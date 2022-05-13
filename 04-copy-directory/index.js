const fs = require('fs');
const path = require('path');

function onlyCopy(currentPath, copyPath){
  fs.promises.mkdir(copyPath, { recursive: true }).then(() => {
    fs.promises.readdir(currentPath, {withFileTypes: true}).then(filenames =>  filenames.forEach(filename => {
      if(filename.isFile()) fs.promises.copyFile(path.join(currentPath, filename.name), path.join(copyPath, filename.name));
      else onlyCopy(path.join(currentPath, filename.name), path.join(copyPath, filename.name));
    }));
  });
}

function copyDir(currentPath, copyPath) {
  fs.rm(copyPath, {recursive: true, force: true}, () => onlyCopy(currentPath, copyPath));
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));