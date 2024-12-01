// Put 'x' objects on the grid.
// Click the given button to add 'y' objects to the grid with evey single click.
// Click until there are 'x' objects on the grid
// y = 1 and 1 <= x <= 20: Topic Id - 1, 2, 3, 7
// For numbers >= 5, give a 5y button

// Topic: Counting Numbers
// Learning goal: Count and understand the question

const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { rangeDesc: "1-3", variation: 1, min1: 1, max1: 3, min2: 1, max2: 3, count: -1 },
  { rangeDesc: "1-5", variation: 1, min1: 1, max1: 5, min2: 1, max2: 5, count: -1 },
  { rangeDesc: "1-9", variation: 1, min1: 1, max1: 9, min2: 1, max2: 9, count: -1 },
  { rangeDesc: "upto 20", variation: 1, min1: 1, max1: 9, min2: 10, max2: 20, count: -1 },
  { rangeDesc: "upto 20", variation: 4, min1: 10, max1: 20, min2: 10, max2: 20, count: -1 },
  { rangeDesc: "upto 50", variation: 1, min1: 1, max1: 9, min2: 21, max2: 50, count: -1 },
  { rangeDesc: "upto 50", variation: 4, min1: 10, max1: 50, min2: 21, max2: 50, count: 300 },
  { rangeDesc: "upto 99", variation: 1, min1: 1, max1: 9, min2: 51, max2: 99, count: 300 },
  { rangeDesc: "upto 99", variation: 4, min1: 10, max1: 99, min2: 51, max2: 99, count: 300 },
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
.ca-blank {width:50px;height:50px;line-height:50px;vertical-align:middle;text-align:center;border:1px solid black;border-radius:50%;}

`;

let exerciseDesc = `
Insert the >, < or = sign between the given pair of numbers - A ___ B
3 options are given <, =, >
To solve, select the correct sign to make the statement A ___ B true

This exercise generates 3 variations: 1. <,  2. =, 3. > 
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
        if (Math.random () < 0.2) {
            numbersSet.add(`${i},${i}`);
        }
        else {
            let j = util.generateConfusingNumbers([i], 2, slab.min1, slab.max1);
            numbersSet.add(`${j[0]},${j[1]}`);
        }
        retries ++;
        if (retries > 2 * slab.count) break;
      }
    }

    let numberArr = Array.from(numbersSet).map((item) => {
      const [i, j] = item.split(",").map(Number); // Split the string and convert to numbers
      return ([i, j]);
    });

    for (let i = 0; i < numberArr.length; ++i) {
      let question = generateQuestion(questionNo++, numberArr[i], slab);
      if (question) questions.push(question);
    }
  }
  return questions;
}

function generateQuestionPart0(numbers, slab, signCodes, answerCode) {
  let qstmt = `<p><span class='audio-enabled'>Insert the >, < or = sign between the given pair of numbers</span></p>`;
  return qstmt;
}

function generateQuestionPart1(numbers, slab, signCodes, answerCode) {
  // if (numbers[0] == numbers[1]) console.log ("duplicates");
  let qstmt = `<div class="display-grid">`;
  qstmt += `${util.numberToHTML(numbers[0])}</span>`;
  qstmt += `<div answer-code="${answerCode}" class="ca-blank"></div>`;
  qstmt += `${util.numberToHTML(numbers[1])}`;
  qstmt += `</div>`;
  return qstmt;
}

function generateAnswerKeys1(numbers, slab, signCodes, answerCode) {
  let answerKeys = [];
  let allowedAnswer = numbers[0] < numbers[1] ? signCodes[0] : numbers[0] == numbers[1] ? signCodes[1] : signCodes[2];
  let answerKey = {
    answerCodes: [answerCode],
    allowedAnswers: [[[allowedAnswer]]],
  };
  answerKeys.push(answerKey);
  return answerKeys;
}

