const fs = require("fs");
const path = require("path");
const util = require("../utility.js");
const countingUtil = require("./counting-utility.js");

// Define number slabs
const slabs = [
  { min: 1, max: 9, exerciseId: 5, count: -1 },
  { min: 10, max: 20, exerciseId: 7, count: -1 },
  { min: 21, max: 50, exerciseId: 8, count: -1 },
  { min: 51, max: 99, exerciseId: 9, count: -1 },
  { min: 100, max: 999, exerciseId: 13, count: -1 },
  { min: 1000, max: 9999, exerciseId: 17, count: 1000 },
  { min: 10000, max: 99999, exerciseId: 21, count: 1000 },
  { min: 100000, max: 999999, exerciseId: 21, count: 1000 },
  { min: 1000000, max: 999999999, exerciseId: 25, count: 1000 },
];
const fileNameWithoutExt = path.basename(__filename, ".js");

let customCSS = `
    .number-grid {border: 2px solid #b7e7fb; width: auto;}
    .number-grid td {border: 2px solid #b7e7fb; padding: 10px;}   
    .place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
    .span2 {grid-column: span 2}
    .span3 {grid-column: span 3}
    .place-chart-subheader-cell {border: 1px solid black; text-align:center; background-color:#e0f7ff; padding:10px;}
    .place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px;}
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    if (slab.count == 0) continue;
    let numbers = [];
    if (slab.count < 0) {
      for (let i = 0; i < slab.count; ++i) numbers.push(i);
    } else {
      numbers = util.generateUniqueNumbers([], slab.count, slab.min, slab.max);
    }
    numbers.forEach((number) => {
      let question = generateQuestion(questionNo++, number, slab);
      if (question) questions.push(question);
    });
  }

  return questions;
}

// Function to generate the question statement
function generateQuestionPart0(number) {
  let qstmt = ``;
  qstmt += `<p><span class='audio-enabled'>Write the number for <span style='font-weight:bold'>${countingUtil.generateNumberName (number, "Indian")}</span><span></p>`;
  return qstmt;
}

// Function to create an answer explanation
function generateAnswerExplanation(number) {
  const answer = util.generateNumberName(number, "Indian");
  answerExpln = ``;
  if (number > 99) {
    answerExpln += `<p><span class="audio-enabled">Use the place value chart as shown below</span></p>`;
    answerExpln += countingUtil.placeValueChart(number, "Indian");
    answerExpln += `</br>`;
  }
  answerExpln += `<p><span class='audio-enabled'>The number for ${answer} is <span class="em-answer">${util.numberToHTML (answer)}</span>.</span></p>`;
  return answerExpln;
}

function calculateTwistiness (number) {
  const digits = String(number).split("");
  const zeroCount = digits.filter((digit) => digit === "0").length;
  return zeroCount === 0 ? 0 : zeroCount === 1 ? 1 : 2;
};

// Function to generate a single question object
function generateQuestion(questionNo, number, slab) {
  const answerCode = util.generateRandom4();
  const answer = util.generateNumberName(number, "Indian");

  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: customCSS,
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    highestNumberHandled: number,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: calculateTwistiness (number),
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionPart0 (number),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [],
      },
      {
        autoContent: 1,
        content: null,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [
          {
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 1,
            ignoreCommas: 1,
            allowTypos: 0,
            answerCodes: [answerCode],
            allowedAnswers: [[[countingUtil.addCommasToNumber (number, "Indian")]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(number),
  };
}


// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);
