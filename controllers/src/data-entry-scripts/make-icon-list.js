const fs = require('fs');
const path = require('path');

// Directory you want to rename files in
const directoryPath = path.join('C:', 'mathlete', 'views', 'public', 'assets', 'kids-icons');

// Object to store the new file names
let icons = {};

// Function to rename files in the directory
function makeIconList() {
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
                let singular = file.substring(0, file.length - 7);
                singular = singular.replace ("-", " ");
                // Add the new file name to the renamedFiles object
                if (!icons[file]) {
                    icons[file] = {
                        singular: singular,
                        plural: singular + 's',
                    };

                    // Write the renamedFiles object to a JSON file
                    fs.writeFile('icons.json', JSON.stringify(icons, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing to JSON file:', err);
                        }
                    });
                }
            });
        });
    });
}

// Call the function
makeIconList();
