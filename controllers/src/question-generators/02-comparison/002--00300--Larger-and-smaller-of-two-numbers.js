const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, rangeDesc: "1-3", count: 3 },
  { min: 1, max: 5, rangeDesc: "1-5", count: 10 },
  { min: 1, max: 9, rangeDesc: "1-9", count: 10 },
  { min: 10, max: 20, rangeDesc: "10-20", count: 10 },
  { min: 21, max: 50, rangeDesc: "21-50", count: 50 },
  { min: 51, max: 99, rangeDesc: "51-99", count: 50 },
  { min: 10, max: 999, rangeDesc: "upto 999", count: 50 },
  { min: 100, max: 999, rangeDesc: "upto 999", count: 300 },
  { min: 100, max: 9999, rangeDesc: "upto 9999", count: 50 },
  { min: 1000, max: 9999, rangeDesc: "upto 9999", count: 300 },
  { min: 1000, max: 99999, rangeDesc: "upto 99999", count: 50 },
  { min: 10000, max: 99999, rangeDesc: "upto 99999", count: 300 },
  { min: 10000, max: 999999, rangeDesc: "upto 999999", count: 50 },
  { min: 100000, max: 999999, rangeDesc: "upto 999999", count: 300 },
  { min: 100000, max: 9999999, rangeDesc: "upto 9999999", count: 50 },
  { min: 1000000, max: 9999999, rangeDesc: "upto 9999999", count: 300 },
  { min: 1000000, max: 99999999, rangeDesc: "upto 99999999", count: 50 },
  { min: 10000000, max: 99999999, rangeDesc: "upto 99999999", count: 300 },
  { min: 10000000, max: 999999999, rangeDesc: "upto 999999999", count: 50 },
  { min: 100000000, max: 999999999, rangeDesc: "upto 999999999", count: 300 },
];

let customCSS = `
.math-rule {padding-top:10px;padding-bottom:10px; font-weight:400}
.place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
.place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px; min-width:50px}
.highlight-cell {background-color: #f0fafe }
.number-grid {border: 2px solid #b7e7fb; width: auto;}
.number-grid td {border: 2px solid #b7e7fb; padding: 10px;} 
.em-answer {font-weight:bold} 
`;

let exerciseDesc = `
Which number is larger/smaller?
2 numbers are given as options.
To solve, select the larger/smaller number.

This exercise generates 2 variations: 1. larger, 2. smaller
All solutions have the same number of steps. Twistiness is always 0.
`;


function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numbersSet = new Set();
    if (slab.count == 0) continue;

    let retries = 0;
    while (numbersSet.size < slab.count) {
      let i = util.getRandomNumber(slab.min, slab.max);
      let j = util.generateConfusingNumbers([i], 2, slab.min, slab.max);
      numbersSet.add(`${j[0]},${j[1]}`);
      retries++;
      if (retries > 2 * slab.count) break;
    }

    let numberArr = Array.from(numbersSet).map((item) => {
      const [i, j] = item.split(",").map(Number);
      return [i, j];
    });

    for (let i = 0; i < numberArr.length; ++i) {
      let question = generateQuestion(questionNo++, numberArr[i], slab);
      if (question) questions.push(question);
    }
  }
  return questions;
}

function generateQuestionPart0(numbers, questionType, slab, answerCodes) {
  let qstmt = `<p><span class='audio-enabled'>Which number is ${questionType}?</span></p>`;
  return qstmt;
}

function generateAnswerKeys1(numbers, questionType, slab, answerCodes) {
  let answerKeys = [];
  let correctAnswer = questionType == "larger" ? Math.max(...numbers) : Math.min(...numbers);

  for (let i = 0; i < numbers.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i]],
      allowedAnswers: [[[numbers[i] == correctAnswer ? 1 : 0]]],
      content: `${util.addCommasToNumber(numbers[i])}`
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(numbers, questionType, slab, answerCodes) {
  let expln = ``;
  let correctAnswer = questionType == "larger" ? Math.max(...numbers) : Math.min(...numbers);
  if (correctAnswer <= 9) {
    return compareByCounting(numbers, questionType, slab, answerCodes);
  }
  if (correctAnswer <= 99) {
    return compareUsing100sChart(numbers, questionType, slab, answerCodes);
  } else {
    return compareWithPlaceChart(numbers, questionType, slab, answerCodes);
  }
}

