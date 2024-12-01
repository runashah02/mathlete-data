const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { rangeDesc: "1-3", variation: 1, min1: 1, max1: 3, min2: 1, max2: 3, count: -1 },
  { rangeDesc: "1-5", variation: 1, min1: 1, max1: 5, min2: 5, max2: 3, count: -1 },
  { rangeDesc: "1-9", variation: 1, min1: 1, max1: 9, min2: 1, max2: 9, count: -1 },
  { rangeDesc: "1-20", variation: 1, min1: 1, max1: 9, min2: 10, max2: 20, count: -1 },
  { rangeDesc: "10-20", variation: 4, min1: 10, max1: 20, min2: 10, max2: 20, count: -1 },
  { rangeDesc: "1-50", variation: 1, min1: 1, max1: 9, min2: 21, max2: 50, count: -1 },
  { rangeDesc: "1-50", variation: 4, min1: 10, max1: 50, min2: 21, max2: 50, count: 300 },
  { rangeDesc: "1-99", variation: 1, min1: 1, max1: 9, min2: 51, max2: 99, count: 300 },
  { rangeDesc: "10-99", variation: 4, min1: 10, max1: 99, min2: 51, max2: 99, count: 300 },
  { rangeDesc: "3-digits", variation: 1, min1: 1, max1: 9, min2: 100, max2: 999, count: 50 },
  { rangeDesc: "3-digits", variation: 4, min1: 10, max1: 99, min2: 100, max2: 999, count: 300 },
  { rangeDesc: "3-digits", variation: 7, min1: 100, max1: 999, min2: 100, max2: 999, count: 300 },
  { rangeDesc: "4-digits", variation: 1, min1: 1, max1: 9, min2: 1000, max2: 9999, count: 0 },
  { rangeDesc: "4-digits", variation: 4, min1: 10, max1: 99, min2: 1000, max2: 9999, count: 50 },
  { rangeDesc: "4-digits", variation: 7, min1: 100, max1: 999, min2: 1000, max2: 9999, count: 300 },
  { rangeDesc: "4-digits", variation: 10, min1: 1000, max1: 9999, min2: 1000, max2: 9999, count: 300 },
  { rangeDesc: "5-digits", variation: 1, min1: 1, max1: 9, min2: 10000, max2: 99999, count: 0 },
  { rangeDesc: "5-digits", variation: 4, min1: 10, max1: 99, min2: 10000, max2: 99999, count: 0 },
  { rangeDesc: "5-digits", variation: 7, min1: 100, max1: 999, min2: 10000, max2: 99999, count: 50 },
  { rangeDesc: "5-digits", variation: 10, min1: 1000, max1: 9999, min2: 10000, max2: 99999, count: 300 },
  { rangeDesc: "5-digits", variation: 13, min1: 10000, max1: 99999, min2: 10000, max2: 99999, count: 300 },
  { rangeDesc: "6-digits", variation: 1, min1: 1, max1: 9, min2: 100000, max2: 999999, count: 0 },
  { rangeDesc: "6-digits", variation: 4, min1: 10, max1: 99, min2: 100000, max2: 999999, count: 0 },
  { rangeDesc: "6-digits", variation: 7, min1: 100, max1: 999, min2: 100000, max2: 999999, count: 0 },
  { rangeDesc: "6-digits", variation: 10, min1: 1000, max1: 9999, min2: 100000, max2: 999999, count: 50 },
  { rangeDesc: "6-digits", variation: 13, min1: 10000, max1: 99999, min2: 100000, max2: 999999, count: 300 },
  { rangeDesc: "6-digits", variation: 16, min1: 100000, max1: 999999, min2: 100000, max2: 999999, count: 300 },
  { rangeDesc: "7-digits", variation: 1, min1: 1, max1: 9, min2: 1000000, max2: 9999999, count: 0 },
  { rangeDesc: "7-digits", variation: 4, min1: 10, max1: 99, min2: 1000000, max2: 9999999, count: 0 },
  { rangeDesc: "7-digits", variation: 7, min1: 100, max1: 999, min2: 1000000, max2: 9999999, count: 0 },
  { rangeDesc: "7-digits", variation: 10, min1: 1000, max1: 9999, min2: 1000000, max2: 9999999, count: 0 },
  { rangeDesc: "7-digits", variation: 13, min1: 10000, max1: 99999, min2: 1000000, max2: 9999999, count: 50 },
  { rangeDesc: "7-digits", variation: 16, min1: 100000, max1: 999999, min2: 1000000, max2: 9999999, count: 300 },
  { rangeDesc: "7-digits", variation: 19, min1: 1000000, max1: 9999999, min2: 100000, max2: 9999999, count: 300 },
  { rangeDesc: "8-digits", variation: 1, min1: 1, max1: 9, min2: 10000000, max2: 99999999, count: 0 },
  { rangeDesc: "8-digits", variation: 4, min1: 10, max1: 99, min2: 10000000, max2: 99999999, count: 0 },
  { rangeDesc: "8-digits", variation: 7, min1: 100, max1: 999, min2: 10000000, max2: 99999999, count: 0 },
  { rangeDesc: "8-digits", variation: 10, min1: 1000, max1: 9999, min2: 10000000, max2: 99999999, count: 0 },
  { rangeDesc: "8-digits", variation: 13, min1: 10000, max1: 99999, min2: 10000000, max2: 99999999, count: 0 },
  { rangeDesc: "8-digits", variation: 16, min1: 100000, max1: 999999, min2: 10000000, max2: 99999999, count: 50 },
  { rangeDesc: "8-digits", variation: 19, min1: 1000000, max1: 9999999, min2: 10000000, max2: 99999999, count: 300 },
  { rangeDesc: "8-digits", variation: 22, min1: 10000000, max1: 99999999, min2: 10000000, max2: 99999999, count: 300 },
  { rangeDesc: "9-digits", variation: 1, min1: 1, max1: 9, min2: 100000000, max2: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 4, min1: 10, max1: 99, min2: 100000000, max2: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 7, min1: 100, max1: 999, min2: 100000000, max2: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 10, min1: 1000, max1: 9999, min2: 100000000, max2: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 13, min1: 10000, max1: 99999, min2: 100000000, max2: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 16, min1: 100000, max1: 999999, min2: 100000000, max2: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 19, min1: 1000000, max1: 9999999, min2: 100000000, max2: 999999999, count: 50 },
  { rangeDesc: "9-digits", variation: 22, min1: 10000000, max1: 99999999, min2: 100000000, max2: 999999999, count: 300 },
  { rangeDesc: "9-digits", variation: 25, min1: 100000000, max1: 999999999, min2: 100000000, max2: 999999999, count: 300 },
];


