// Count objects in options and select one that represents given number
// Which shows 'x'? Count objects in the given (2-4) options.
// Select the option with 'x' objects
// 1 <= count <= 9
//
// exerciseId: 4
// Topic Id: 1 <= count <= 3 (1), 1 <= count <= 5 (2), 1 <= count <= 9 (3)
// Learning objective: Counting objects

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const iconsFilePath = path.join(__dirname, "../cute-icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));
const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: -1},
  { min: 1, max: 5, exerciseId: 0, count: -1},
  { min: 1, max: 9, exerciseId: 0, count: -1},
  { min: 10, max: 20, exerciseId: 0, count: -1},
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
    .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; width:fit-content}
    .countable-manipulatives-whole {border-radius: 8px;}
    .object-count-container {text-align: center}    
    .basic-option {border:2px solid transparent;border-radius:8px}
    .basic-option:hover {border-color:lightgray}
    .basic-option.selected {border-color:darkgray}    
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
  html += `<p><span class='audio-enabled'>Which shows ${util.numberToHTML (number)} ${number > 1 ? icon.plural : icon.singular}?</span></p>`;
  return html;
}

function generateOptionContent(icon, number, slab) {
  return util.generateObjectsContainerWhole(icon, number, false, 1);
}

function generateAnswerKeys(answerCodes, icon, number, slab) {
  let answerKeys = [];
  const numbers = util.shuffleArray(util.generateUniqueNumbers([number], answerCodes.length, slab.min, slab.max));
  for (let i = 0; i < answerCodes.length; ++i) {
    let optionContent = generateOptionContent(icon, numbers[i], slab);
    let expln = generateAnswerExplanation(icon, numbers[i], number, slab);
    let answerKey = {
      answerCodes: [answerCodes[i]],
      content: optionContent,
      allowedAnswers: [[[numbers[i] == number ? 1 : 0]]],
      answerExplanation: expln,
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(icon, number, correctAnswer) {
  let expln = ``;
  expln += util.generateObjectsContainerWhole(icon, number, true, 1);
  expln += `<p><span class='audio-enabled'>There ${number > 1 ? "are" : "is"} ${util.numberToHTML (number)} ${number > 1 ? icon.plural : icon.singular}. `;
  expln += `This option is ${number == correctAnswer ? "correct" : "incorrect"}. <span></p>`;
  return expln;
}


function generateQuestion(questionNo, icon, number, slab) {
  const answerOptionsCnt = slab.max <= 5 ? 2: 4;
  const answerCodes = Array.from({ length: answerOptionsCnt }, util.generateRandom4);
  const answerKeys = generateAnswerKeys(answerCodes, icon, number, slab);
  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: customCSS,
    focusFirstInput: 1,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    highestNumberHandled: slab.max,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    optionsContainer: "FLEX",
    optionsDirection: "column",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionPart0(icon, number, slab),
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
        answerKeysPerRow: 1,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        hideOptionInExplanation: 1,
        shuffleAnswerOptions: 1,
        answerInputCSS: "basic-option",
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
  };
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);
