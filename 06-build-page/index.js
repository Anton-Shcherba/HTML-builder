const fs = require('fs');
const path = require('path');

const templateReadStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let template = '';
templateReadStream.on('data', chunk => template += chunk);
templateReadStream.on('end', () => {
  const regexp = /{{(.*?)}}/g;
  const array = [...template.matchAll(regexp)];
  array.forEach((element, index) => {
    const componentReadStream = fs.createReadStream(path.join(__dirname, 'components', element[1] + '.html'), 'utf-8');
    let component = '';
    componentReadStream.on('data', chunk => component += chunk);
    componentReadStream.on('end', () => {
      template = template.replace(element[0], component);
      if(index === array.length-1) {
        fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }).then(() => {
          const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
          outputStream.write(template);
        });
      }
    });
  });
});

fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }).then(() => {
  const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}).then(filenames => {
    filenames.forEach(filename => {
      const filePath = path.join(__dirname, 'styles', filename.name);
      if(filename.isFile() && path.extname(filePath) === '.css') fs.createReadStream(filePath).pipe(outputStream);
    });
  });
});

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
  
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));