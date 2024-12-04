const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

// Load the icons
const icon = { iconName: "dot.svg", singular: "dot", plural: "objects" };

// Helper function to generate random number within a digit range
function generateRandomNumber(digits) {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate all possible pairs and sample unique pairs if needed
function generateUniqueAddends(digitsA, digitsB, count) {
  const pairs = new Set();
  // Generate pairs until reaching the required count
  while (pairs.size < count) {
    const a = generateRandomNumber(digitsA);
    const b = generateRandomNumber(digitsB);
    const pair = [a, b].sort((x, y) => x - y).join(",");

    pairs.add(pair); // Ensure each pair is unique
  }

  return Array.from(pairs).map((pair) => pair.split(",").map(Number));
}

function generateSmallAddends() {
  const pairs = new Set();
  // Generate all pairs for 1-digit + 1-digit and 2-digit + 2-digit
  for (let i = 1; i <= 99; i++) {
    for (let j = 1; j <= 99 - i; j++) {
      pairs.add([i, j].sort((x, y) => x - y).join(","));
    }
  }
  return Array.from(pairs).map((pair) => pair.split(",").map(Number));
}

function generateQuestions (digitsA, digitsB, count) {
  let addends = [];
  if (digitsA == 0) {
    addends = generateSmallAddends ();
  }
  else {
    addends = generateUniqueAddends (digitsA, digitsB, count);
  }

  for (let i = 0; i < addends.length; ++i) {
    switch (i % 7){
      case 0:
        sum_horizontal_layout (addends[i]);
        break;
      case 1:
        sum_select (addends[i]);
        break;
      case 2:
        sum_true_or_false (addends[i]);
        break;
      case 3:
        sum_calculator_grid (addends[i]);
        break;
      case 4:
        addend_horizontal_layout (addends[i]);
        break;
      case 5:
        addend_select (addends[i]);
        break;
      case 6:
        sum_vertical_layout (addends[i]);
        break;
      default:
        break;
    }
  }
}
function generateAllQuestions() {
  const questions = [];
  let questionNo = 0;
  generateQuestions (0, 0, 0);
  generateQuestions(3, 1, 3000); 
  generateQuestions(3, 2, 6000); 
  generateQuestions(3, 3, 6000); 
  generateQuestions(4, 1, 3000); 
  generateQuestions(4, 2, 3000); 
  generateQuestions(4, 3, 6000); 
  generateQuestions(4, 4, 6000); 
  generateQuestions(5, 3, 3000); 
  generateQuestions(5, 4, 6000); 
  generateQuestions(5, 5, 6000); 
  generateQuestions(6, 2, 3000); 
  generateQuestions(6, 3, 3000); 
  generateQuestions(6, 4, 3000); 
  generateQuestions(6, 5, 3000); 
  generateQuestions(6, 6, 3000); 
  generateQuestions(7, 4, 3000); 
  generateQuestions(7, 5, 3000); 
  generateQuestions(7, 6, 3000); 
  generateQuestions(7, 7, 3000); 
}

// Function to create individual question objects
function sum_horizontal_layout(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const requiresRegrouping = util.requiresRegrouping(numbers[0], numbers[1]);

  let exerciseId = sum <= 5 ? 19 : sum <= 10 ? 20 : sum <= 18 ? 21 : !requiresRegrouping ? 22 : 23;
  let topicId = sum <= 5 ? 452 : sum <= 10 ? 25 : sum <= 18 ? 26 : !requiresRegrouping ? 27 : 28;
  let answerCode = generateRandom4();
  let answerExplanation;
  return {
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: null,
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseId: exerciseId,
    topicId: topicId,
    highestNumberHandled: sum,
    exampleQuestionId: null,
    sumPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    instructions: null,
    hint1: null,
    hint2: null,
    questionStatus: "PENDING_REVIEW",
    remarks: null,
    parts: [
      {
        autoContent: 0,
        content: `<p class='audio-enabled'><div class='equation'> <div class='lhs'>${numbers[0]} + ${numbers[1]}</div> <div class='equalto-sign'>=</div> <div class='rhs'><input type='text' name='${answerCode}' answer-code='${answerCode}' size='2' class='form-control blank'></div></div></p>`,
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
            content: "",
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 0,
            ignoreCommas: 0,
            allowTypos: 0,
            answerUnit: "",
            inputType: "INPUT",
            combinedInputJoinChar: "",
            inputWidth: "auto",
            inputHeight: "auto",
            matchInAnyOrder: 0,
            answerExplanation: null,
            dropAreaLabel: null,
            dropZonesPerRow: 1,
            answerLinkedWith: null,
            points: 1,
            answerCodes: [answerCode],
            allowedAnswers: [[[sum]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: answerExplanation,
  };
}

// Generate the questions and save them to the JSON file
generateAllQuestions();


const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);
