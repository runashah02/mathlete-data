const fs = require('fs');

// Path to the original data file
const inputFilePath = 'icons.json';
// Path for the output file
const outputFilePath = 'newicons.json';

// Read the original JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the data as JSON
    const originalData = JSON.parse(data);

    // Convert the data to the desired structure
    const convertedData = Object.entries(originalData).map(([iconName, { singular, plural }]) => ({
      iconName,
      singular,
      plural
    }));

    // Write the new structure to the output JSON file
    fs.writeFile(outputFilePath, JSON.stringify(convertedData, null, 2), (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('Data successfully converted and saved to', outputFilePath);
    });
  } catch (parseError) {
    console.error('Error parsing JSON data:', parseError);
  }
});
