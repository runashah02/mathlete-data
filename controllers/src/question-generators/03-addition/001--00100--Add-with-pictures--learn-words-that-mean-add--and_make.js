// Show 2 groups of countable objects of the same kind.
// Below the groups ask A and B make ___
// A must be positioned below the first group, B below the second group
// The student must provide the sum in the blank

// To be asked for Addition of numbers (sums upto 5, 10 and 18)
// Learning goal: Understand the concept of A and B make C using visual illustration

const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

const iconsFilePath = path.join(__dirname, "../icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

function generateQuestions() {
  const questions = [];
  let questionNo = 0;

  for (let iconIndex in imageObjects) {
    const icon = imageObjects[iconIndex];

    for (let num1 = 1; num1 <= 9; num1++) {
      for (let num2 = 1; num2 <= 9; num2++) {
        sum = num1 + num2;
        let topicId = sum <= 5 ? 452 : sum <= 10 ? 25 : 26;
        let exerciseId = sum <= 5 ? 2 : sum <= 10 ? 3 : 4;

        const question = createQuestion(questionNo, [num1, num2], [icon, icon], topicId, exerciseId);
        questions.push(question);
        questionNo = questionNo + 1;
      }
    }
  }
  return questions;
}

function generateAnswerExplanation(numbers, icons) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);

  // Extract unique plural names from icons
  const uniquePlurals = Array.from(new Set(icons.map((icon) => icon.plural)));
  const objectNames = uniquePlurals.join(", ").replace(/, ([^,]*)$/, " and $1");

  return `<p class='audio-enabled'>To add, count the ${objectNames}, like this:</p>
          ${util.generateDisjointSentence(icons, numbers, true, true)}
          <p></p>
          <p class='audio-enabled'>There are ${sum} ${objectNames},
          so ${numbers.join(", ").replace(/, ([^,]*)$/, " and $1") + " make "}${sum}</p>`;
}

function generateQuestionStatement(numbers, icons, answerCode) {
  let qstmt = `<p class="audio-enabled">Add</p>`;
  qstmt += `<div class="equation-container">`;
  for (let i = 0; i < numbers.length; ++i) {
    qstmt += util.generateObjectsContainer (icons[i].iconName, numbers[i], "whole", false, 0);
    qstmt += "<div></div>";
  }

  for (let i = 0; i < numbers.length; ++i) {
    qstmt += `<div>${numbers[i]}`;
    qstmt += `</div>`;
    qstmt += i < numbers.length - 1 ? `<div> and </div>` : "";
  }

  // The word "make" and input must be in the same row. Therefore, setting display to flex
  qstmt += `<div style='display:flex;align-items:center'><span style="margin-right:20px;">make</span><input type='text' name='${answerCode}' answer-code='${answerCode}' size='2' class='form-control blank'> </div>`;
  qstmt += `</div>`;
  return qstmt;
}

function createQuestion(questionNo, numbers, icons, topicId, exerciseId) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const answerCode = generateRandom4();

  let questionStatement = generateQuestionStatement(numbers, icons, answerCode);
  let answerExplanation = generateAnswerExplanation(numbers, icons);
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
    explanation: "STATIC",
    answerExplanation: answerExplanation,
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
            allowedAnswers: [[[sum]]],
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