let customCSS = `
.math-rule {padding-top:10px;padding-bottom:10px; font-weight:400}
.place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
.place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px; min-width:50px}
.highlight-cell {background-color: #f0fafe }
.number-grid {border: 2px solid #b7e7fb; width: auto;}
.number-grid td {border: 2px solid #b7e7fb; padding: 10px;} 
.display-grid {display:grid; gap:20px; grid-template-columns:repeat(3, auto); align-items:center}
.ca-blank {width:150px;padding:5px;height:40px;line-height:30px;vertical-align:middle;text-align:center;border:1px solid black;border-radius:4px;}
.focussed-input {border-color: blue}
`;

let exerciseDesc = `
Compare numbers and fill boxes around the sign: ___ </> ___
Two unique nunbers are given as options.
To solve, put the correct number in the box so that the statement is true

This exercise generates 2 variations: 1. <,  3. > 
All solutions have the same number of steps. Twistiness is always 0.
`;


function generateQuestions() {
  let questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numbersSet = new Set();
    if (slab.count == 0) continue;
    if (slab.count < 0) {
      for (let i = slab.min1; i < slab.max1; ++i) {
        for (let j = slab.min2; j < slab.max2; ++j) {
          if (i != j) {
            numbersSet.add(`${i},${j}`);
          }
        }
      }
    } else {
      let retries = 0;
      while (numbersSet.size < slab.count) {
        let i = util.getRandomNumber(slab.min2, slab.max2);
        let j = util.generateConfusingNumbers([i], 2, slab.min1, slab.max1);
        numbersSet.add(`${j[0]},${j[1]}`);
        retries ++;
        if (retries > 2 * slab.count) break;
      }
    }

    let numberArr = Array.from(numbersSet).map((item) => {
      const [i, j] = item.split(",").map(Number); // Split the string and convert to numbers
      return ([i, j]);
    });

    for (let i = 0; i < numberArr.length; ++i) {
      //if (numberArr[i][0] == numberArr[i][1]) console.log ("duplicates", numberArr[i][0], numberArr[i][1]);
      let question = generateQuestion(questionNo++, numberArr[i], slab);
      if (question) questions.push(question);
    }
  }
  return questions;
}

