// Click the container with 0 objects
// 4 containers are shown.
// Each container has random number of objects.
// At least one container has 0 objects.
// Click the container with 0 objects

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

// Load zero-icons data from zero-icons.json file
const iconsFilePath = path.join(__dirname, "../zero-icons.json");
const iconObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

let exerciseId = 0;
let customCSS = ``;

function generateQuestionPart0(container, objectSingular, objectPlural) {
  return `<p>Click the ${container} with 0 ${objectPlural}:</p>`;
}

// Function to generate answer options with images and explanations
function generateAnswerOptions(pictures, zeroPic, container, objectSingular, objectPlural) {
  pictures.push(zeroPic);
  const shuffledPics = pictures.sort(() => 0.5 - Math.random()); 

  return shuffledPics.map((pic) => {
    const answerCode = util.generateRandom4();
    const isZero = pic === zeroPic;
    const objectCount = parseInt (pic); // Random number of flowers

    return {
      answerCodes: [answerCode],
      content: `<img src='/assets/zero/${pic}' width='120' />`,
      allowedAnswers: [[isZero ? [1] : [0]]],
      answerExplanation: [
        isZero
          ? `There are no ${objectPlural} in this ${container}. The ${container} has 0 ${objectPlural}.`
          : `The ${container} has ${objectCount} ${objectCount === 1 ? objectSingular : objectPlural}.`,
      ],
    };
  });
}

function generateQuestion(questionNo, iconData) {
  const { container, objectSingular, objectPlural, pictures, zeroPic } = iconData;

  return {
    questionId: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: customCSS,
    questionCustomCSS: "",
    shuffleAnswerChoices: 1,
    adjustOptionsWidth: 1,
    exerciseId: exerciseId,
    parts: [
      {
        autoContent: false,
        content: generateQuestionPart0(container, objectSingular, objectPlural),
        repeatable: false,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        answerKeys: [],
      },
      {
        autoContent: true,
        content: "",
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 4,
        answerKeys: generateAnswerOptions(pictures, zeroPic, container, objectSingular, objectPlural),
      },
    ],
    explanation: "STATIC",
    answerExplanation: "",
  };
}

function generateQuestions() {
  const questions = [];
  let questionNo = 1;

  // Generate one question per object in zero-icons.json
  iconObjects.forEach((iconData) => {
    questions.push(generateQuestion(questionNo++, iconData));
  });

  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);