// Simplified comparison logic for smaller sets
function compareByCounting(numbers, questionType, slab, answerCodes) {
  let expln = ``;
  expln += `<p><span class="audio-enabled">Say the counting numbers from 1 to 10</span>.</p>`;
  expln += `<p>`;
  for (i = 1; i <= 10; ++i) {
    if (numbers.includes(i)) {
      expln += `<span class="em-answer"><span style="margin-right:15px">${i}</span></span>`;
    } else {
      expln += `<span style="margin-right:15px">${i}</span>`;
    }
  }
  let lessCount = Math.min (numbers);
  let moreCount = Math.max (numbers);
  if (questionType == "smaller") {
    expln += `<p><span class="audio-enabled">${lessCount} comes before ${moreCount}</span>.</p>`;
    expln += `<p><span class="audio-enabled"><span class="em-answer">${lessCount}</span> is the smaller number</span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">${moreCount} comes afer ${lessCount}</span>.</p>`;
    expln += `<p><span class="audio-enabled"><span class="em-answer">${util.numberToHTML(numbers[0])}</span> is the larger number</span>.</p>`;
  }
  return expln;
}

function compareUsing100sChart(numbers, questionType, slab, answerCodes) {
    let expln = ``;
    expln += `<p><span class="audio-enabled">Consider the counting numbers 1 to 100</span>.</p>`;
    expln += util.numberChart(1, 100, 10, numbers, false, []);
    expln += `<br/>`;
  
    let lessCount = Math.min (numbers);
    let moreCount = Math.max (numbers);
    if (questionType == "smaller") {
      expln += `<p><span class="audio-enabled">${lessCount} comes before ${moreCount}</span>.</p>`;
      expln += `<p><span class="audio-enabled"><span class="em-answer">${lessCount}</span> is the smaller number</span>.</p>`;
    } else {
      expln += `<p><span class="audio-enabled">${moreCount} comes afer ${lessCount}</span>.</p>`;
      expln += `<p><span class="audio-enabled"><span class="em-answer">${util.numberToHTML(numbers[0])}</span> is the larger number</span>.</p>`;
    }
    return expln;
  }
  
  function findFirstDifferentDigitIdx(numbers) {
    for (let i = 0; i < numbers[0].toString().length; ++i) {
      const digitSet = new Set();   
      for (let number of numbers) {
        const digit = number.toString()[i];
        digitSet.add(digit);
        if (digitSet.size > 1) {
          return i;
        }
      }
    }
    return -1;
  }

  function compareWithPlaceChart(numbers, questionType, slab, answerCodes) {
    let expln = ``;
    expln += `<p><span class="audio-enabled">To compare numbers, we follow these rules</span>.</p>`;
    expln += `<div class="math-rule"><span class="audio-enabled">1. Compare the number of digits. The number with more digits is greater.</span></div>`;
    let correctAnswer = questionType == "largest" ? Math.max(...numbers) : Math.min(...numbers);
    if (numbers.some((num) => num.toString().length !== correctAnswer.toString().length)) {
      expln += `<p><span class="audio-enabled">${util.numberToHTML(correctAnswer)} has ${
        correctAnswer.toString().length
      } digits. It is ${questionType ? "larger" : "smaller"}.</span></p>`;
    } else {
      expln += `<p><span class="audio-enabled">Both, ${util.numberToHTML (numbers[0])} and ${util.numberToHTML (numbers[1])} have ${numbers[0].toString().length} digits</span></p>`
      expln += `<div class="math-rule"><span class="audio-enabled">2. If the number of digits is the same, start comparing digits from extreme left and move one digit right till you come across different digit
      </span>.</div>`;
      expln += util.placeValueChart(numbers, "International", [findFirstDifferentDigitIdx(numbers)], false);
      expln += "<br/>";
      expln += `<p><span>Compare the digits. The number with the ${questionType} digit is ${questionType}</span></p>`
  
      expln += `<p><span><span class="em-answer">${util.numberToHTML(
        correctAnswer
      )} is ${questionType}</span>.</span></p>`;
    }
    return expln;
  }
  

// Generate a single question
function generateQuestion(questionNo, numbers, slab) {
  let questionType = questionNo % 2 == 0 ? "larger" : "smaller";
  const answerCodes = Array.from({ length: 2 }, util.generateRandom4); // Only two options
  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: (questionType == "larger") ? 1 : 2, 
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: customCSS,
    sourceDetail: fileNameWithoutExt,
    exerciseDesc: exerciseDesc,
    highestNumberHandled: Math.max(...numbers),
    focusFirstInput: 1,
    parts: [
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart0(numbers, questionType, slab, answerCodes),
        answerKeys: [],
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: "",
        answerKeys: generateAnswerKeys1(numbers, questionType, slab, answerCodes),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(numbers, questionType, slab, answerCodes),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
