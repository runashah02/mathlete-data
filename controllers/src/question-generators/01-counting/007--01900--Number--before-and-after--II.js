// Number - before and after. Select number on grid
// Which number comes just before/after x? Select number on the number grid
// This program produces 2 different kinds of questions
// which number comes just before a?, 2 <= a <= 99
// which number comes just after a?, 1 <= a <= 98
// The student clicks on the number in the given chart
// Topic: Counting Numbers
// Learning goal: Learnt the sequence of numbers

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

function generateQuestionStatement(a, beforeAfter, answerCodes) {
  let qstmt = `<p><span class='audio-enabled'>`;
  qstmt += `which number comes just ${beforeAfter} ${a}?`;
  qstmt += `</span></p>`;
  qstmt += util.numberChart(1, 100, 10, [], 1, answerCodes);
  return qstmt;
}

function generateAnswerExplanation(a, beforeAfter, answer) {
  let expln = `<p><span class='audio-enabled'>The following table shows the counting numbers from 1 to 100</span></p>`;
  expln +=  util.numberChart(1, 100, 10, [a, answer], 0, []);
  expln += `<p>`;
  expln += `${answer} comes just ${beforeAfter} ${a}`;
  expln += `</p>`;
  return expln;
}

function exerciseCustomCSS() {
  return `
    .number-grid {border: 2px solid #b7e7fb; width: auto;}
    .number-grid td {border: 2px solid #b7e7fb; padding: 10px;}   
    .clickable {cursor: pointer; transition: background-color 0.3s, border-color 0.3s; background-color: #ffffff; text-align: center;} 
    .clickable:hover {background-color: #b7e7fb;} 
    .clickable.selected {background-color: #b7e7fb;} tbl {border-collapse:collapse;}     
  `;
}

const exerciseDesc =`
  Which number comes before/after x?
  A 10*10 grid with clickable options from 1 to 100 is provided
  To solve, select the correct option

  Variation: before, after
  Twistiness: 0
`
function generateAnswerKeys(answerCodes, correctAnswer) {
  let answerKeys = [];
  for (let i = 1; i <= answerCodes.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i - 1]],
      allowedAnswers: [[[correctAnswer == i ? 1 : 0]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateQuestion(questionNo, count, beforeAfter, slab) {
  const answerCodes = Array.from({ length: 100 }, util.generateRandom4);
  const answer = beforeAfter === "before" ? count - 1 : count + 1;
  const answerKeys = generateAnswerKeys(answerCodes, answer);
  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: exerciseCustomCSS(),
    questionCustomCSS: null,
    moduleId: 1,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    sourceDetail: fileNameWithoutExt,
    exerciseDesc: exerciseDesc,
    variation: beforeAfter == "before" ? 1 : 2,    
    focusFirstInput: 1,
    highestNumberHandled: 100,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    adjustOptionsWidth: 1,
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(count, beforeAfter, answerCodes),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(count, beforeAfter, answer),
  };
}

const slabs = [
  {min: 2, max: 99, rangeDesc: "2-digit", count: -1}
]

function generateQuestions() {
  const questions = [];
  let questionNo = 0;
  for (slabIdx = 0; slabIdx < slabs.length; ++ slabIdx) {
    const slab = slabs [slabIdx];
    if (slab.count == -1) {
      for (let count = slab.min; count <= slab.max; count++) {
        if (count > 1) {
          questions.push(generateQuestion(questionNo++, count, "before", slab));
        }
        if (count < 99) {
          questions.push(generateQuestion(questionNo++, count, "after", slab));
        }
      }
    }
  }

  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
