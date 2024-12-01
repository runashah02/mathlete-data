const fs = require("fs");
const path = require("path");

const util = require("../utility.js");
const countingUtility = require("./counting-utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

// Load gingerbread-man icons (1.svg - 10.svg)
const gingerbreadFolder = "/assets/gingerbread-man/";

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: 0},
  { min: 1, max: 5, exerciseId: 0, count: 20},
  { min: 1, max: 9, exerciseId: 0, count: 40},
  { min: 10, max: 20, exerciseId: 0, count: 0},
  { min: 21, max: 50, exerciseId: 0, count: 0},
  { min: 51, max: 99, exerciseId: 0, count: 0},
  { min: 100, max: 999, exerciseId: 0, count: 0},
  { min: 1000, max: 9999, exerciseId: 0, count: 0},
  { min: 10000, max: 99999, exerciseId: 0, count: 0},
  { min: 100000, max: 999999, exerciseId: 0, count: 0},
  { min: 1000000, max: 9999999, exerciseId: 0, count: 0},
  { min: 10000000, max: 99999999, exerciseId: 0, count: 0},
  { min: 100000000, max: 99999999, exerciseId: 0, count: 0},
];

let customCSS = ``;

function generateQuestions() {
  let questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    if (slab.count == 0) continue;
    for (let i = 0; i < slab.count; ++i) {
      let question = generateQuestion (questionNo++, slab);
      if (question) questions.push (question);
    }
  }

  return questions;
}

// Function to generate answer keys with drop zones
function generateAnswerKeys(dropAnswerCodes, dragAnswerCodes, dropLabels) {
    let answerKeys = [];
    for (let i = 0; i < dropAnswerCodes.length; ++i) {
        let answerKey = {
            answerCodes: [dropAnswerCodes[i]],
            allowedAnswers: [[[dragAnswerCodes[i]]]],
            dropAreaLabel: dropLabels[i],
            dropZonesPerRow: 1,
        
        }
        answerKeys.push (answerKey);
    }
    return answerKeys;

}

// Function to generate gingerbread options with images and explanations
function generateGingerbreadOptions(answerCodes, randomNumbers) {
    let combinedArray = [];
    for (let i = 0; i < answerCodes.length; ++i) {
        combinedArray.push (answerCodes[i] + "," + randomNumbers[i]);
    }
    combinedArray = util.shuffleArray (combinedArray);
    let gingerBreadOptions = [];
    for (let i = 0; i < combinedArray.length; ++i) {
        let c = combinedArray[i];
        let cArr = c.split(",");
        let answerCode = cArr[0];
        let number = cArr [1];
        let option = {
            answerCodes: [answerCode],
            content: `<img src='${gingerbreadFolder}${number}.svg' width='100' height='100'/>`,
            answerExplanation: `This gingerbread man has ${number} sprinkle${
              number > 1 ? "s" : ""
            }. Therefore, it should be in tray ${number}.`,
          }
        gingerBreadOptions.push (option);
    }
    return gingerBreadOptions;
}

// Function to generate a single question
function generateQuestion(questionNo, slab) {
  const randomNumbers = util.generateUniqueNumbers ([], 4, slab.min, slab.max);

  const dropAnswerCodes = Array.from({ length: 4 }, util.generateRandom4);
  const dragAnswerCodes = Array.from({ length: 4 }, util.generateRandom4);

  return {
    questionNo: questionNo,
    questionType: "DRAG_AND_DROP",
    transferType: "COPY",
    exerciseCustomCSS: customCSS,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    parts: [
      {
        autoContent: 0,
        content: "<p>Match the gingerbread men to the trays</p>",
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
      },
      {
        autoContent: 1,
        answerKeysPerRow: 4,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: generateAnswerKeys(dropAnswerCodes, dragAnswerCodes, randomNumbers),
      },
      {
        autoContent: 1,
        answerKeysPerRow: 4,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 1,
        hideInStudentAnswers: 1,
        answerKeys: generateGingerbreadOptions(dragAnswerCodes, randomNumbers),
      },
    ],
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);

