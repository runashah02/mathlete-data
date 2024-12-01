const fs = require("fs");
const path = require("path");

const util = require("../utility.js");
const countingUtil = require ("./counting-utility.js");

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: 0},
  { min: 1, max: 5, exerciseId: 0, count: 20},
  { min: 1, max: 9, exerciseId: 0, count: 40},
  { min: 10, max: 20, exerciseId: 0, count: 40},
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


// Function to generate answer keys with drop zones (numbers as labels)
function generateAnswerKeys0(dropAnswerCodes, dragAnswerCodes, dropLabels) {
  let answerKeys = [];
  for (let i = 0; i < dropAnswerCodes.length; ++i) {
    let answerKey = {
      answerCodes: [dropAnswerCodes[i]],
      allowedAnswers: [[[dragAnswerCodes[i]]]],
      dropAreaLabel: dropLabels[i], // Number labels for drop areas
      dropZonesPerRow: 1,
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerKeys1(answerCodes, numbers) {
  let answerKeys = [];
  for (let i = 0; i < answerCodes.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i]],
      content: `<span class='number-name'>${util.generateNumberName (numbers[i])}</span>`,
      answerExplanation: `The number name <span style="font-weight:bold">${util.generateNumberName (numbers[i])}</span> corresponds to the number <span class="em-answer">${util.numberToHTML (numbers[i])}</span>.`
    };
    answerKeys.push(answerKey);
  }
  answerKeys = util.shuffleArray (answerKeys);
  return answerKeys;
}

function generateQuestion(questionNo, slab) {
  const randomNumbers = util.generateUniqueNumbers([], 4, slab.min, slab.max);
  const dragAnswerCodes = Array.from({ length: 4 }, util.generateRandom4);
  const dropAnswerCodes = Array.from({ length: 4 }, util.generateRandom4);

  return {
    questionNo: questionNo,
    questionType: "DRAG_AND_DROP",
    activeDroppableClass: "active-droppable",
    transferType: "COPY",
    exerciseCustomCSS: customCSS,
    exerciseId: slab.exerciseId,
    highestNumberHandled: slab.max,
    parts: [
      {
        autoContent: 0,
        content: "<p>Match each number name with its corresponding number</p>",
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
        answerKeys: generateAnswerKeys0(dropAnswerCodes, dragAnswerCodes, randomNumbers),
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
        hideOptionInExplanation: 1,
        answerKeys: generateAnswerKeys1(dragAnswerCodes, randomNumbers),
      },
    ],
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);

