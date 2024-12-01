const fs = require("fs");
const path = require("path");
const util = require("../utility.js");
const countingUtility = require("./counting-utility.js");

const iconsFilePath = path.join(__dirname, "../cute-icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: -1},
  { min: 1, max: 5, exerciseId: 0, count: -1},
  { min: 1, max: 9, exerciseId: 0, count: -1},
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

let customCSS = `
      .image-grid {display: grid; grid-template-columns: repeat(auto-fit, 80px); gap: 20px; max-width: 550px; }
      .counting-object-container {position: relative; }
      .counting-object-image {width: 80px; }
      @media (max-width: 550px) {.image-grid {max-width: 100%;}}
      .counting-number-name {border-radius:2px; background-color: blue; 50%; color: white; text-align: center; padding:5px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
      .image-overlay {opacity: 0.5;}
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
  return countingUtility.imageGrid (icon, number, false);
}

function generateAnswerKeys(answerCodes, number) {
  // answer keys will be used to auto-generate content for options - A grid of numbers to select from

  let answerKeys = [];
  for (let i = 0; i <= answerCodes.length; ++i) {
    
    let answerKey = {
      content: util.generateNumberName (i + 1, "International"),
      answerCodes: [answerCodes[i]],
      allowedAnswers: [[[i + 1 == number ? 1 : 0]]],
    };
    answerKeys.push(answerKey);
  }
  answerKeys = util.shuffleArray (answerKeys);
  return answerKeys;
}

function generateAnswerExplanation(icon, number, slab) {
  let html = ``;
  html += generateQuestionPart0 (icon, number, slab);
  html += countingUtility.imageGrid (icon, number, true, true);
  html += `<p><span class='audio-enabled'>
  
  There ${number == 1 ? "is" : "are"} <span class="em-answer">${util.generateNumberName (number)}</span> ${number == 1 ? icon.singular : icon.plural}
  </span></p>`;
  return html;
}

function generateQuestion(questionNo, icon, number, slab) {
  countLimit = (slab.max < 5 || slab.max % 5 === 0) ? slab.max : slab.max + (5 - (slab.max % 5));
  const answerCodes = Array.from({ length: countLimit - 1}, util.generateRandom4);

  let qstmt0 = generateQuestionPart0 (icon, number, slab);
  let qstmt1 = generateQuestionPart1 (icon, number, slab);
  let answerKeys = generateAnswerKeys (answerCodes, number);
  let expln = generateAnswerExplanation (icon, number, slab);

  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: customCSS,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    highestNumberHandled: countLimit,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
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
        answerKeysPerRow: 5,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerInputCSS: null,
        shuffleAnswerChoices: 1,
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
    answerExplanation: expln,
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);
