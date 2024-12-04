const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

// Function to generate the questions
function generateQuestions() {
  const questions = [];
  let questionNo = 0;

  for (let count1 = 1; count1 <= 50; count1++) {
    for (let count2 = 0; count2 <= 99 - count1; count2++) {
      let topicId = 0;
      let exerciseId = 0;
      const question = createQuestion(
        questionNo,
        Math.random() < 0.5 ? [count1, count2] : [count2, count1],
        topicId,
        exerciseId
      );
      questions.push(question);
      questionNo += 1;
    }
  }

  return questions;
}

function generateQuestionStatement1(numbers) {
  let qstmt = "";
  qstmt = `<p class='audio-enabled'>Select the sum for</p>`
  qstmt += `${numbers[0]} + ${numbers[1]}`;
  return qstmt;
}

function generateQuestionStatement2(gridMaxNum, answerCodes) {
  let content = "";
  let currentCount = 1;
  content += `<table class='tbl number-grid'>`;
  for (row = 0; row < Math.max(Math.floor(gridMaxNum / 10), 1); ++row) {
    content += "<tr>";
    for (col = 0; col < 10; ++col) {
      content += `<td class='answer-option clickable' answer-code='${
        answerCodes[currentCount - 1]
      }'>${currentCount}</td>`;
      currentCount++;
    }
    content += "</tr>";
  }
  content += `</table>`;
  return content;
}

function generateAnswerKeys(answerCodes, correctAnswer) {
  let answerKeys = [];
  for (let i = 1; i <= answerCodes.length; ++i) {
    let answerKey = {
      answerCodes: [answerCodes[i - 1]],
      allowedAnswers: [[[correctAnswer == i ? 1 : 0]]],
    };
    answerKeys.push(answerKey);
  }
  return answerKeys;
}

function generateAnswerExplanation(numbers) {
  const icon = { iconName: "dot", singular: "dot", plural: "dots" };
  if (numbers[0] + numbers[1] <= 10) {
    return util.VIadditionSteps(numbers, [icon, icon]);
  }
  if (numbers[0] + numbers[1] <= 18) {
    return util.VIadditionSteps(numbers, [icon, icon]) + util.fingerCountSteps(numbers);
  }
  if (numbers[0] <= 9 || numbers[1] <= 9) {
    return util.fingerCountSteps(numbers);
  }
  return util.columnAdditionSteps(numbers);
}

// Function to create individual question objects
function createQuestion(questionNo, numbers, iconPair, topicId, exerciseId) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const gridMaxLimit = sum <= 5 ? 5 : sum <= 10 ? 10 : sum <= 20 ? 20 : 100;
  let answerCodes = [];
  for (i = 0; i < gridMaxLimit; ++i) {
    answerCodes.push(generateRandom4());
  }

  let questionStatement1 = generateQuestionStatement1(numbers);
  let questionStatement2 = generateQuestionStatement2(gridMaxLimit, answerCodes);

  let answerExplanation = generateAnswerExplanation(numbers, iconPair);
  let answerKeys = generateAnswerKeys(answerCodes, sum);
  let exerciseCustomCSS = `.equation-container {display: grid; grid-template-columns: repeat(4, auto); width: fit-content; align-items: center }
   .equation-container > div {text-align:center}
   .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
   .countable-manipulatives-left {border-top-left-radius: 8px; border-bottom-left-radius: 8px; border-right:1px dotted black}
   .countable-manipulatives-right {border-top-right-radius: 8px; border-bottom-right-radius: 8px; border-left:1px dotted black}
   .equation { display: grid; align-items: center;}
   .object-count-container {text-align: center}
   .clickable {cursor: pointer; transition: 'background-color 0.3s, border-color 0.3s';background-color: #ffffff;text-align: center;} 
   .clickable:hover {background-color: #b7e7fb;} 
   .clickable.selected {background-color: #b7e7fb;} tbl {border-collapse:collapse} 
   .number-grid {border: 2px solid #b7e7fb; width: auto;}
   .number-grid td {border: 2px solid #b7e7fb; padding: 10px;}   
   `;

  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: exerciseCustomCSS,
    questionCustomCSS: null,
    focusFirstInput: 1,
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
        content: questionStatement1,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 1,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerKeys: [],
      },
      {
        autoContent: 0,
        content: questionStatement2,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        optionsContainer: "GRID",
        optionsDirection: "column",
        answerKeysPerRow: 10,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerInputCSS: "",
        shuffleAnswerOptions: 1,
        answerKeys: answerKeys,
      },
    ],
    explanation: "STATIC",
    answerExplanation: answerExplanation,
  };
}

// Generate the questions and save them to the JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);
