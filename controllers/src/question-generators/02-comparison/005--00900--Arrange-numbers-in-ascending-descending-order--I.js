const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { rangeDesc: "1-3", variation: 1, min1: 1, max1: 3, count: 0 },
  { rangeDesc: "1-5", variation: 1, min1: 1, max1: 5, count: 10 },
  { rangeDesc: "1-9", variation: 1, min1: 1, max1: 9, count: 10 },
  { rangeDesc: "10-20", variation: 1, min1: 10, max1: 20, count: 10 },
  { rangeDesc: "21-50", variation: 1, min1: 21, max1: 50, count: 50 },
  { rangeDesc: "51-99", variation: 1, min1: 51, max1: 99, count: 50 },
  { rangeDesc: "3-digits", variation: 1, min1: 10, max1: 999, count: 50 },
  { rangeDesc: "3-digits", variation: 3, min1: 100, max1: 999, count: 300 },
  { rangeDesc: "4-digits", variation: 1, min1: 100, max1: 9999, count: 50 },
  { rangeDesc: "4-digits", variation: 3, min1: 1000, max1: 9999, count: 0 },
  { rangeDesc: "5-digits", variation: 1, min1: 1000, max1: 99999, count: 0 },
  { rangeDesc: "5-digits", variation: 3, min1: 10000, max1: 99999, count: 0 },
  { rangeDesc: "6-digits", variation: 1, min1: 10000, max1: 999999, count: 0 },
  { rangeDesc: "6-digits", variation: 3, min1: 100000, max1: 999999, count: 0 },
  { rangeDesc: "7-digits", variation: 1, min1: 100000, max1: 9999999, count: 0 },
  { rangeDesc: "7-digits", variation: 3, min1: 1000000, max1: 9999999, count: 0 },
  { rangeDesc: "8-digits", variation: 1, min1: 1000000, max1: 99999999, count: 0 },
  { rangeDesc: "8-digits", variation: 3, min1: 10000000, max1: 99999999, count: 0 },
  { rangeDesc: "9-digits", variation: 1, min1: 10000000, max1: 999999999, count: 0 },
  { rangeDesc: "9-digits", variation: 3, min1: 100000000, max1: 999999999, count: 0 },
];

let customCSS = `
.math-rule {padding-top:10px;padding-bottom:10px; font-weight:400}
.place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
.place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px;}
.number-grid {border: 2px solid #b7e7fb; width: auto;}
.number-grid td {border: 2px solid #b7e7fb; padding: 10px;} 
.em-answer {font-weight:bold} 
`;

let exerciseDesc = `
Arrange the following numbers in ascending/descending order
Drag and drop 4 unique confusing numbers given as options so that they are in ascending/descending order.

This exercise generates 2 variations: ascending, descending
All solutions have the same number of steps. Twistiness is always 0.
`;
function generateQuestions() {
  let questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numbersSet = new Set();
    if (slab.count == 0) continue;

    let retries = 0;
    while (numbersSet.size < slab.count) {
      let i = util.getRandomNumber(slab.min1, slab.max1);
      let j = util.generateConfusingNumbers([i], 4, slab.min1, slab.max1);
      numbersSet.add(`${j[0]},${j[1]},${j[2]},${j[3]}`);
      retries++;
      if (retries > 2 * slab.count) break;
    }

    let numberArr = Array.from(numbersSet).map((item) => {
      const [i, j, k, l] = item.split(",").map(Number); // Split the string and convert to numbers
      return [i, j, k, l];
    });

    for (let i = 0; i < numberArr.length; ++i) {
      //if (numberArr[i][0] == numberArr[i][1]) console.log ("duplicates", numberArr[i][0], numberArr[i][1]);
      let question = generateQuestion(questionNo++, numberArr[i], slab);
      if (question) questions.push(question);
    }
  }
  return questions;
}

function generateQuestionPart0(numbers, questionType, numberCodes, slab, answerCodes) {
  let qstmt = `<p><span class='audio-enabled'>Rearrange the following numbers in ${questionType} order</span></p>`;
  return qstmt;
}

function sortNumbersAndCodes(numbers, numberCodes, questionType) {
  // Combine numbers and numberCodes into a single array of objects
  const combined = numbers.map((num, index) => ({
    number: num,
    code: numberCodes[index],
  }));

  // Sort the combined array based on questionType
  combined.sort((a, b) => {
    if (questionType === "ascending") {
      return a.number - b.number; // Ascending order
    } else if (questionType === "descending") {
      return b.number - a.number; // Descending order
    }
  });

  // Separate the sorted numbers and codes back into their arrays
  const sortedNumbers = combined.map((item) => item.number);
  const sortedCodes = combined.map((item) => item.code);

  return { sortedNumbers, sortedCodes };
}

