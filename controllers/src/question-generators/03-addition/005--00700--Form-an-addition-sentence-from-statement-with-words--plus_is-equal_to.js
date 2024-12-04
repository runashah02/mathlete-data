// Write this as an addition sentence using + and = : A and B makes C
// The student must provide the addition sentence in the blank

// To be asked for Addition of numbers (sums upto 5, 10 and 18)
// Learning goal: Understand the concept of A + B = C using numbers

const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

function generateQuestions() {
  const questions = [];
  let questionNo = 0;

  for (let num1 = 1; num1 <= 9; num1++) {
    for (let num2 = 1; num2 <= 9; num2++) {
      sum = num1 + num2;
      let topicId = sum <= 5 ? 452 : sum <= 10 ? 25 : 26;
      let exerciseId = sum <= 5 ? 2 : sum <= 10 ? 3 : 4;

      const question = createQuestion(questionNo, [num1, num2], topicId, exerciseId);
      questions.push(question);
      questionNo = questionNo + 1;
    }
  }

  return questions;
}

function generateQuestionStatement(numbers, answerCode) {
  let qstmt = "";
  qstmt += `<div style='display:flex;align-items:center'><span style="margin-right:20px;white-space:nowrap">${numbers[0]} plus ${numbers[1]} is equal to ${numbers[0] + numbers[1]} is written as </span><input type='text' name='${answerCode}' answer-code='${answerCode}' size='10' class='form-control blank'> </div>`;
  qstmt += `</div>`;
  return qstmt;
}

function createQuestion(questionNo, numbers, topicId, exerciseId) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const answerCode = generateRandom4();

  let questionStatement = generateQuestionStatement(numbers, answerCode);
  let exerciseCustomCSS = `.equation-container {display: grid; grid-template-columns: repeat(4, auto); gap:10px; width: fit-content; align-items: center }
   .equation-container > div {text-align:center}
   .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
   .countable-manipulatives-whole {border-radius: 8px;}
   .equation { display: grid; align-items: center;}
   .object-count-container {text-align: center}`;
  return {
    questionNo: questionNo,
    questionType: "FILL_IN_THE_BLANKS",
    exerciseCustomCSS: exerciseCustomCSS,
    focusFirstInput: 1,
    explanation: "NONE",
    answerExplanation: "",
    exerciseId: exerciseId,
    topicId: topicId,
    highestNumberHandled: sum,
    exampleQuestionId: null,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: questionStatement,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [
          {
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 0,
            ignoreCommas: 0,
            allowTypos: 0,
            answerCodes: [answerCode],
            allowedAnswers: [[[`${numbers[0]} + ${numbers[1]} = ${numbers[0] + numbers[1]}`]]],
          },
        ],
      },
    ],
  };
}

// Generate the questions and save them to the JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);
