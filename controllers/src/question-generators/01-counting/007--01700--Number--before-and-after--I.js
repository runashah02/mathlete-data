// Number - before and after
// x comes just before/after y.
// Fill in the blank for x or y with the correct value

// This program produces 4 different kinds of questions
// a comes just after ___, 2 <= a <= 999
// a comes just before ___, 1 <= a <= 99
// ___ comes just after a, 1 <= a <= 99
// ___ comes just before a, 2 <= a <= 100
// The student must fill the blank with the correct answer
// Topic: Counting Numbers
// Learning goal: Learnt the sequence of numbers

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");
const countingUtil = require("./counting-utility.js");

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
      count = numbers[i];
      if (count !== slab.min) {
        questions.push(generateQuestion(questionNo++, count, "before", "START", slab));
        questions.push(generateQuestion(questionNo++, count, "after", "END", slab));
      }
      if (count !== slab.max) {
        questions.push(generateQuestion(questionNo++, count, "after", "START", slab));
        questions.push(generateQuestion(questionNo++, count, "before", "END", slab));
      }
    }
  }

  return questions;
}

function generateQuestionStatement(a, beforeAfter, blankStartEnd, answerCode) {
  let qstmt = `<div style='display:flex;align-items:center;white-space:nowrap'>`;
  if (blankStartEnd === "START") {
    qstmt += `<input input-type='INPUT' answer-code='${answerCode}' size='6' class='form-control' style='margin-right:10px'/>`;
    qstmt += `comes just ${beforeAfter} ${util.numberToHTML (a)}`;
  } else {
    qstmt += `${util.numberToHTML (a)} comes just ${beforeAfter} `;
    qstmt += `<input input-type='INPUT' answer-code='${answerCode}' size='6' class='form-control' style='margin-left:10px'/>`;
  }
  qstmt += `</div>`;
  return qstmt;
}

function generateAnswerExplanation(a, beforeAfter, blankStartEnd, answer, countLimit) {
  let expln = `<p><span class='audio-enabled'>The following table shows the counting numbers from 1 to ${countLimit}</span></p>`;
  expln += util.numberChart(1, countLimit, 10, [a, answer], 0, []);
  expln += `<p>`;
  if (blankStartEnd === "START") {
    expln += `${answer} comes just ${beforeAfter} ${a}`;
  } else {
    expln += `${a} comes just ${beforeAfter} ${answer}`;
  }
  expln += `</p>`;
  return expln;
}

function generateQuestion(questionNo, count, beforeAfter, blankStartEnd, slab) {
  const countLimit = slab.max;
  const answerCode = util.generateRandom4();
  const answer =
    (beforeAfter === "before" && blankStartEnd == "START") || (beforeAfter === "after" && blankStartEnd == "END")
      ? count - 1
      : count + 1;
  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: customCSS,
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    highestNumberHandled: countLimit,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    adjustOptionsWidth: 1,
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(count, beforeAfter, blankStartEnd, answerCode),
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
    answerExplanation: generateAnswerExplanation(count, beforeAfter, blankStartEnd, answer, countLimit),
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);
