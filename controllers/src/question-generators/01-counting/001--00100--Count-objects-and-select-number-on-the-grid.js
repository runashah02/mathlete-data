// Count objects and select number on the grid 
// How many objects are there? Count objects and select number on the number grid
// 1 <= count <= 9
// For numbers 10 onwards, objects must be shown on frames for easy counting
//
// exerciseId: 1
// Learning objective: Counting objects

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

const customCSS = `
      .image-grid {display: grid; grid-template-columns: repeat(auto-fit, 80px); gap: 20px; max-width: 550px; }
      .counting-object-container {position: relative; }
      .counting-object-image {width: 80px; }
      @media (max-width: 550px) {.image-grid {max-width: 100%;}}
      .counting-number {width: 30px; height: 30px; background-color: blue; border-radius: 50%; color: white; text-align: center; line-height: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
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
  return countingUtility.imageGrid (icon, number, false, false);
}

function generateAnswerKeys(answerCodes, number) {
  // answer keys will be used to auto-generate content for options - A grid of numbers to select from

  let answerKeys = [];
  for (let i = 0; i <= answerCodes.length; ++i) {
    
    let answerKey = {
      content: util.numberToHTML (i + 1),
      answerCodes: [answerCodes[i]],
      allowedAnswers: [[[i + 1 == number ? 1 : 0]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
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

const exerciseDesc = ``;

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
    exerciseDesc: exerciseDesc,
    moduleId: 1,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    sourceDetail: fileNameWithoutExt,
    highestNumberHandled: countLimit,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    variation: 1,
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
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
