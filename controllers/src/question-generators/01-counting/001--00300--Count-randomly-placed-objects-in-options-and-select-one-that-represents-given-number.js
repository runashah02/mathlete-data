// Count randomly placed objects in options and select one that represents given number
// Which shows 'x'? Count randomly placed objects in the given (2-4) options.
// 1 <= count <= 9
//
// exerciseId: 3
// Topic Id: 1 <= count <= 3 (1), 1 <= count <= 5 (2), 1 <= count <= 9 (3)
// Learning objective: Counting objects

// Show 4 options with (random, count) number of objects in each option
// The objects are placed randomly to increase the counting challenge
// Ask - which shows count objects?
// Student must click the correct option/s
// 1 <= count <= 10
// Topic: Counting Numbers
// Learning goal: Count objects

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

let customCSS = ``;

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

// Function to generate a div with random number of images, each 25px wide
function generateOptionContent(icon, number, slab) {
  let content = `<div style='position: relative; width: 200px; height: 200px;'>`;
  const placedPositions = [];

  for (let i = 0; i < number; i++) {
    let validPosition = false;
    let left, top;

    // Retry limit to avoid infinite loops
    let retries = 0;
    const maxRetries = 100; // Adjust based on layout size

    while (!validPosition && retries < maxRetries) {
      left = Math.random() * 160; // Adjusted to 75 to fit 25px width images
      top = Math.random() * 160; // Adjusted to 75 for 25px height images
      validPosition = true;
      retries++;

      // Check for overlaps with previously placed images
      for (let pos of placedPositions) {
        const [prevLeft, prevTop] = pos;
        if (Math.abs(left - prevLeft) < 40 && Math.abs(top - prevTop) < 40) {
          validPosition = false;
          break;
        }
      }
    }

    // If valid position found within retry limit, store the position
    if (validPosition) {
      placedPositions.push([left, top]);
      content += `<img src='/assets/count-objects/${icon.iconName}' style='position: absolute; width: 40px; left: ${left}px; top: ${top}px;' />`;
    }
  }

  content += `</div>`;

  if (content.includes("src") && content.match(/<img/g).length === number) {
    return content;
  } else {
    // falied to create the object
    return null;
  }
}

function generateAnswerKeys(answerCodes, icon, number, slab) {
  let answerKeys = [];
  const numbers = util.shuffleArray(util.generateUniqueNumbers([number], answerCodes.length, slab.min, slab.max));
  for (let i = 0; i < answerCodes.length; ++i) {
    let optionContent = generateOptionContent(icon, numbers[i], slab);
    if (!optionContent || optionContent == null) break;
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

function generateAnswerExplanation(icon, number, correctAnswer, slab) {
  let html = ``;
  html += `<p><span class='audio-enabled'>Count the number of ${number > 1 ? icon.plural : icon.singular}. `;
  html += `There are ${util.numberToHTML (number)} ${number > 1 ? icon.plural : icon.singular}. <span></p>`
  html += `<p><span class='audio-enabled'>This option is ${number == correctAnswer ? "correct" : "incorrect"}. <span></p>`;
  return html;
}


function generateQuestion(questionNo, icon, number, slab) {

  let html = generateQuestionPart0 (icon, number, slab);

  let answerOptionCnt = slab.max <= 5 ? 2 : 4;
  const answerCodes = Array.from({ length: answerOptionCnt }, util.generateRandom4);
  const answerKeys = generateAnswerKeys(answerCodes, icon, number, slab);
  if (answerKeys.length != answerCodes.length) return null;
 
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
    optionsContainer: "GRID",
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
        autoContent: 1,
        content: "",
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 2,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        shuffleAnswerOptions: 1,
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);
