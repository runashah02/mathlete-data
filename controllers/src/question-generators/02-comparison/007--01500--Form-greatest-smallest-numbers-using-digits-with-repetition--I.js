const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 10, max: 20, rangeDesc: "2-digits", count: 2 },
  { min: 21, max: 50, rangeDesc: "2-digits", count: 10 },
  { min: 51, max: 99, rangeDesc: "2-digits", count: 10 },
  { min: 100, max: 999, rangeDesc: "3-digits", count: 100 },
  { min: 1000, max: 9999, rangeDesc: "4-digits", count: 100 },
  { min: 10000, max: 99999, rangeDesc: "5-digits", count: 100 },
  { min: 100000, max: 999999, rangeDesc: "6-digits", count: 100 },
  { min: 1000000, max: 9999999, rangeDesc: "7-digits", count: 100 },
  { min: 10000000, max: 99999999, rangeDesc: "8-digits", count: 100 },
  { min: 100000000, max: 999999999, rangeDesc: "9-digits", count: 100 },
];

let exerciseDesc = `
Form the greatest/smallest x-digit number using the given digits when repetition is allowed
Form the number and fill in the blank

This exercise generates 2 variations: greatest, smallest
Twistiness is 0 if none of the digits are 0, 1 if there is a 0 (for then it is not just repeating digits).
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numbersSet = new Set();
    if (slab.count == 0) continue;

    while (numbersSet.size < slab.count) {
      let number = util.getRandomNumber(slab.min, slab.max);
      let requiresAZero = Math.random < 0.5;
      if (goodNumber(number, requiresAZero)) {
        numbersSet.add(number);
      }
    }
    numbersSet.forEach((number) => {
      const digits = number.toString().split("").map(Number);
      const zeroCount = digits.filter((digit) => digit === 0).length;
      let twistiness = zeroCount > 0 ? 1 : 0;

      questions.push(generateQuestion(questionNo++, digits, "smallest", twistiness, slab));
      questions.push(generateQuestion(questionNo++, digits, "largest", twistiness, slab));
    });
  }
  return questions;
}

function goodNumber(number, requiresAZero) {
  // For these problems all digits for a number munst be unique
  // In atleast some cases, a good twistiness is one of the digits is zero
  const digits = Array.from(new Set(String(number).split("").map(Number)));
  const zeroCount = digits.filter((digit) => digit === 0).length;
  return digits.length == number.toString().length && (requiresAZero ? zeroCount > 0 : true);
}

// Function to generate smallest and largest numbers from digits with repetition allowed
function formNumbersFromDigits(digits) {
  let length = digits.length;
  const sortedDigitsAsc = digits.slice().sort((a, b) => a - b);
  const sortedDigitsDesc = digits.slice().sort((a, b) => b - a);

  // Form smallest and largest numbers by repeating the smallest/largest digits until the desired length
  let smallest, largest;

  if (sortedDigitsAsc[0] === 0 && sortedDigitsAsc.length > 1) {
    // Avoid leading zero for smallest number, use the next smallest non-zero digit for first position
    smallest = parseInt([sortedDigitsAsc[1], ...Array(length - 1).fill(sortedDigitsAsc[0])].join(""), 10);
  } else {
    smallest = parseInt(Array(length).fill(sortedDigitsAsc[0]).join(""), 10);
  }

  largest = parseInt(Array(length).fill(sortedDigitsDesc[0]).join(""), 10);
  return { smallest, largest };
}


// Function to generate a question statement
function generateQuestionStatement(digits, type, answerCode) {
  const digitsString = digits.map ((digit) => {return `<span class="spotlight">${digit}</span>`}).join(", ");
  return `<p><span class='audio-enabled'>Form the ${
    type === "smallest" ? "smallest" : "largest"
  } ${digits.length}-digit number possible using the digits: ${digitsString} when repetition is allowed</span>.</p>`;
}

// Function to create answer explanation
function generateAnswerExplanation(type, digits, answer) {
  let length = digits.length;
  let expln = `<p><span class='audio-enabled'>To form the ${type} ${digits.length}-digit number, find the ${type} ${type === "smallest" ? "non-zero" : ""} digit.</span></p>`;
  const sortedDigits =
    type === "smallest" ? digits.slice().sort((a, b) => a - b) : digits.slice().sort((a, b) => b - a);
  if (sortedDigits [0] === 0){
    const firstNonZeroDigit = sortedDigits.find((digit) => digit !== 0);
    expln += `<p><span class='audio-enabled'>The smallest non-zero digit is ${firstNonZeroDigit}</span>.</p>`;
    expln += `<p><span class='audio-enabled'>Since repetition of digits is allowed, the smallest ${length}-digit number is formed by starting with ${firstNonZeroDigit} and repeating 0, ${length -1} times</span>.</p>`;
  }
  else {
    expln += `<p><span class='audio-enabled'>The ${type} ${type === "smallest" ? "non-zero" : ""} digit is ${sortedDigits[0]}.`;
    expln += `<p><span class='audio-enabled'>Since repetition of digits is allowed, the ${type} ${length}-digit number is formed by repeating ${sortedDigits[0]}, ${length} times</span>.</p>`;
  }

  expln += `<p><span class='audio-enabled'>The ${type} ${length}-digit number is <b>${answer}</b></span>.</p>`;
  return expln;
}

// Function to generate custom CSS for questions
function exerciseCustomCSS() {
  return ``;
}

// Function to generate a single question object
function generateQuestion(questionNo, digits, type, twistiness, slab) {
  const answerCode = util.generateRandom4();
  const { smallest, largest } = formNumbersFromDigits(digits);
  const answer = type === "smallest" ? smallest : largest;

  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    variation: type == "smallest" ? 1 : 2,       
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: exerciseCustomCSS(),
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseId: slab.exerciseId,
    sourceDetail: fileNameWithoutExt,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: twistiness,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(digits, type, answerCode),
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
            allowedAnswers: [[[answer]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(type, digits, answer),
  };
  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);


