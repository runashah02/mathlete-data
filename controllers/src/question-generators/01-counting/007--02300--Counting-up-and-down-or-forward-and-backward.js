// Counting up and down, or, forward and backward
// Counting up/down/forward/backward what comes next? Filll the next 4 blanks with correct values
// This program generates two types of counting questions:
// 1. Counting Up: Given a starting number, students are asked to fill in the next 5 numbers in ascending order.
//    - Range: Starting number 1 <= count <= 94
// 2. Counting Down: Given a starting number, students are asked to fill in the next 5 numbers in descending order.
//    - Range: Starting number 6 <= count <= 99
//
// The student must complete the sequence by filling in blanks with the correct numbers.
// Topic: Counting Numbers
// Learning goal: Understand and practice number sequences through counting up and down.
//
// For each question:
// - A starting number and direction (up or down) are specified.
// - An explanation is provided, showing the correct sequence for reference.
//
// The program saves the questions as a JSON file, structured for integration with educational platforms.
const fs = require("fs");
const path = require("path");
const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");

function generateQuestionStatement(count, direction, answerCodes) {
  let qstmt = ``;
  qstmt += `<p>Counting ${direction} from ${count}, what comes next?</p>`;
  qstmt += `<div style='display:flex;align-items:center;white-space:nowrap'>`;
  qstmt += `${count}`;

  answerCodes.forEach((code) => {
    qstmt += `<input input-type='INPUT' answer-code='${code}' size='4' class='form-control' style='margin-left:10px; margin-right:10px;' />`;
  });
  qstmt += `</div>`;
  return qstmt;
}

function generateAnswerExplanation(count, direction, answers) {
  let expln = `<p><span class='audio-enabled'>Counting <span style="font-weight:bold">${direction}</span> from ${count}, the next numbers are ${answers.join(
    ", "
  )}</span></p>`;
  return expln;
}

function exerciseCustomCSS() {
  return `
    .number-grid {border: 2px solid #b7e7fb; width: auto;}
    .number-grid td {border: 2px solid #b7e7fb; padding: 10px;}   
  `;
}

function generateQuestion(questionNo, count, direction, countLimit, topicId, exerciseId) {
  const answerCodes = Array.from({ length: 5 }, generateRandom4);
  const answers =
    direction === "up"
      ? Array.from({ length: 5 }, (_, i) => count + i + 1)
      : Array.from({ length: 5 }, (_, i) => count - i - 1);

  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
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
    adjustOptionsWidth: 1,
    parts: [
      {
        autoContent: 0,
        content: generateQuestionStatement(count, direction, answerCodes),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: answerCodes.map((code, i) => ({
          answerCodes: [code],
          allowedAnswers: [[[answers[i]]]],
        })),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(count, direction, answers),
  };
}

function generateQuestions() {
  const questions = [];
  let questionNo = 1;

  const topicId = 0;
  const exerciseId = 0;
  const countLimit = 100;

  // Generate questions for counting up
  for (let count = 1; count <= 94; count++) {
    questions.push(generateQuestion(questionNo++, count, "up", countLimit, topicId, exerciseId));
  }

  // Generate questions for counting down
  for (let count = 6; count <= 99; count++) {
    questions.push(generateQuestion(questionNo++, count, "down", countLimit, topicId, exerciseId));
  }

  return questions;
}

// Generate questions and save to a JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);

