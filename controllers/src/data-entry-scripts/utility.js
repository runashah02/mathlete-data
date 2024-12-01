const fs = require('fs');
const path = require('path');

// Function to generate a random 4-character string
function generateRandom4() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let optionId = '';
    for (let i = 0; i < 4; i++) {
        optionId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return optionId;
}

// Function to save questions to a JSON file
function saveQuestionsToJSONFile(questions, fileNameWithoutExt) {
    const directoryPath = path.join('C:', 'mathlete', 'controllers', 'src', 'json_data');
    const targetFilePath = path.join(directoryPath, `${fileNameWithoutExt}.json`);

    // Write to the file in the specified directory (overwriting if it exists)
    fs.writeFileSync(targetFilePath, JSON.stringify(questions, null, 2));

    console.log(`${questions.length} questions written to ${targetFilePath}`);
}

function generateUniqueNumbers(existingNumbers, totalNumbersRequired, numLimit) {
    const uniqueNumbers = new Set();
    for (let i = 0; i < existingNumbers.length; ++i) {
        uniqueNumbers.add(existingNumbers[0]);
    }
    while (uniqueNumbers.size < totalNumbersRequired) {
        const randomNum = Math.floor(Math.random() * numLimit) + 1;
        uniqueNumbers.add(randomNum); // Ensure uniqueness using a Set
    }
    return Array.from(uniqueNumbers).slice (0, totalNumbersRequired);
}

function appendQuestionToJSONFile(question, fileNameWithoutExt) {
    const directoryPath = path.join('C:', 'mathlete', 'controllers', 'src', 'json_data');
    const targetFilePath = path.join(directoryPath, `${fileNameWithoutExt}.json`);

    // Write to the file in the specified directory (overwriting if it exists)
    fs.appendFileSync(targetFilePath, JSON.stringify(question, null, 2) + '\n', 'utf-8');
}

// Exporting the functions
module.exports = {
    generateRandom4,
    saveQuestionsToJSONFile,
    generateUniqueNumbers,
    appendQuestionToJSONFile
};
