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

const iconsFilePath = path.join(__dirname, "../cute-icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));
const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, exerciseId: 0, count: -1},
  { min: 1, max: 5, exerciseId: 0, count: -1},
  { min: 1, max: 9, exerciseId: 0, count: -1},
  { min: 10, max: 20, exerciseId: 0, count: -1},
  { min: 21, max: 50, exerciseId: 0, count: 0},
  { min: 51, max: 99, exerciseId: 0, count: 0},
  { min: 100, max: 999, exerciseId: 0, count: 0},
  { min: 1000, max: 9999, exerciseId: 0, count: 0},
  { min: 10000, max: 99999, exerciseId: 0, count: 0},
  { min: 100000, max: 999999, exerciseId: 0, count: 0},
  { min: 1000000, max: 9999999, exerciseId: 0, count: 0},
  { min: 10000000, max: 99999999, exerciseId: 0, count: 0},
  { min: 100000000, max: 99999999, exerciseId: 0, count: 0},
];

let customCSS = `
   table.tbl-blue-grid td {border: 3px solid #b7e7fb; padding:10px}
   table.tbl-blue-grid {border: 3px solid #b7e7fb;}
  .counting-object-container {position: relative; }
  .counting-object-image-60 {width: 60px; margin:0px 0px;}
  .counting-number {width: 30px; height: 30px; background-color: blue; border-radius: 50%; color: white; text-align: center; line-height: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
  .fitted-div {width:100%;height:100%;display:block;text-align:center}
  .image-overlay {opacity: 0.5;}
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 1;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    let numberIconPairs = []; // Array to hold number, icon combinations

    if (slab.count == 0) continue;

    // Single condition to handle both cases
    if (slab.count < 0) {
      // All numbers with all icons
      Array.from({ length: slab.max - slab.min + 1 }, (_, i) => slab.min + i).forEach((number) => {
        imageObjects.forEach((icon) => {
          numberIconPairs.push([number, icon]);
        });
      });
    } else {
      // Random numbers with one random icon
      util.generateUniqueNumbers([], slab.count, slab.min, slab.max).forEach((number) => {
        const randomIcon = imageObjects[Math.floor(Math.random() * imageObjects.length)];
        numberIconPairs.push([number, randomIcon]);
      });
    }

    // Generate questions from combinations
    numberIconPairs.forEach(([number, icon]) => {
      let question = generateQuestion(questionNo++, icon, number, slab);
      if (question) questions.push(question);
    });
  }

  return questions;
}

// Generate the table HTML for the question
function generateGrid(icon, count, answerCodes, showCount) {
  let tableHTML = `<table class="tbl-blue-grid"><tr>`;
  for (let i = 0; i < answerCodes.length; i++) {
    tableHTML += `<td style='width:90px;height:90px'>`;
    tableHTML += `<div answer-code="${answerCodes[i]}" class="fitted-div counting-object-container">`;
    if (showCount && i < count) {
      tableHTML += `<span class='insert-content'>
            <img src='/assets/count-objects/${icon.iconName}' class='counting-object-image-60 image-overlay' style='display:inline'/></span>`;
      tableHTML += `<div class="counting-number">${i + 1}</div>`;
    }
    tableHTML += `</div>`;
    tableHTML += `</td>`;
    if ((i + 1) % 5 === 0 && i < answerCodes.length - 1) {
      tableHTML += `</tr><tr>`;
    }
  }
  tableHTML += "</tr></table>";
  return tableHTML;
}

function generateQuestionPart0(icon, number, slab) {
  let qstmt = `<p><span class='audio-enabled'>Put ${util.numberToHTML (number)} ${
    number === 1 ? icon.singular : icon.plural
  } on the grid.</span></p>`;
  return qstmt;
}

function generateQuestionPart1 (icon, number, slab, answerCodes) {
  return generateGrid(icon, number, answerCodes, false);
}

function generateAnswerKeys0(answerCodes, icon, number, iconCode, slab) {
  let answerKeys = [];
  for (let i = 0; i < answerCodes.length; i++) {
    let answerKey = {
      answerCodes: [answerCodes[i]],
      allowedAnswers: [[i < number ? [iconCode] : [""]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(icon, number, answerCodes) {
  let expln = `<p><span class='audio-enabled'>Click the button ${util.numberToHTML (number)} ${
    number === 1 ? "time" : "times"
  } to add ${util.numberToHTML (number)} ${number === 1 ? icon.singular : icon.plural}.</span></p>`;
  expln += generateGrid(icon, number, answerCodes, true);
  expln += `<p><span class='audio-enabled'>Click the erase button if you put more ${icon.plural} than required.</span></p>`;
  return expln;
}

function generateAnswerKeys1(iconCode, icon, number, slab) {
  let answerKeys = [];
  let answerKey = {
    answerCodes: [iconCode],
    clickTimes: 1,
    content: `<span class='insert-content'>
    <img src='/assets/count-objects/${icon.iconName}' class='counting-object-image-60' style='display:inline'/></span>`,
  };
  answerKeys.push(answerKey);
  if (number >= 5) {
    answerKey = {
      answerCodes: [iconCode],
      clickTimes: 5,
      content: `<span class='insert-content'>
      <img src='/assets/count-objects/${icon.iconName}' class='counting-object-image-60' style='display:inline'/></span>`,
    };
    answerKeys.push(answerKey);
  }

  return answerKeys;
}

// Generate a single question
function generateQuestion(questionNo, icon, number, slab) {
  const iconCode = util.generateRandom4();
  
  const gridCells = number <= 10 ? 10 : 20;
  const answerCodes = Array.from({ length: gridCells }, util.generateRandom4);


  return {
    questionNo: questionNo,
    questionType: "CLICK_TO_ADD",
    showAnimation: 1,
    exerciseCustomCSS: customCSS,
    sourceDetail: fileNameWithoutExt,
    exerciseId: slab.exerciseId,
    highestNumberHandled: slab.max,
    adjustOptionsWidth: 1,
    parts: [
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart0(icon, number, slab),
        answerKeys: []
      },
      {
        autoContent: 0,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        content: generateQuestionPart1 (icon, number, slab, answerCodes),
        answerKeys: generateAnswerKeys0 (answerCodes, icon, number, iconCode, slab),
      },
      {
        autoContent: 1,
        requiredRepeats: 1,
        maxPossibleRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 3,
        showClickTimes: 1,
        showDeleteButton: 1,
        answerKeys: generateAnswerKeys1 (iconCode, icon, number, slab),
      },
    ],
    answerExplanation: generateAnswerExplanation(icon, number, answerCodes),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, fileNameWithoutExt);
