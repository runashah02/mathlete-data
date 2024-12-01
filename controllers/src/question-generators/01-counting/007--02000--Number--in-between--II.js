// Number - in between. Select number on grid
// Which number comes just in between x - 1 and x + 1? Select number on the number grid
// This program generates questions asking "which number comes just between a and a + 2?"
// Topic: Counting Numbers
// Learning goal: Learn the order of counting numbers

const fs = require("fs");
const path = require("path");
const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");

function generateQuestionStatement(a, countLimit, answerCodes) {
  let qstmt = `<p><span class='audio-enabled'>`;
  qstmt += `Which number comes between ${a} and ${a + 2}?`;
  qstmt += `</span></p>`;
  qstmt += numberGrid(countLimit, [], 0, answerCodes);
  return qstmt;
}

function numberGrid(gridMaxNum, highlight, answer, answerCodes) {
  let content = `<table class='tbl number-grid'>`;
  let currentCount = 1;
  for (let row = 0; row < Math.ceil(gridMaxNum / 10); row++) {
    content += "<tr>";
    for (let col = 0; col < 10 && currentCount <= gridMaxNum; col++) {
      content += `<td class='answer-option clickable' answer-code='${answerCodes[currentCount - 1]}'>`;
      if (highlight.includes(currentCount)) {
        content += `<span style='font-weight:bold;'>${currentCount}</span>`;
      } else if (currentCount === answer) {
        content += `<span style='font-weight:bold;color:orange'>${currentCount}</span>`;
      } else {
        content += currentCount;
      }
      content += `</td>`;
      currentCount++;
    }
    content += "</tr>";
  }
  content += `</table>`;
  return content;
}

function generateAnswerExplanation(a, countLimit) {
  let expln = `<p><span class='audio-enabled'>The following table shows the counting numbers from 1 to ${countLimit}</span></p>`;
  expln += numberGrid(countLimit, [a, a + 2], a + 1, Array.from({ length: countLimit }, (_, i) => i + 1));
  expln += `<p>${a + 1} comes between ${a} and ${a + 2}</p>`;
  return expln;
}

function exerciseCustomCSS() {
  return `
    .number-grid {border: 2px solid #b7e7fb; width: auto;}
    .number-grid td {border: 2px solid #b7e7fb; padding: 10px;}   
    .clickable {cursor: pointer; transition: background-color 0.3s, border-color 0.3s; background-color: #ffffff; text-align: center;} 
    .clickable:hover {background-color: #b7e7fb;} 
    .clickable.selected {background-color: #b7e7fb;} tbl {border-collapse:collapse;}     
  `;
}

function generateAnswerKeys(answerCodes, correctAnswer) {
  let answerKeys = [];
  for (let i = 1; i <= answerCodes.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i - 1]],
      allowedAnswers: [[[correctAnswer === i ? 1 : 0]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateQuestion(questionNo, count, countLimit, topicId, exerciseId) {
  const answerCodes = Array.from({ length: countLimit }, generateRandom4);
  const answer = count + 1;
  const answerKeys = generateAnswerKeys(answerCodes, answer);
  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: exerciseCustomCSS(),
    questionCustomCSS: null,
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
        content: generateQuestionStatement(count, countLimit, answerCodes),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(count, countLimit),
  };
}

function generateQuestions() {
  const questions = [];
  let questionNo = 1;

  for (let count = 1; count <= 98; count++) {
    const topicId = 0;
    const exerciseId = 0;
    const countLimit = 100;
    questions.push(generateQuestion(questionNo++, count, countLimit, topicId, exerciseId));
  }

  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);
