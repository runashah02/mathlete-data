const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { rangeDesc: "1-5", variation: 1, min: 1, max: 5, count: 3 },
  { rangeDesc: "1-9", variation: 1, min: 1, max: 9, count: 10 },
  { rangeDesc: "10-20", variation: 1, min: 10, max: 20, count: 10 },
  { rangeDesc: "21-50", variation: 1, min: 21, max: 50, count: 50 },
  { rangeDesc: "51-99", variation: 1, min: 51, max: 99, count: 50 },
  { rangeDesc: "3-digits", variation: 1, min: 10, max: 999, count: 50 },
  { rangeDesc: "3-digits", variation: 3, min: 100, max: 999, count: 300 },
  { rangeDesc: "4-digits", variation: 1, min: 100, max: 9999, count: 50 },
];


let exerciseDesc = `
Arrange the following numbers in ascending/descending order
4 unique confusing numbers given.
Fill in the blanks so that the numbers are in correct ascending/descending order

This exercise generates 2 variations: ascending, descending
All solutions have the same number of steps. Twistiness is always 0.
`;


let customCSS = `
.math-rule {padding-top:10px;padding-bottom:10px; font-weight:400}
.place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
.place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px;}
.number-grid {border: 2px solid #b7e7fb; width: auto;}
.number-grid td {border: 2px solid #b7e7fb; padding: 10px;} 
.em-answer {font-weight:bold} 
.number-box {display:grid; gap:40px; grid-template-columns: repeat(4, auto); border: 2px solid #b7e7fb; background-color: #f0fafe; border-radius:4px; padding:5px 10px}
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
      let j = util.generateConfusingNumbers([i], 4, slab.min, slab.max);
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

function generateQuestionPart0(numbers, questionType,slab, answerCodes) {
  let qstmt = `<p><span class='audio-enabled'>Rearrange the following numbers in ${questionType} order</span></p>`;
  return qstmt;
}

function generateQuestionPart1(numbers, questionType, slab, answerCodes) {
    let qstmt = ``;
    qstmt += `<div class="number-box mb-8">`;
    for (let i = 0; i < numbers.length; ++i){
        qstmt += `<span class="number">${util.numberToHTML (numbers[i])}</span>`
    }
    qstmt += `</div>`
    return qstmt;
  }

  function sortNumbers(numbers, questionType) {
    // Sort the numbers array based on questionType
    numbers.sort((a, b) => {
      if (questionType === "ascending") {
        return a - b; // Ascending order
      } else if (questionType === "descending") {
        return b - a; // Descending order
      }
    });
  
    return numbers; // Return the sorted numbers array
  }

function generateAnswerKeys2(numbers, questionType, slab, answerCodes) {
  let answerKeys = [];
  let sortedNumbers = sortNumbers(numbers, questionType);
  for (let i = 0; i < numbers.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i]],
      allowedAnswers: [[[util.addCommasToNumber (sortedNumbers[i])]]],
      ignoreCommas: 1
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(numbers, questionType, slab, answerCodes) {
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

function compareByCounting(numbers, questionType, slab, answerCodes) {
  let sortedNumbers = sortNumbers(numbers, questionType);
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

function compareUsing100sChart(numbers, questionType, slab, answerCodes) {
  let sortedNumbers = sortNumbers(numbers, questionType);
  let expln = ``;
  expln += `<p><span class="audio-enabled">Consider the counting numbers 1 to 100</span>.</p>`;
  util.numberChart(1, 100, 10, numbers, false, []);
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

function compareWithPlaceChart(numbers, questionType, slab, answerCodes) {
  let expln = ``;
  let sortedNumbers = sortNumbers(numbers, questionType);

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
  const answerCodes = Array.from({ length: numbers.length }, util.generateRandom4);
  return {
    questionNo: questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    variation: slab.variation,     
    questionType: "FILL_IN_THE_BLANKS",
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
        hideInQuestion: 0,
        hideInCorrectAnswers: 1,
        hideInStudentAnswers: 1
      },
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart1(numbers, questionType, slab, answerCodes),
        answerKeys: [],
        hideInQuestion: 0,
        hideInCorrectAnswers: 1,
        hideInStudentAnswers: 1
      },      
      {
        autoContent: 1,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 4,        
        content: "",
        answerKeys: generateAnswerKeys2(numbers, questionType, slab, answerCodes),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(numbers, questionType, slab, answerCodes),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
