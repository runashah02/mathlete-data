const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 10, max: 20, rangeDesc: "10-20", count: 5 },
  { min: 21, max: 50, rangeDesc: "21-50", count: 10 },
  { min: 51, max: 99, rangeDesc: "51-99", count: 10 },
  { min: 100, max: 999, rangeDesc: "3-digits", count: 100 },
];

let exerciseDesc = `
Form all possible x-digit numbers using the given digits exactly once
4 unique digits are given.
Form the numbers and fill in the blank with the total count of numbers formed

This exercise has only 1 variation
Twistiness is 0 if none of the digits are 0, 1 if there is a 0 (for then it is not just organizing digits in ascending order).
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numbersSet = new Set();
    if (slab.count == 0) continue;

    if (slab.min <= 10 && slab.max >= 10) {
      numbersSet.add(10);
    }
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
      questions.push(generateQuestion(questionNo++, digits, twistiness, slab));
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

function generateAllNumbers(digits) {
  // Helper function for generating permutations
  function permute(arr, prefix = "") {
    if (arr.length === 0) {
      results.push(parseInt(prefix, 10)); // Convert the permutation to a number
    } else {
      for (let i = 0; i < arr.length; i++) {
        const newPrefix = prefix + arr[i];
        const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
        permute(remaining, newPrefix);
      }
    }
  }

  // Ensure input array is valid
  if (!Array.isArray(digits) || digits.length < 2 || digits.length > 4) {
    throw new Error("Input must be an array of 2 to 4 unique digits.");
  }

  // Check for uniqueness of digits
  if (new Set(digits).size !== digits.length) {
    throw new Error("Digits must be unique.");
  }

  const results = [];
  permute(digits);
  return results.filter((result) => {
    return result.toString().length == digits.length;
  });
}

// Function to generate a question statement
function generateQuestionStatement(digits) {
  const digitsString = digits
    .map((digit) => {
      return `<span class="spotlight">${digit}</span>`;
    })
    .join(", ");
  return `<p><span class='audio-enabled'>How many different ${digits.length}-digit numbers can you form using ${digitsString} only once?</span>.</p>`;
}

// Function to create answer explanation
function generateAnswerExplanation(digits, possibleNumbers) {
  let expln = ``;
  let digitStr = digits.join(", ");

  if (digits.length == 3) {
    expln += `<p><span class='audio-enabled'>To make ${digits.length}-digit numbers using the given digits ${digitStr}, only once, follow the steps below:</span></p>`;

    for (let leftmostDigitIndex = 0; leftmostDigitIndex < digits.length; ++leftmostDigitIndex) {
      let stepDesc = ["", "Now,", "Finally,"][leftmostDigitIndex];

      const leftmostDigit = digits[leftmostDigitIndex];
      expln += `<p><span class='audio-enabled'>${stepDesc} Fix ${leftmostDigit} in the left most place</span></p>`;
      if (leftmostDigit == 0) {
        expln += `<p><span class='audio-enabled'>A number cannot start with 0. So, skip all possible arrangements starting with 0`;
        continue;
      }
      const remainingDigits = digits.filter((digit, index) => index !== leftmostDigitIndex);
      expln += `
        <div class="digits-box">
          <div class="digit-box digit-box-left">
            ${leftmostDigit}
          </div>
          <div class="digit-box digit-box-middle"></div>
          <div class="digit-box digit-box-right">
          </div>
        </div>
      `;

      const [a, b] = remainingDigits;
      expln += `<p><span class='audio-enabled'>Remaining digits ${remainingDigits.join(
        ", "
      )}</span> can be arranged in the other two places in two ways: ${a}${b} and ${b}${a}</span></p>`;
      const possibleArrangements = [];
      possibleArrangements.push([a, b]);
      possibleArrangements.push([b, a]);
      for (let arrangement of possibleArrangements) {
        expln += `
        <div class="digits-box">
            <div class="digit-box digit-box-left">
            ${leftmostDigit}
            </div>
            <div class="digit-box digit-box-middle">
            ${arrangement[0]}
            </div>
            <div class="digit-box digit-box-right">
            ${arrangement[1]}
            </div>
        </div>
        `;
      }
    }
  } 
  expln += `<p><span class='audio-enabled'>
  Using the digits ${digitStr} only once, it is possible to make <span class="em-answer">${possibleNumbers.length}</span> numbers: ${possibleNumbers}</span></p>`;

  return expln;
}

// Function to generate custom CSS for questions
function exerciseCustomCSS() {
  return `
  .digits-box {display: flex; align-items: center; margin-bottom: 10px;}
  .digit-box {width: 60px; height: 60px; text-align: center; line-height: 60px; box-sizing: border-box; margin: 0;}
  .digit-box-left {background-color: #f0fafe; border-left: 2px solid #b7e7fb; border-right: 2px dotted #b7e7fb; border-top: 2px solid #b7e7fb; border-bottom: 2px solid #b7e7fb;}
  .digit-box-middle {border-top: 2px solid #b7e7fb; border-bottom: 2px solid #b7e7fb;}
  .digit-box-right {border-left: 2px dotted #b7e7fb; border-right: 2px solid #b7e7fb; border-top: 2px solid #b7e7fb; border-bottom: 2px solid #b7e7fb;}
  `;
}

// Function to generate a single question object
function generateQuestion(questionNo, digits, twistiness, slab) {
  const possibleAnswers = generateAllNumbers(digits);
  const answerCode = util.generateRandom4 ();
  const allowedAnswer = possibleAnswers.length;

  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: 1,     
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: exerciseCustomCSS(),
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseDesc: exerciseDesc,
    sourceDetail: fileNameWithoutExt,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: twistiness,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(digits),
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
            inputType: "COMBINED_INPUT",
            matchInAnyOrder: 1,
            allowedAnswers: [[[allowedAnswer]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(digits, possibleAnswers),
  };
  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
