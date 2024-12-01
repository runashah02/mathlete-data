// Number - in between
// x comes in between x - 1 and x + 1.
// Fill in the blank for x - 1, x or x + 1 with the correct value

// This program produces 4 different kinds of questions
// ___ comes between a and b, 1 <= a <= 98, b = a + 2
// c comes between ___ and b, 1 <= c <= 99, c = a - 1
// c comes between a and ___, 1 <= a <= 98, c = a + 1
// The student must fill the blank with the correct answer
// Topic: Counting Numbers
// Learning goal: Learn the order of counting numbers

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");
const countingUtil = require ("./counting-utility.js");

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: 0},
  { min: 1, max: 5, exerciseId: 0, count: 0},
  { min: 1, max: 9, exerciseId: 0, count: 0},
  { min: 10, max: 20, exerciseId: 0, count: -1},
  { min: 21, max: 50, exerciseId: 0, count: -1},
  { min: 51, max: 99, exerciseId: 0, count: -1},
  { min: 100, max: 999, exerciseId: 0, count: 0},
  { min: 1000, max: 9999, exerciseId: 0, count: 0},
  { min: 10000, max: 99999, exerciseId: 0, count: 0},
  { min: 100000, max: 999999, exerciseId: 0, count: 0},
  { min: 1000000, max: 9999999, exerciseId: 0, count: 0},
  { min: 10000000, max: 99999999, exerciseId: 0, count: 0},
  { min: 100000000, max: 99999999, exerciseId: 0, count: 0},
];
const fileNameWithoutExt = path.basename(__filename, ".js");

let customCSS = `
    .number-grid {border: 1px solid #b7e7fb; width: auto;}
    .number-grid td {border: 1px solid #b7e7fb; padding: 10px;}  
`;

function generateQuestions() {
  const questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];

    if (slab.count == 0) continue;
    let numbers = [];
    if (slab.count < 0) {
      for (let count = slab.min; count <= slab.max; count++) numbers.push(count);
    } else {
      numbers = util.generateUniqueNumbers([], slab.count, slab.min, slab.max);
    }
    for (i = 0; i < numbers.length; ++i) {
      questions.push(generateQuestion(questionNo++, numbers[i], "START", slab));
      if (numbers[i] !== 1) {
          questions.push(generateQuestion(questionNo++, numbers[i], "MIDDLE", slab));
      }
      questions.push(generateQuestion(questionNo++, numbers[i], "END", slab));
    }
  }

  return questions;
}


function generateQuestionStatement(a, blankStartEndMiddle, answerCode) {
  let c = a + 1;
  let b = a + 2;
  let qstmt = `<div style='display:flex;align-items:center;white-space:nowrap'>`;
  if (blankStartEndMiddle === "START") {
    qstmt += `<input input-type='INPUT' answer-code='${answerCode}' size='6' class='form-control' style='margin-right:10px'/>`;
    qstmt += `comes between ${a} and ${b}`;
  } else if (blankStartEndMiddle === "MIDDLE") {
    qstmt += `${c} comes between `;
    qstmt += `<input input-type='INPUT' answer-code='${answerCode}' size='6' class='form-control' style='margin-left:10px;margin-right:10px'/>`;
    qstmt += ` and ${b}`;
  } else {
    qstmt += `${c} comes between ${a} and `;
    qstmt += `<input input-type='INPUT' answer-code='${answerCode}' size='6' class='form-control' style='margin-left:10px;margin-right:10px'/>`;
  }
  qstmt += `</div>`;
  return qstmt;
}

function generateAnswerExplanation(a, countLimit) {
  let expln = `<p><span class='audio-enabled'>The following table shows the counting numbers from 1 to ${countLimit}</span></p>`;
  expln += numberGrid(countLimit, [a, a + 2], a + 1);
  expln += `<p><span class='audio-enabled'>${a + 1} comes between ${a} and ${a + 2}</span></p>`;
  return expln;
}

function generateQuestion(questionNo, count, blankStartEndMiddle, slab) {
  const answerCode = generateRandom4();
  let a = count;
  let b = count + 2;
  let c = count + 1;
  answer = (blankStartEndMiddle == "START") ? c : (blankStartEndMiddle == "MIDDLE") ? a : b;
  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: exerciseCustomCSS(),
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseId: exerciseId,
    topicId: topicId,
    highestNumberHandled: countLimit,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    adjustOptionsWidth: 1,
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(count, blankStartEndMiddle, answerCode),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [
          {
            answerCodes: [answerCode],
            allowedAnswers: [[[answer]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(count, countLimit),
  };
}

function generateQuestions() {
  const questions = [];
  let questionNo = 1;

  for (let count = 1; count <= 98; count++) {
    const topicId = 0;
    const exerciseId = 0;
    const countLimit = 100;
    questions.push(generateQuestion(questionNo++, count, "START", countLimit, topicId, exerciseId));
    if (count !== 1) {
        questions.push(generateQuestion(questionNo++, count, "MIDDLE", countLimit, topicId, exerciseId));
    }
    questions.push(generateQuestion(questionNo++, count, "END", countLimit, topicId, exerciseId));
  }

  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
saveQuestionsToJSONFile(questions, fileNameWithoutExt);

