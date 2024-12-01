// Count to fill a grid
// How many more objects are needed to make 'x'? 
// How many more objects are needed to fill the grid?
// Show a random number of countable objects of the same kind in a grid with borders.
// The student must select the number of objects that are needed to fill the vacant cells
// 1 <= count <= 9

// Topic: Counting Numbers
// Learning goal: Count objects and understand the question

const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility");
const iconsFilePath = path.join(__dirname, "../icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

// Generate the table HTML for the question
function generateGrid(icon, count, countLimit, showCount = false) {
  let tableHTML = `<table class='embed-tbl-grid'><tr>`;

  let currentCount = 1;
  for (let i = 1; i <= countLimit; i++) {
    if (i <= count) {
      tableHTML += `<td><img src='/assets/count-objects/${icon.iconName}' width='60'/></td>`;
    } else {
      tableHTML += `<td class='counting-object-container' style='width:80px;height:80px'>`;
      if (showCount) {
        tableHTML += `<div class="counting-number">${currentCount++}</div>`;
      }
      tableHTML += `</td>`;
    }
    if (i % 5 === 0) {
      tableHTML += `</tr>`;
      if (i < countLimit) {
        tableHTML += `<tr>`;
      }
    }
  }
  tableHTML += "</tr></table>";
  return tableHTML;
}

function generateQuestionStatement(icon, count, countLimit) {
  let qstmt = ``;
  qstmt += `<p><span class='audio-enabled'>How many more ${icon.plural} are needed to make ${countLimit}?</span></p>`;
  qstmt += generateGrid(icon, count, countLimit);
  return qstmt;
}

function generateAnswerKeys(answerCodes, correctAnswer) {
  let answerKeys = [];
  for (let i = 1; i <= answerCodes.length; ++i) {
    let answerKey = {
      content: `${i}`,
      answerCodes: [answerCodes[i - 1]],
      allowedAnswers: [[[i === correctAnswer ? 1 : 0]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(icon, count, countLimit) {
  let expln = ``;
  expln += `<p><span class='audio-enabled'>Count the number of empty cells in the grid.</span></p>`;
  expln += generateGrid(icon, count, countLimit, true);
  expln += `<p><span class='audio-enabled'>${countLimit - count} <span style='font-weight:bold'>more</span> ${
    countLimit - count === 1 ? icon.singular : icon.plural
  } are needed to make ${countLimit}.</span></p>`;
  return expln;
}

function exerciseCustomCSS() {
  return `table.embed-tbl-grid td {border: 3px solid #b7e7fb; padding:10px}
  table.embed-tbl-grid {border: 3px solid #b7e7fb;}
  .counting-object-container {position: relative; }
  .counting-number {width: 30px; height: 30px; background-color: blue; border-radius: 50%; color: white; text-align: center; line-height: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
`; 
}

// Generate a single question
function generateQuestion(questionNo, icon, count, countLimit, topicId, exerciseId) {
  const answerCodes = Array.from({ length: 10 }, generateRandom4);
  const answerKeys = generateAnswerKeys(answerCodes, countLimit - count);
  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: exerciseCustomCSS(),
    focusFirstInput: 1,
    exerciseId: exerciseId,
    topicId: topicId,
    highestNumberHandled: countLimit,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(icon, count, countLimit),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [],
      },
      {
        autoContent: 1,
        content: "",
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        optionsContainer: "GRID",
        optionsDirection: "",
        answerKeysPerRow: 5,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        hideOptionInExplanation: 1,
        shuffleAnswerOptions: 1,
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(icon, count, countLimit)
  };
}

function generateQuestions() {
  const questions = [];
  let questionNo = 1;

  for (let count = 9; count >= 1; count--) {
    for (let iconIdx = 0; iconIdx < imageObjects.length; iconIdx++) {
      const icon = imageObjects[iconIdx];
      const topicId = 0;
      const exerciseId = 0;
      const countLimit = 10;
      questions.push(generateQuestion(questionNo++, icon, count, countLimit, topicId, exerciseId));
    }
  }

  return questions;
}

const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);