function generateAnswerKeys1(numbers, questionType, numberCodes, slab, answerCodes) {
  let answerKeys = [];
  let { sortedNumbers, sortedCodes } = sortNumbersAndCodes(numbers, numberCodes, questionType);
  for (let i = 0; i < numbers.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i]],
      allowedAnswers: [[[sortedCodes[i]]]],
      initialAnswers: [[[numberCodes[i]]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerKeys2(numbers, questionType, numberCodes, slab, answerCodes) {
  let answerKeys = [];
  for (let i = 0; i < numbers.length; ++i) {
    let answerKey = {
      answerCodes: [numberCodes[i]],
      content: `<div style='padding:10px 40px'>${util.addCommasToNumber (numbers[i])}</div>`
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(numbers, questionType, numberCodes, slab, answerCodes) {
  let expln = ``;
  let highestNumberHandled = Math.max(...numbers);
  if (highestNumberHandled <= 9) {
    return compareByCounting(numbers, questionType, slab, answerCodes);
  }
  if (highestNumberHandled <= 99) {
    return compareUsing100sChart(numbers, questionType, slab, answerCodes);
  } else {
    return compareWithPlaceChart(numbers, questionType, slab, answerCodes);
  }
}

function compareByCounting(numbers, questionType, numberCodes, slab, answerCodes) {
  let { sortedNumbers, sortedCodes } = sortNumbersAndCodes(numbers, numberCodes, questionType);
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
  if (questionType == "ascending") {
    expln += `<p><span class="audio-enabled">Ascending order means from smallest to largest</span>.</p>`;
    expln += `<p><span class="audio-enabled">The smallest number is the one that comes first when counting. The largest number is one that comes last when counting</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, the numbers in ascending order are ${sortedNumbers.join(
      ", "
    )}</span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">Descending order means from largest to smallest</span>.</p>`;
    expln += `<p><span class="audio-enabled">The largest number is the one that comes last when counting. The smallest number is one that comes first when counting</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, the numbers in descending order are ${sortedNumbers.join(
      ", "
    )}</span>.</p>`;
  }
  return expln;
}

function compareUsing100sChart(numbers, questionType, numberCodes, slab, answerCodes) {
  let { sortedNumbers, sortedCodes } = sortNumbersAndCodes(numbers, numberCodes, questionType);
  let expln = ``;
  expln += `<p><span class="audio-enabled">Consider the counting numbers 1 to 100</span>.</p>`;
  expln += util.numberChart(1, 100, 10, numbers, false, []);
  expln += `<br/>`;

  if (questionType == "ascending") {
    expln += `<p><span class="audio-enabled">Ascending order means from smallest to largest</span>.</p>`;
    expln += `<p><span class="audio-enabled">The smallest number is the one that comes first when counting. The largest number is one that comes last when counting</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, the numbers in ascending order are ${sortedNumbers.join(
      ", "
    )}</span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">Descending order means from largest to smallest</span>.</p>`;
    expln += `<p><span class="audio-enabled">The largest number is the one that comes last when counting. The smallest number is one that comes first when counting</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, the numbers in descending order are ${sortedNumbers.join(
      ", "
    )}</span>.</p>`;
  }
  return expln;
}

function compareWithPlaceChart(numbers, questionType, numberCodes, slab, answerCodes) {
  let expln = ``;
  let { sortedNumbers, sortedCodes } = sortNumbersAndCodes(numbers, numberCodes, questionType);

  expln += `<p><span class="audio-enabled">To compare numbers, we follow these rules</span>.</p>`;
  expln += `<div class="math-rule"><span class="audio-enabled">1. Compare the number of digits in the numbers.
  The number with fewer digits is smaller than the number with more digits.</span></div>`;
  expln += `<div class="math-rule"><span class="audio-enabled">2. If the number of digits is the same, start comparing digits from extreme left and move one digit right till you come across different digit.
    </span>.</div>`;
  if (questionType == "ascending") {
    expln += `<p><span class="audio-enabled">Ascending order means from smallest to largest</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, the numbers in ascending order are ${sortedNumbers.join(
      ", "
    )}</span>.</p>`;
  } else {
    expln += `<p><span class="audio-enabled">Descending order means from largest to smallest</span>.</p>`;
    expln += `<p><span class="audio-enabled">So, the numbers in descending order are ${sortedNumbers.join(
      ", "
    )}</span>.</p>`;
  }

  return expln;
}

// Generate a single question
function generateQuestion(questionNo, numbers, slab) {
  let questionType = Math.random() < 0.5 ? "ascending" : "descending";
  let numberCodes = Array.from({ length: 4 }, util.generateRandom4);
  const answerCodes = Array.from({ length: 4 }, util.generateRandom4);
  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    variation: slab.variation, 
    questionType: "ORDER_REARRANGEMENT",
    exerciseCustomCSS: customCSS,
    sourceDetail: fileNameWithoutExt,
    exerciseDesc: exerciseDesc,
    highestNumberHandled: Math.max(...numbers),
    parts: [
      {
        autoContent: 0,
        requiredRepeats: 1,
        max1PossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart0(numbers, questionType, numberCodes, slab, answerCodes),
        answerKeys: [],
        hideInQuestion: 0,
        hideInCorrectAnswers: 1,
        hideInStudentAnswers: 1
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        max1PossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 4,        
        content: "",
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,        
        answerKeys: generateAnswerKeys1(numbers, questionType, numberCodes, slab, answerCodes),
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        max1PossibleRepeats: 1,
        displayRepeatCount: 0,
        content: "",
        hideInQuestion: 1,
        hideInCorrectAnswers: 1,
        hideInStudentAnswers: 1,        
        answerKeys: generateAnswerKeys2(numbers, questionType, numberCodes, slab, answerCodes)        
      }
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(numbers, questionType, numberCodes, slab, answerCodes),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
