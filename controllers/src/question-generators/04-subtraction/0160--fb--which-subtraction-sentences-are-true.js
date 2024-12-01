const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

function generateQuestions() {
  const questions = [];
  let questionNo = 0;

  for (let count1 = 0; count1 <= 50; count1++) {
    for (let count2 = 0; count2 <= 99 - count1; count2++) {
      const topicId = 0;
      const exerciseId = 0;
      const numbers = Math.random() > 0.5 ? [count1, count2] : [count2, count1];
      const question = createQuestion(questionNo, numbers, topicId, exerciseId);
      questions.push(question);
      questionNo += 1;
    }
  }

  return questions;
}

function generateQuestionStatement(numbers) {
  let qstmt = "";
  qstmt += `<p class='audio-enabled'>Which of the following addition sentences are true?</p>`;
  return qstmt;
}

function generateAnswerExplanation(numbers, sum) {
  let answerExplanation = "";
  let actualSum = numbers[0] + numbers[1];
  answerExplanation += `<p class='audio-enabled'>${numbers[0]} + ${numbers[1]} = ${actualSum}. `;
  if (actualSum == sum) {
    answerExplanation += `Therefore, this addition sentence is true</p>`;
  }
  else {
    answerExplanation += `Therefore, this addition sentence is false</p>`;
  }
  return answerExplanation;
}

// Function to create individual question objects
function createQuestion(questionNo, numbers, topicId, exerciseId) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  let sumLimit = sum <= 5 ? 5 : sum <= 10 ? 10 : sum <= 18 ? 18 : 99;
  const uniqueOptions = util.generateUniqueOptions(
    4,
    [[numbers[0], numbers[1]]],
    sum,
    sumLimit
  );

  for (let i = 0; i < uniqueOptions.length; ++i){
    let sum = uniqueOptions[i][0] + uniqueOptions[i][1];
    if (uniqueOptions[i][0] == numbers[0] && uniqueOptions[i][1] == numbers[1]) {
        uniqueOptions[i][2] = sum;
    }
    else {
        uniqueOptions[i][2] = Math.random () < 0.2 ? sum : util.generateConfusingOptions (uniqueOptions[i][0], uniqueOptions[i][1], 1);
    }
  }

  let questionStatement = generateQuestionStatement(numbers);
  let exerciseCustomCSS = ``;

  return {
    questionNo: questionNo,
    questionType: "MULTIPLE_SELECT",
    exerciseCustomCSS: exerciseCustomCSS,
    questionCustomCSS: null,
    focusFirstInput: 1,
    exerciseId: exerciseId,
    topicId: topicId,
    highestNumberHandled: sum,
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
        answerKeysPerRow: 4,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerInputCSS: null,
        shuffleAnswerOptions: 1,
        answerKeys: [
          {
            content: `${uniqueOptions[0][0]} + ${uniqueOptions[0][1]} = ${uniqueOptions[0][2]}`,
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[0][0] + uniqueOptions[0][1] == uniqueOptions[0][2] ? 1 : 0]]],
            answerExplanation: generateAnswerExplanation([uniqueOptions[0][0], uniqueOptions[0][1]], uniqueOptions[0][2])
          },
          {
            content: `${uniqueOptions[1][0]} + ${uniqueOptions[1][1]} = ${uniqueOptions[1][2]}`,
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[1][0] + uniqueOptions[1][1] == uniqueOptions[1][2] ? 1 : 0]]],
            answerExplanation: generateAnswerExplanation([uniqueOptions[1][0], uniqueOptions[1][1]], uniqueOptions[1][2])
          },
          {
            content: `${uniqueOptions[2][0]} + ${uniqueOptions[2][1]} = ${uniqueOptions[2][2]}`,
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[2][0] + uniqueOptions[2][1] == uniqueOptions[2][2] ? 1 : 0]]],
            answerExplanation: generateAnswerExplanation([uniqueOptions[2][0], uniqueOptions[2][1]], uniqueOptions[2][2])
          },
          {
            content: `${uniqueOptions[3][0]} + ${uniqueOptions[3][1]} = ${uniqueOptions[3][2]}`,
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[3][0] + uniqueOptions[3][1] == uniqueOptions[3][2] ? 1 : 0]]],
            answerExplanation: generateAnswerExplanation([uniqueOptions[3][0], uniqueOptions[3][1]], uniqueOptions[3][2])
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: "",
  };
}

// Generate the questions and save them to the JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);
