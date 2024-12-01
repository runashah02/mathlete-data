const fs = require("fs");
const path = require("path");
const util = require("../utility.js");
const countingUtility = require("./counting-utility.js");

const iconsFilePath = path.join(__dirname, "../cute-icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { rangeDesc: "1-3", min: 1, max: 3, count: -1 },
  { rangeDesc: "1-5", min: 1, max: 5, count: -1 },
  { rangeDesc: "1-9", min: 1, max: 9, count: -1 },
];

let customCSS = `
      .image-grid {display: grid; grid-template-columns: repeat(auto-fit, 80px); gap: 20px; max-width: 550px; }
      .counting-object-container {position: relative; }
      .counting-object-image {width: 80px; }
      @media (max-width: 550px) {.image-grid {max-width: 100%;}}
      .counting-number {width: 30px; height: 30px; background-color: blue; border-radius: 50%; color: white; text-align: center; line-height: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
      .image-overlay {opacity: 0.5;}
    `;

const exerciseDesc = `
  How many {objects} are there?
  1-9 objects are displayed
  To solve, type the number in the provided blank

  Variation: 1,
  Twistiness: 0
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numberIconPairs = []; // Array to hold number, icon combinations

    if (slab.count == 0) continue;

    // Single condition to handle both cases
    if (slab.count < 0) {
      // All numbers with all icons
      Array.from({ length: slab.max - slab.min + 1 }, (_, i) => slab.min + i).forEach((number) => {
        imageObjects.forEach((icon) => {
          numberIconPairs.push([number, icon]);
        });
      });
    } else {
      // Random numbers with one random icon
      util.generateUniqueNumbers([], slab.count, slab.min, slab.max).forEach((number) => {
        const randomIcon = imageObjects[Math.floor(Math.random() * imageObjects.length)];
        numberIconPairs.push([number, randomIcon]);
      });
    }

    // Generate questions from combinations
    numberIconPairs.forEach(([number, icon]) => {
      let question = generateQuestion(questionNo++, icon, number, slab);
      if (question) questions.push(question);
    });
  }

  return questions;
}

function generateQuestionPart0(icon, number, slab) {
  let html = ``;
  html += `<p><span class='audio-enabled'>How many ${icon.plural} are there?</span></p>`;
  return html;
}

function generateQuestionPart1(icon, number, slab) {
  return countingUtility.imageGrid (icon, number, false, false);
}

function generateAnswerExplanation(icon, number, slab) {
  let html = ``;
  html += generateQuestionPart0 (icon, number, slab);
  html += countingUtility.imageGrid (icon, number, true, false);
  html += `<p><span class='audio-enabled'>
  
  There ${number == 1 ? "is" : "are"} <span class="em-answer">${util.numberToHTML (number)}</span> ${number == 1 ? icon.singular : icon.plural}
  </span></p>`;
  return html;
}

function generateQuestion(questionNo, icon, number, slab) {
  let qstmt0 = generateQuestionPart0 (icon, number, slab);
  let qstmt1 = generateQuestionPart1 (icon, number, slab);
  let expln = generateAnswerExplanation (icon, number, slab);

  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: customCSS,
    exerciseDesc: exerciseDesc,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: 1,
    sourceDetail: fileNameWithoutExt,
    highestNumberHandled: number,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    focusFirstInput: 1,
    parts: [
      {
        autoContent: 0,
        content: qstmt0,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [],
      },
      {
        autoContent: 0,
        content: qstmt1,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [],
      },
      {
        autoContent: 1,
        content: "",
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [
          {
            answerCodes: [util.generateRandom4 ()],
            allowedAnswers: [[[number]]],
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 0,
            ignoreCommas: 1
          }
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: expln,
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
