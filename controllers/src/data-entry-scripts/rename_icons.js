const fs = require('fs');
const path = require('path');

// Directory you want to rename files in
const directoryPath = path.join('C:', 'mathlete', 'views', 'public', 'assets', 'kids-icons');

// Object to store the new file names
let renamedFiles = {};

// Function to rename files in the directory
function renameFilesInDirectory() {
  // Check if the directory exists and is accessible
  fs.access(directoryPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.error(`Directory not accessible or doesn't exist: ${directoryPath}`);
      return;
    }

    // Directory is accessible, read the files
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return console.error(`Unable to scan directory: ${err}`);
      }

      files.forEach((file) => {
        const oldPath = path.join(directoryPath, file);
        const hyphenIndex = file.indexOf('-');
        if (hyphenIndex !== -1) {
          const fileExtension = path.extname(file); // Extract file extension
          const baseName = file.slice(hyphenIndex + 1, file.length - fileExtension.length); // Get the part after the hyphen
          const newFileName = `${baseName}-00${fileExtension}`; // Add '-00' before the file extension
          const newPath = path.join(directoryPath, newFileName);

          // Check if the new file name already exists
          if (!fs.existsSync(newPath)) {
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                return console.error(`Error renaming file: ${err}`);
              }
              console.log(`${file} renamed to ${newFileName}`);

              // Add the new file name to the renamedFiles object
              renamedFiles[newFileName] = {
                singular: newFileName,
                plural: newFileName + 's',
              };

              // Write the renamedFiles object to a JSON file
              fs.writeFile('renamedFiles.json', JSON.stringify(renamedFiles, null, 2), (err) => {
                if (err) {
                  console.error('Error writing to JSON file:', err);
                } else {
                  console.log('New file names written to renamedFiles.json');
                }
              });
            });
          } else {
            console.log(`File ${newFileName} already exists, skipping...`);
          }
        } else {
          console.log(`File ${file} does not contain a hyphen, skipping...`);
        }
      });
    });
  });
}

// Call the function
renameFilesInDirectory();
