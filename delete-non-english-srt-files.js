const fs = require('fs');
const path = require('path');
// Get process.stdin as the standard input object.
process.stdin.setEncoding('utf8');

console.log('Enter path to the directory');
process.stdin.on('readable', () => {
  let chunk;
  // Use a loop to make sure we read all available data.
  while ((chunk = process.stdin.read()) !== null) {
    const dirPath = chunk.replace(/(\r\n|\n|\r)/gm, "");
    getFilesWithinDirectory(dirPath)
      .then(data => {
        let uselessFiles = data.filter(fileName => path.extname(fileName) === '.srt').filter(fileName => !fileName.endsWith('en.srt'));
        uselessFiles.forEach(fileName => {
          // deleteFile(path.join(dirPath, fileName));
          // fs.unlink(path.join(dirPath, fileName), (err) => {
          //   if (err) throw err;
          //   console.log(`Successfully deleted file: ${filePath}`);
          // })
          try {
            fs.unlinkSync(path.join(dirPath, fileName));
            console.log(`Successfully deleted file: ${fileName}`);
          } catch {
            // todo
          }
        })
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      })
      .finally(_ => process.exit())
  }
});

const getFilesWithinDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) return reject(err)
      resolve(files)
    })
  })
};

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) return reject(err);
      console.log(`Successfully deleted file: ${filePath}`);
      resolve();
    })
  })
}

process.stdin.on('end', () => {
  process.stdout.write('end');
});