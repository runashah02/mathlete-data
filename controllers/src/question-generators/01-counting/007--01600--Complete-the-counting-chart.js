// Complete the counting chart
// Complete the counting chart (5, 10 or 20 cells) with some filled cells with the missing numbers

/**
 * This program generates "Fill in the Missing Numbers" questions for students to practice counting
 * and recognizing number sequences. Each question displays a number grid with missing cells,
 * which students must complete by filling in the correct sequence.
 *
 * Question Type: "Fill in the Blanks"
 * - Displays a grid with a series of numbers and some missing values.
 * - Students must fill in the missing numbers to complete the sequence.
 *
 * Answer Options:
 * - Dynamic sub-ranges are used within the main range, e.g., within [1–100], the question could ask for [10–30] or [22–44].
 * - For each question, the grid shows a maximum of 20 cells with random values from the range,
 *   leaving other cells blank.
 *
 * Correct Answer:
 * - The answer is the completed sequence from the chosen sub-range with the missing numbers filled in.
 * - The correct values are provided as answer keys for validation.
 *
 * Topic: Counting Numbers
 * Learning Goal: To develop counting and sequence recognition skills.
 *
 * The program saves the questions in a JSON file, structured for integration with educational platforms.
 */

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: 0},
  { min: 1, max: 5, exerciseId: 0, count: 0},
  { min: 1, max: 9, exerciseId: 0, count: 0},
  { min: 1, max: 20, exerciseId: 0, count: 20},
  { min: 21, max: 50, exerciseId: 0, count: 20},
  { min: 51, max: 99, exerciseId: 0, count: 20},
  { min: 100, max: 999, exerciseId: 0, count: 100},
  { min: 1000, max: 9999, exerciseId: 0, count: 0},
  { min: 10000, max: 99999, exerciseId: 0, count: 0},
  { min: 100000, max: 999999, exerciseId: 0, count: 0},
  { min: 1000000, max: 9999999, exerciseId: 0, count: 0},
  { min: 10000000, max: 99999999, exerciseId: 0, count: 0},
  { min: 100000000, max: 99999999, exerciseId: 0, count: 0},
];

let customCSS = `
    .fitted-div:focus {outline: none;border: 2px solid #b7e7fb;}
    .number-grid {border: 2px solid #b7e7fb;width:auto}
    .number-cell {border-collapse:collapse;border: 2px solid #b7e7fb; width:65px; height:65px; line-height:55px; vertical-align:middle; padding:5px; text-align:center}
    .number-cell.filled {color: #4394cc;}
    .number-cell.is-invalid {color:red}
  `;

  function generateQuestions() {
    let questions = [];
    let questionNo = 1;
  
    for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
      let slab = slabs[slabIdx];
  
      if (slab.count == 0) continue;
  
      if (slab.count > 0) {
        for (let i = 0; i < slab.count; ++i) {
          questions.push(generateQuestion(questionNo++, slab));
        }        
      }
    }
  
    return questions;
  }
  

// Generates a sub-range within a specified range
function generateSubRange(range) {
  if (range.max <= 20) return range;
  const maxSpan = 20;
  const start = Math.floor(Math.random() * (range.max - range.min + 1 - maxSpan)) + range.min;
  const end = Math.min(start + maxSpan - 1, range.max);
  return { min: start, max: end };
}

// Function to generate a partially filled number grid for counting numbers
function generateNumberGridContent(subRange, filledNumbers, answerCodes) {
  let codeIdx = 0;
  let gridHtml = `<div class='number-grid' style='display: grid; grid-template-columns: repeat(5, auto); gap: 0px;'>`;

  for (let i = subRange.min; i <= subRange.max; i++) {
    if (filledNumbers.includes(i)) {
      gridHtml += `<div class='number-cell filled'>${i}</div>`;
    } else {
      gridHtml += `<div contentEditable='true' answer-code='${answerCodes[codeIdx]}' class='number-cell fitted-div'></div>`;
      codeIdx++;
    }
  }

  gridHtml += "</div>";
  return gridHtml;
}

// Function to generate the question statement
function generateQuestionPart0(subRange, filledNumbers, answerCodes) {
  let qstmt = `<p><span class='audio-enabled'>Fill in the missing numbers.</span></p>`;
  return qstmt;
}

function generateQuestionPart1(subRange, filledNumbers, answerCodes) {
  let qstmt = generateNumberGridContent(subRange, filledNumbers, answerCodes, false);
  return qstmt;
}
// Function to generate the question object
function generateQuestion(questionNo, slab) {
  // Generate a random sub-range within the provided main range
  const subRange = generateSubRange(slab);

  // Generate a random set of filled numbers within the sub-range
  const filledNumbers = generateRandomNumbersInSubRange(subRange, Math.ceil((subRange.max - subRange.min + 1) / 3));
  const answerCodes = Array.from({ length: subRange.max - subRange.min + 1 - filledNumbers.length }, util.generateRandom4);

  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: customCSS,
    focusFirstInput: 1,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    totalPoints: 1,
    highestNumberHandled: slab.max,
    allowPartialScoring: false,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionPart0(subRange, filledNumbers, answerCodes),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [],
      },
      {
        autoContent: false,
        content: generateQuestionPart1(subRange, filledNumbers, answerCodes),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: generateAnswerKeys(subRange, filledNumbers, answerCodes),
      },
    ],
    explanation: "NONE",
  };
}

// Generate a random set of numbers to fill in the grid within the sub-range
function generateRandomNumbersInSubRange(subRange, count) {
  const numbers = new Set();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (subRange.max - subRange.min + 1)) + subRange.min;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

// Generate answer keys for the blank cells in the number grid
function generateAnswerKeys(subRange, filledNumbers, answerCodes) {
  const answerKeys = [];
  let codeIdx = 0;
  for (let i = subRange.min; i <= subRange.max; i++) {
    if (!filledNumbers.includes(i)) {
      answerKeys.push({
        answerCodes: [answerCodes[codeIdx++]],
        allowedAnswers: [[[i]]],
        caseSensitive: 0,
        ignoreSpaces: 0,
        ignoreHyphens: 0,
        ignoreCommas: 0,
      });
    }
  }
  return answerKeys;
}


// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