function generateAnswerKeys2(numbers, slab, signCodes, answerCode) {
  let answerKeys = [];
  let answerKey = {
    answerCodes: [signCodes[0]],
    clickTimes: 1,
    content: `<span class='insert-content'><</span>`,
  };
  answerKeys.push(answerKey);
  answerKey = {
    answerCodes: [signCodes[1]],
    clickTimes: 1,
    content: `<span class='insert-content'>=</span>`,
  };
  answerKeys.push(answerKey);
  answerKey = {
    answerCodes: [signCodes[2]],
    clickTimes: 1,
    content: `<span class='insert-content'>></span>`,
  };
  answerKeys.push(answerKey);
  return answerKeys;
}

function generateAnswerExplanation(numbers, slab, signCodes, answerCode) {
  let expln = ``;
  if (numbers[0] == numbers[1]) {
    expln += `<p><span class="audio-enabled">Observe both the numbers carefully</span>.</p>`;
    expln += `<p><span class="audio-enabled">The two numbers are equal</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class='em-answer'>${util.numberToHTML (numbers[0])} = ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
    return expln;
  }

  let highestNumberHandled = Math.max(numbers[0], numbers[1]);
  if (highestNumberHandled <= 9) {
    return compareByCounting(numbers, slab, signCodes, answerCode);
  }
  if (highestNumberHandled <= 99) {
    return compareUsing100sChart(numbers, slab, signCodes, answerCode);
  } else {
    return compareWithPlaceChart(numbers, slab, signCodes, answerCode);
  }
}

function compareByCounting(numbers, slab, signCodes, answerCode) {
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
    expln += `<p><span class="audio-enabled">It is written as <span class='em-answer'>${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes after ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is greater than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class='em-answer'>${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
  }
  return expln;
}

function compareUsing100sChart(numbers, slab, signCodes, answerCode) {
  let expln = ``;
  expln += `<p><span class="audio-enabled">Consider the counting numbers 1 to 100</span>.</p>`;
  expln += util.numberChart(1, 100, 10, numbers, false, []);
  expln += `<br/>`;

  if (numbers[0] < numbers[1]) {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes before ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is less than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class='em-answer'>${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} comes after ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, ${util.numberToHTML (numbers[0])} is greater than ${util.numberToHTML (numbers[1])}</span>.</p>`;
    expln += `<p><span class="audio-enabled">It is written as <span class='em-answer'>${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}</span></span>.</p>`;
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

function compareWithPlaceChart(numbers, slab, signCodes, answerCode) {
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
      expln += `<p><span class="audio-enabled">It is written as ${util.numberToHTML (numbers[0])} < ${util.numberToHTML (numbers[1])}</span>.</p>`;
    } else {
      expln += `<p><span class="audio-enabled">${util.numberToHTML (numbers[0])} is greater than ${util.numberToHTML (numbers[1])}</span>.</p>`;
      expln += `<p><span class="audio-enabled">It is written as ${util.numberToHTML (numbers[0])} > ${util.numberToHTML (numbers[1])}</span>.</p>`;
    }
  }
  return expln;
}

// Generate a single question
function generateQuestion(questionNo, numbers, slab) {
  const answerCode = util.generateRandom4();
  const signCodes = Array.from({ length: 3 }, util.generateRandom4);

  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: (numbers[0] < numbers[1]) ? slab.variation + 0 : (numbers[0] == numbers[1]) ? slab.variation + 1 : slab.variation + 2,      
    showAnimation: 0,
    questionType: "CLICK_TO_ADD",
    showAnimation: 0,
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
        content: generateQuestionPart0(numbers, slab, signCodes, answerCode),
        answerKeys: [],
      },
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart1(numbers, slab, signCodes, answerCode),
        answerKeys: generateAnswerKeys1(numbers, slab, signCodes, answerCode),
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 5,
        showClickTimes: 0,
        answerKeys: generateAnswerKeys2(numbers, slab, signCodes, answerCode),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(numbers, slab, signCodes, answerCode),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
