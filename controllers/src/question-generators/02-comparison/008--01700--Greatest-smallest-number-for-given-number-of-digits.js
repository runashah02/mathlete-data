const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 10, max: 99, rangeDesc: "2-digits", count: -1 },
  { min: 100, max: 999, rangeDesc: "3-digits", count: -1 },
  { min: 1000, max: 9999, rangeDesc: "4-digits", count: -1 },
  { min: 10000, max: 99999, rangeDesc: "5-digits", count: -1 },
  { min: 100000, max: 999999, rangeDesc: "6-digits", count: -1 },
  { min: 1000000, max: 9999999, rangeDesc: "7-digits", count: -1 },
  { min: 10000000, max: 99999999, rangeDesc: "8-digits", count: -1 },
  { min: 100000000, max: 999999999, rangeDesc: "9-digits", count: -1 },
];


let exerciseDesc = `
Which is the smallest/greatest x-digit number?
To solve, fill in the blank with the correct number

This exercise generates 2 variations: smallest, greatest
Twistiness is always 0
`;


function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let i = 0; i < slabs.length; ++i) {
    let digits = slabs[i].min.toString().length;
    questions.push(generateQuestion(questionNo++, digits, "smallest", 0, slabs[i]));
    questions.push(generateQuestion(questionNo++, digits, "greatest", 0, slabs[i]));
  }
  return questions;
}

function findSmallestAndGreatest(digits) {
  if (digits < 1) {
    throw new Error("Number of digits must be at least 1.");
  }

  const smallest = Math.pow(10, digits - 1);
  const greatest = Math.pow(10, digits) - 1;

  return { smallest, greatest };
}

function generateQuestionStatement(digits, type) {
  return `<p><span class='audio-enabled'>Which is the ${type} ${digits}-digit number?</span></p>`;
}

function generateAnswerExplanation(digits, type) {
  let explanation = "";

  if (type === "smallest") {
    explanation += `<ul>
      <li><span class="audio-enabled">A ${digits}-digit number starts with the smallest non-zero digit, which is 1</span>.</li>
      <li><span class="audio-enabled">All other digits are the smallest possible digit, which is 0</span>.</li>
    </ul>`;
    explanation += `<p><span class="audio-enabled">Thus, the smallest ${digits}-digit number is <strong>${Math.pow(10, digits - 1)}</strong></span>.</p>`;
  } else if (type === "greatest") {
    explanation += `<p><span class="audio-enabled">A ${digits}-digit number uses the largest possible digit, which is 9, in all places.</li>
    </span></p>`;
    explanation += `<p><span class="audio-enabled">Thus, the greatest ${digits}-digit number is <strong>${Math.pow(10, digits) - 1}</strong></span>.</p>`;
  } else {
    explanation += `<p>Invalid type specified. Use "smallest" or "greatest" for generating explanations.</p>`;
  }

  return explanation;
}

function exerciseCustomCSS() {
  return `
  .digits-box {display: flex; align-items: center; margin-bottom: 10px;}
  .digit-box {width: 60px; height: 60px; text-align: center; line-height: 60px; box-sizing: border-box; margin: 0;}
  .digit-box-left {background-color: #f0fafe; border-left: 2px solid #b7e7fb; border-right: 2px dotted #b7e7fb; border-top: 2px solid #b7e7fb; border-bottom: 2px solid #b7e7fb;}
  .digit-box-middle {border-top: 2px solid #b7e7fb; border-bottom: 2px solid #b7e7fb;}
  .digit-box-right {border-left: 2px dotted #b7e7fb; border-right: 2px solid #b7e7fb; border-top: 2px solid #b7e7fb; border-bottom: 2px solid #b7e7fb;}
  `;
}

function generateQuestion(questionNo, digits, type, twistiness, slab) {
  const { smallest, greatest } = findSmallestAndGreatest(digits);
  const answerCode = util.generateRandom4();
  const allowedAnswer = type === "smallest" ? smallest : greatest;

  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    variation: type == "smallest" ? 1 : 2, 
    rangeDesc: slab.rangeDesc,      
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: exerciseCustomCSS(),
    questionCustomCSS: null,
    focusFirstInput: 1,
    sourceDetail: fileNameWithoutExt,
    exerciseDesc: exerciseDesc,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: twistiness,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(digits, type),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [],
      },
      {
        autoContent: 1,
        content: "",
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [
          {
            answerCodes: [answerCode],
            inputType: "INPUT",
            allowedAnswers: [[[allowedAnswer]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(digits, type),
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
