// Show 2 groups of countable objects of the same kind.
// Below the groups ask ____ + ___ = ___
// The student must provide the addends and the sum in the blank

// To be asked for Addition of numbers (sums upto 5, 10 and 18)
// Learning goal: Understand the concept of addition facts using visual illustration

const fs = require("fs");
const path = require("path");

const { generateRandom4, saveQuestionsToJSONFile } = require("../utility.js");
const util = require("./addition_utility.js");

// Load the icons
const iconsFilePath = path.join(__dirname, "../icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

// Function to generate the questions
function generateQuestions() {
  const questions = [];
  let questionNo = 0;

  // Loop through each icon in the icons.json
  for (let iconIndex in imageObjects) {
    const icon = imageObjects[iconIndex];

    // Generate questions for every possible combination of 1 to 9 objects in part 1 and part 2
    for (let count1 = 1; count1 <= 9; count1++) {
      for (let count2 = 1; count2 <= 9; count2++) {
        const topicId = 0;
        const exerciseId = 0;
        const question = createQuestion(questionNo, [count1, count2], [icon, icon], topicId, exerciseId);
        questions.push(question);
        questionNo = questionNo + 1;
      }
    }
  }

  return questions;
}

function generatePart2(answerCodes) {
  let content = `<div class='answer-set'>`;
  let commonAttributes = `input-type='INPUT' maxlength='5' style='display:inline-block;width:10ch;margin-right:10px'`;
  content += `<input type='text' class='form-control' ${commonAttributes} answer-code='${answerCodes[0]}'/>`;
  content += `&nbsp;&nbsp;+&nbsp;&nbsp;`;
  content += `<input type='text' class='form-control' ${commonAttributes} answer-code='${answerCodes[1]}'/>`;
  content += `&nbsp;&nbsp;=&nbsp;&nbsp;`;
  content += `<input type='text' class='form-control' ${commonAttributes} answer-code='${answerCodes[2]}'/>`;
  content += "</div>";
  return content;
}

function generatePart1(numbers, icons) {
  let qstmt = ``;
  qstmt += `<p>Write the addition fact based on the picture</p>${util.generateDisjointSentence(
    icons,
    numbers,
    false,
    false
  )}`;
  return qstmt;
}

function generateAnswerExplanation (numbers, icons) {
    let answerExplanation = "";
    answerExplanation += `<p class='audio-enabled'>Count the number of ${
      icons[0].plural
    } in each group.</p>${util.generateDisjointSentence(icons, numbers, true, false)}
    <p class='audio-enabled'>The first part of the addition statement is ${numbers[0]} + ${numbers[1]}</p>
    <p class='audio-enabled'>To find the sum, count all the ${icons[0].plural} together. There are ${numbers[0] + numbers[1]} ${
      icons[0].plural
    }.</p><p class='audio-enabled'>The addition fact for the picture is written as ${numbers[0]} + ${numbers[1]} = ${numbers[0] + numbers[1]}</p>`;
    return answerExplanation;
}

// Function to create individual question objects
function createQuestion(questionNo, numbers, icons, topicId, exerciseId) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  let answerCodes = [generateRandom4(), generateRandom4(), generateRandom4()];

  let questionStatement1 = generatePart1(numbers, icons);
  let questionStatement2 = generatePart2(answerCodes);
  let answerExplanation = generateAnswerExplanation(numbers, icons);
  let exerciseCustomCSS = `.equation-container {display: grid; grid-template-columns: repeat(4, auto); gap:10px; width: fit-content;  align-items: center }
     .equation-container > div {text-align:center}
     .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
     .countable-manipulatives-whole {border-radius: 8px;}
     .equation { display: grid; align-items: center;}
     .object-count-container {text-align: center}`;

  // Build the JSON structure for a single question
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
    totalPoints: 1,
    allowPartialScoring: 1,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: questionStatement1,
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: null,
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
        answerKeys: [
          {
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 0,
            ignoreCommas: 0,
            allowTypos: 0,
            points: 0.333,
            answerCodes: [answerCodes[0]],
            allowedAnswers: [[[numbers[0]]]],
          },
          {
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 0,
            ignoreCommas: 0,
            allowTypos: 0,
            points: 0.333,
            answerCodes: [answerCodes[1]],
            allowedAnswers: [[[numbers[1]]]],
          },
          {
            caseSensitive: 0,
            ignoreSpaces: 0,
            ignoreHyphens: 0,
            ignoreCommas: 0,
            allowTypos: 0,
            points: 0.333,
            answerCodes: [answerCodes[2]],
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