function generateQuestionPart0(numbers, slab, numberCodes, sign, answerCode) {
  let qstmt = `<p><span class='audio-enabled'>Compare numbers and fill boxes around the sign</span></p>`;
  return qstmt;
}

function generateQuestionPart1(numbers, slab, numberCodes, sign, answerCodes) {
  let qstmt = `<div class="display-grid">`;
  qstmt += `<div answer-code="${answerCodes[0]}" class="ca-blank"></div>`;
  qstmt += `${sign}`
  qstmt += `<div answer-code="${answerCodes[1]}" class="ca-blank"></div>`;
  qstmt += `</div>`;
  return qstmt;
}

function generateAnswerKeys1(numbers, slab, numberCodes, sign, answerCodes) {
  let answerKeys = [];
  let allowedAnswer1 = sign == '>' && numbers[0] > numbers[1] ? numberCodes [0] : numberCodes[1];
  let allowedAnswer2 = sign == '<' && numbers[0] > numbers[1] ? numberCodes [1] : numberCodes[0];

  let answerKey = {
    answerCodes: [answerCodes[0]],
    allowedAnswers: [[[allowedAnswer1]]],
  };
  answerKeys.push(answerKey);
  answerKey = {
    answerCodes: [answerCodes[1]],
    allowedAnswers: [[[allowedAnswer2]]],
  };
  answerKeys.push(answerKey);
  return answerKeys;
}

function generateAnswerKeys2(numbers, slab, numberCodes, sign, answerCode) {
  let answerKeys = [];
  let answerKey = {
    answerCodes: [numberCodes[0]],
    clickTimes: 1,
    content: `<span class='insert-content'>${util.addCommasToNumber (numbers[0])}</span>`,
  };
  answerKeys.push(answerKey);
  answerKey = {
    answerCodes: [numberCodes[1]],
    clickTimes: 1,
    content: `<span class='insert-content'>${util.addCommasToNumber (numbers[1])}</span>`,
  };
  answerKeys.push(answerKey);
  return answerKeys;
}

function generateAnswerExplanation(numbers, slab, numberCodes, sign, answerCodes) {
  let expln = ``;
  let highestNumberHandled = Math.max(numbers[0], numbers[1]);
  if (highestNumberHandled <= 9) {
    return compareByCounting(numbers, slab, numberCodes, sign, answerCodes);
  }
  if (highestNumberHandled <= 99) {
    return compareUsing100sChart(numbers, slab, numberCodes, sign, answerCodes);
  } else {
    return compareWithPlaceChart(numbers, slab, numberCodes, sign, answerCodes);
  }
}

