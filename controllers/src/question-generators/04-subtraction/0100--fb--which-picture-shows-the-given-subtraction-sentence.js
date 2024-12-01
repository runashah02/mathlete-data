const fs = require("fs");
const path = require("path");
const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

// Load the icons
const iconsFilePath = path.join(__dirname, "../icon_pairs.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

// Function to generate the questions
function generateQuestions() {
  const questions = [];
  let questionNo = 0;

  // Loop through each icon in the icons.json
  for (let i = 0; i < imageObjects.length; ++ i) {
    const iconPair = imageObjects[i];
    for (let count1 = 1; count1 <= 9; count1++) {
      for (let count2 = 1; count2 <= 9; count2++) {
        let topicId = 0;
        let exerciseId = 0;
        const question = createQuestion(questionNo, [count1, count2], iconPair, topicId, exerciseId);
        questions.push(question);
        questionNo += 1;
      }
    }
  }

  return questions;
}

function generateQuestionStatement (numbers) {
  let qstmt = "";
  qstmt += `<p class='audio-enabled'>Which picture shows the addition sentence ${numbers[0]} + ${numbers[1]} = ${numbers[0] + numbers[1]}?</p>`
  return qstmt;
}

function generateAnswerKey (numbers, iconPair) {
  let content = "";
  content += util.generateJointSentence(iconPair, [numbers[0], numbers[1]], false, false);
  return content;
}

function generateAnswerExplanation (numbers, iconPair){
  let answerExplanation = "";
  answerExplanation += `<p class='audio-enabled'>
The first group must have ${numbers[0]} ${numbers[0] == 1 ? iconPair[0].singular : iconPair[0].plural}</p>
<p><div class='equation-container'>${util.generateObjectsContainer(iconPair[0].iconName, numbers[0], "left", true, 1)}</div></p>
<p class='audio-enabled'>The second group must have ${numbers[1]} ${numbers[1] == 1 ? iconPair[1].singular : iconPair[1].plural}</p>
<p><div class='equation-container'>${util.generateObjectsContainer(iconPair[1].iconName, numbers[1], "right", true, 1)}</div></p>
<p class='audio-enabled'>${numbers[0]} + ${numbers[1]} = ${numbers[0] + numbers[1]} is represented by the picture</p>
<p>${util.generateJointSentence (iconPair, [numbers[0], numbers[1]], false, false)}</p>`;
  return answerExplanation;
}

// Function to create individual question objects
function createQuestion(questionNo, numbers, iconPair, topicId, exerciseId) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const uniqueOptions = util.generateUniqueOptions(4, [[numbers[0], numbers[1]]], sum, (sum <= 5 ? 5 : sum <= 10 ? 10 : 18));

  let questionStatement = generateQuestionStatement(numbers);
  let answerExplanation = generateAnswerExplanation(numbers, iconPair);
  let exerciseCustomCSS = `.equation-container {display: grid; grid-template-columns: repeat(4, auto); width: fit-content; align-items: center }
   .equation-container > div {text-align:center}
   .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
   .countable-manipulatives-left {border-top-left-radius: 8px; border-bottom-left-radius: 8px; border-right:1px dotted black}
   .countable-manipulatives-right {border-top-right-radius: 8px; border-bottom-right-radius: 8px; border-left:1px dotted black}
   .equation { display: grid; align-items: center;}
   .object-count-container {text-align: center}
   .basic-option {border:2px solid transparent;border-radius:8px} 
   .basic-option:hover {border-color:lightgray} 
   .basic-option.selected {border-color:darkgray}`;
  
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
    sumPoints: 1,
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
        answerKeysPerRow: 1,
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
        optionsContainer: "FLEX",
        optionsDirection: "column",
        answerKeysPerRow: 4,
        hideInQuestion: 0,
        hideInCorrectAnswers: 0,
        hideInStudentAnswers: 0,
        hideInSubmittedAnswers: 0,
        answerInputCSS: "basic-option",
        shuffleAnswerOptions: 1,
        answerKeys: [
          {
            content: generateAnswerKey([uniqueOptions[0][0], uniqueOptions[0][1]], iconPair),
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[0][0] == numbers[0] && uniqueOptions[0][1] == numbers[1] ? 1 : 0]]],
          },
          {
            content: generateAnswerKey([uniqueOptions[1][0], uniqueOptions[1][1]], iconPair),
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[1][0] == numbers[0] && uniqueOptions[1][1] == numbers[1] ? 1 : 0]]],
          },
          {
            content:  generateAnswerKey([uniqueOptions[2][0], uniqueOptions[2][1]], iconPair),
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[2][0] == numbers[0] && uniqueOptions[2][1] == numbers[1] ? 1 : 0]]],
          },
          {
            content:  generateAnswerKey([uniqueOptions[3][0], uniqueOptions[3][1]], iconPair),
            points: 0.25,
            answerCodes: [generateRandom4()],
            allowedAnswers: [[[uniqueOptions[3][0] == numbers[0] && uniqueOptions[3][1] == numbers[1] ? 1 : 0]]],
          },
        ],
      },
    ],
    explanation: "STATIC",
    answerExplanation: answerExplanation
  };
}


// Generate the questions and save them to the JSON file
const questions = generateQuestions();
const fileNameWithoutExt = path.basename(__filename, ".js");
saveQuestionsToJSONFile(questions, fileNameWithoutExt);
