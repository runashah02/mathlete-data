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
State whether true or false. The greatest/smallest x-digit number using the given digits a, b, c, d when repetition is allowed is ____
4 confusing numbers are given as options.
To solve, select the correct number

This exercise generates 4 variations: greatest and true, greatest and false, smallest and true, smallest and false
Twistiness is 0 if none of the digits are 0, 1 if there is a 0 (for then it is not just organizing digits in ascending order).
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numbersSet = new Set();
    if (slab.count === 0) continue;

    while (numbersSet.size < slab.count) {
      let number = util.getRandomNumber(slab.min, slab.max);
      let requiresAZero = Math.random() < 0.5;
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
  const digits = Array.from(new Set(String(number).split("").map(Number)));
  const zeroCount = digits.filter((digit) => digit === 0).length;
  return digits.length === number.toString().length && (requiresAZero ? zeroCount > 0 : true);
}

function formNumbersFromDigitsWithoutRepetition(digits) {
  const sortedDigitsAsc = digits.slice().sort((a, b) => a - b);
  const sortedDigitsDesc = digits.slice().sort((a, b) => b - a);

  if (sortedDigitsAsc[0] === 0 && sortedDigitsAsc.length > 1) {
    const firstNonZeroIndex = sortedDigitsAsc.findIndex((digit) => digit !== 0);
    [sortedDigitsAsc[0], sortedDigitsAsc[firstNonZeroIndex]] = [sortedDigitsAsc[firstNonZeroIndex], sortedDigitsAsc[0]];
  }

  const smallest = parseInt(sortedDigitsAsc.join(""), 10);
  const largest = parseInt(sortedDigitsDesc.join(""), 10);
  return { smallest, largest };
}

function formNumbersFromDigits(digits) {
  let length = digits.length;
  const sortedDigitsAsc = digits.slice().sort((a, b) => a - b);
  const sortedDigitsDesc = digits.slice().sort((a, b) => b - a);

  let smallest, largest;

  if (sortedDigitsAsc[0] === 0 && sortedDigitsAsc.length > 1) {
    smallest = parseInt([sortedDigitsAsc[1], ...Array(length - 1).fill(sortedDigitsAsc[0])].join(""), 10);
  } else {
    smallest = parseInt(Array(length).fill(sortedDigitsAsc[0]).join(""), 10);
  }

  largest = parseInt(Array(length).fill(sortedDigitsDesc[0]).join(""), 10);
  return { smallest, largest };
}

function generateIncorrectAnswer(digits, type) {
  const sortedDigitsAsc = digits.slice().sort((a, b) => a - b);
  const sortedDigitsDesc = digits.slice().sort((a, b) => b - a);
  let incorrectAnswer;
  let length = digits.length;

  if (type === "smallest") {
    let n1, n2;
    ({ smallest: n1, largest: n2 } = formNumbersFromDigitsWithoutRepetition(digits));
    const option1 = n1;

    ({ smallest: n1, largest: n2 } = formNumbersFromDigits(digits));
    const option2 = n2;

    const zeroCount = digits.filter((digit) => digit === 0).length;
    let option3;

    if (zeroCount > 0) {
      option3 = parseInt(sortedDigitsAsc.join(""), 10);
    }

    let option4;
    if (digits.length > 2) {
      let [i, j] = util.generateUniqueNumbers([], 2, 1, digits.length - 1);
      [sortedDigitsAsc[i], sortedDigitsAsc[j]] = [sortedDigitsAsc[j], sortedDigitsAsc[i]];
      option4 = parseInt(sortedDigitsAsc.join(""), 10);
    }

    const options = [
      { value: option1, weight: 0.4 },
      { value: option2, weight: 0.3 },
      { value: option3, weight: 0.2 },
      { value: option4, weight: 0.1 },
    ].filter((opt) => opt.value !== undefined);

    incorrectAnswer = selectWeightedOption(options);
  } else {
    let n1, n2;
    ({ smallest: n1, largest: n2 } = formNumbersFromDigitsWithoutRepetition(digits));
    const option1 = n2;

    ({ smallest: n1, largest: n2 } = formNumbersFromDigits(digits));
    const option2 = n1;

    let option3;
    if (digits.length > 2) {
      let [i, j] = util.generateUniqueNumbers([], 2, 1, digits.length - 1);
      [sortedDigitsDesc[i], sortedDigitsDesc[j]] = [sortedDigitsDesc[j], sortedDigitsDesc[i]];
      option3 = parseInt(sortedDigitsDesc.join(""), 10);
    }

    const options = [
      { value: option1, weight: 0.4 },
      { value: option2, weight: 0.4 },
      { value: option3, weight: 0.2 },
    ].filter((opt) => opt.value !== undefined);

    incorrectAnswer = selectWeightedOption(options);
  }

  return incorrectAnswer;
}

function selectWeightedOption(options) {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  const randomValue = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (let option of options) {
    cumulativeWeight += option.weight;
    if (randomValue < cumulativeWeight) {
      return option.value;
    }
  }
}

function generateTrueFalseQuestionStatement(digits, type, proposedAnswer) {
  const digitsString = digits.map((digit) => `<span class="spotlight">${digit}</span>`).join(", ");
  return `<p>State whether True or False</p>
  <p>The ${type} ${digits.length}-digit number formed using ${digitsString}, when repetition is allowed, is ${proposedAnswer}</p>`;
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

function generateQuestion(questionNo, digits, type, twistiness, slab) {
  const { smallest, largest } = formNumbersFromDigits(digits);
  const correctAnswer = type === "smallest" ? smallest : largest;

  const answerCodeTrue = util.generateRandom4();
  const answerCodeFalse = util.generateRandom4();

  const proposedAnswer =
    Math.random() > 0.5 ? generateIncorrectAnswer(digits, type) : correctAnswer.toString();

  return {
    questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: type == "smallest" ? 1 : 2,       
    questionType: "MULTIPLE_CHOICE",
    exerciseDesc: exerciseDesc,
    sourceDetail: fileNameWithoutExt,
    twistiness: twistiness,
    highestNumberHandled: Math.max(correctAnswer, parseInt(proposedAnswer, 10)),
    parts: [
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateTrueFalseQuestionStatement(digits, type, proposedAnswer),
        answerKeys: [],
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [
          {
            answerCodes: [answerCodeTrue],
            content: "True",
            allowedAnswers: [[[parseInt(proposedAnswer, 10) === correctAnswer ? 1 : 0]]],
          },
          {
            answerCodes: [answerCodeFalse],
            content: "False",
            allowedAnswers: [[[parseInt(proposedAnswer, 10) === correctAnswer ? 0 : 1]]],
          },
        ],
      },
    ],
    answerExplanation: generateAnswerExplanation(type, digits, correctAnswer),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