function compareByCounting(numbers, slab, numberCodes, sign, answerCode) {
  let expln = ``;
  expln += `<p><span class="audio-enabled">Say the counting numbers from 1 to 10</span>.</p>`;
  expln += `<p>`;
  for (i = 1; i <= 10; ++i) {
    if (i == numbers[0] || i == numbers[1]) {
      expln += `<span class="em-answer"><span style="margin-right:15px">${i}</span></span>`;
    } else {
      expln += `<span style="margin-right:15px">${i}</span>`;
    }
  }
  if (numbers[0] < numbers[1]) {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes before ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is less than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class="em-answer">${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes after ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is greater than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class="em-answer">${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
  }
  return expln;
}

function compareUsing100sChart(numbers, slab, numberCodes, sign, answerCodes) {
  let expln = ``;
  expln += `<p><span class="audio-enabled">Consider the counting numbers 1 to 100</span>.</p>`;
  expln += util.numberChart(1, 100, 10, numbers, false, []);
  expln += `<br/>`;

  if (numbers[0] < numbers[1]) {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes before ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is less than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class="em-answer">${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes after ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is greater than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class="em-answer">${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
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

function compareWithPlaceChart(numbers, slab, numberCodes, sign, answerCodes) {
  let expln = ``;
  expln += `<p><span class="audio-enabled">To compare numbers, we follow the following rules</span>.</p>`;
  expln += `<div class="math-rule"><span class="audio-enabled">1. Compare the number of digits in the numbers. The number with more digits is greater</span>.</div>`;

  if (numbers[0].toString().length > numbers[1].toString().length) {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} has ${util.numberToHTML (numbers[0]).toString().length} digits</span>. ${
      util.numberToHTML (numbers[1])
    } has ${util.numberToHTML (numbers[1]).toString().length} digits</span>.</p>`;
    expln += `${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}`;
  } else if (numbers[0].toString().length < numbers[1].toString().length) {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} has ${numbers[0].toString().length} digits</span>. ${
      util.numberToHTML (numbers[1])
    } has ${numbers[1].toString().length} digits</span>.</p>`;
    expln += `${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}`;
  } else {
    expln += `<p><span class="audio-enabled">Both, ${util.numberToHTML (numbers[0])} and ${util.numberToHTML (numbers[1])} have ${
      numbers[0].toString().length
    } digits</span>.</p>`;
    expln += `<div class="math-rule"><span class="audio-enabled">2. If the number of digits is the same, start comparing digits from extreme left and move one digit right till you come across different digit.
    </span>.</div>`;

    expln += util.placeValueChart(numbers, "International", [findFirstDifferentDigitIdx(numbers)], (showHeader = false));
    expln += "<br/>";
    expln += `<p><span>Compare the digits. The number with the higher digit is greater</span></p>`
    if (numbers[0] < numbers[1]) {
      expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} is less than ${util.numberToHTML (numbers[1])}</span>.</p>`;
      expln += `<p><span class="audio-enabled">It is written as <span class="em-answer">${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
    } else {
      expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} is greater than ${util.numberToHTML (numbers[1])}</span>.</p>`;
      expln += `<p><span class="audio-enabled">It is written as <span class="em-answer">${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
    }
  }
  return expln;
}

// Generate a single question
function generateQuestion(questionNo, numbers, slab) {
  const answerCodes = Array.from({ length: 2 }, util.generateRandom4);
  const sign = Math.random () > 0.5 ? "<" : ">";
  const numberCodes = Array.from({ length: 2 }, util.generateRandom4);

  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    variation: (numbers[0] < numbers[1]) ? slab.variation + 0 : (numbers[0] == numbers[1]) ? slab.variation + 1 : slab.variation + 2,      
    rangeDesc: slab.rangeDesc,
    showAnimation: 0,
    questionType: "CLICK_TO_ADD",
    showAnimation: 0,
    exerciseCustomCSS: customCSS,
    exerciseDesc: exerciseDesc,
    activeDroppableClass: 'active-droppable',
    sourceDetail: fileNameWithoutExt,
    exerciseId: slab.exerciseId,
    highestNumberHandled: Math.max(...numbers),
    focusFirstInput: 1,
    parts: [
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart0(numbers, slab, numberCodes, sign, answerCodes),
        answerKeys: [],
      },
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart1(numbers, slab, numberCodes, sign, answerCodes),
        answerKeys: generateAnswerKeys1(numbers, slab, numberCodes, sign, answerCodes),
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 5,
        showClickTimes: 0,
        answerKeys: generateAnswerKeys2(numbers, slab, numberCodes, sign, answerCodes),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(numbers, slab, numberCodes, sign, answerCodes),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
