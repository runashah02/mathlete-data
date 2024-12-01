const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const iconsFilePath = path.join(__dirname, "../icon-sets.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, count: -1, rangeDesc: "1-3" },
  { min: 1, max: 5, count: -1, rangeDesc: "1-5" },
  { min: 1, max: 9, count: -1, rangeDesc: "1-9" } 
];

let customCSS = `
  .equation-container {display: grid; grid-template-columns: repeat(4, auto); width: fit-content; align-items: center }
  .equation-container > div {text-align:center}
  .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
  .countable-manipulatives-left {border-top-left-radius: 8px; border-bottom-left-radius: 8px; border-right:1px dotted black}
  .countable-manipulatives-right {border-top-right-radius: 8px; border-bottom-right-radius: 8px; border-left:1px dotted black}
  .object-count-container {text-align: center}
  .em-answer {font-weight:bold}
`;

let exerciseDesc = `
Are there more/fewer?
2 groups with a different number of objects (of different kind) are displayed.
To solve, select the object that has more/fewer number displayed.

This exercise generates 2 variations: 1. more, 2.fewer.
All solutions have the same number of steps. Twistiness is always 0.
`

function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];
    if (slab.count === 0) continue;
    if (slab.count < 0) {
      imageObjects.forEach((iconSet) => {
        questions.push(generateQuestion(questionNo++, iconSet, slab));
      });
    } else {
      for (let i = 0; i < slab.count; ++i) {
        let iconIdx = util.getRandomNumber(0, imageObjects.length - 1);
        questions.push(generateQuestion(questionNo++, imageObjects[iconIdx], slab));
      }
    }
  }
  return questions;
}

function generateQuestionPart0(iconSet, questionType) {
  let iconPair = iconSet.iconPair;
  let qstmt = `<p><span class='audio-enabled'>Are there ${questionType === "more" ? "more" : "fewer"} ${
    iconPair[0].plural
  } or ${iconPair[1].plural}?</span></p>`;
  return qstmt;
}

function generateQuestionPart1(iconSet, counts, questionType) {
  let qstmt = util.generateObjectsContainerPartitioned(iconSet.iconPair, counts, false, false);
  return qstmt;
}

function generateAnswerKeys2(answerCodes, iconSet, counts, questionType) {
  const correctAnswerIndex =
    questionType === "more" ? counts.indexOf(Math.max(...counts)) : counts.indexOf(Math.min(...counts));

  return answerCodes.map((code, i) => ({
    content: `<img src='/assets/count-objects/${iconSet.iconPair[i].iconName}' class='object-image' width='35' />`,
    answerCodes: [code],
    allowedAnswers: [[[i === correctAnswerIndex ? 1 : 0]]],
  }));
}

function generateAnswerExplanation(iconSet, counts, questionType, slab) {
  const correctCount = questionType === "more" ? Math.max(...counts) : Math.min(...counts);
  const fewerIndex = counts.indexOf(Math.min(...counts));
  const moreIndex = counts.indexOf(Math.max(...counts));
  const lessCount = Math.min(...counts);
  const moreCount = Math.max(...counts);

  let expln = ``;
  expln += `<p><span class="audio-enabled">Count ${iconSet.setPlural} in each group</span></p>`;
  expln += util.generateObjectsContainerPartitioned(iconSet.iconPair, counts, true, false);
  expln += `<br/>`;
  expln += `<p><span class="audio-enabled">Say the counting numbers from 1 to ${slab.max}</span>.</p>`;
  expln += `<p>`;
  for (i = 1; i <= slab.max; ++i) {
    if (counts.includes(i)) {
      expln += `<span class="em-answer"><span style="margin-right:15px">${i}</span></span>`;
    } else {
      expln += `<span style="margin-right:15px">${i}</span>`;
    }
  }

  if (questionType === "fewer") {
    expln += `<p><span class='audio-enabled'>${util.numberToHTML(lessCount)} comes before ${util.numberToHTML(
      moreCount
    )}.${util.numberToHTML(lessCount)} is less than ${util.numberToHTML(
      moreCount
    )}</span>.</p>`;
    expln += `<p><span class='audio-enabled'>There are fewer <span class="em-answer">${iconSet.iconPair[fewerIndex].plural}</span> than ${iconSet.iconPair[moreIndex].plural}.
      </span></p>`;
  } else {
    expln += `<p><span class='audio-enabled'>${util.numberToHTML(moreCount)} comes after ${util.numberToHTML(
      lessCount
    )}. ${util.numberToHTML(moreCount)} is more than ${util.numberToHTML(
      lessCount
    )}.</span></p>`;
    expln += `<p><span class='audio-enabled'>There are more <span class="em-answer">${iconSet.iconPair[moreIndex].plural}</span> than ${iconSet.iconPair[fewerIndex].plural}.
      </span></p>`;
  }
  return expln;
}

function generateQuestion(questionNo, iconSet, slab) {
  const answerCodes = Array.from({ length: 2 }, util.generateRandom4);
  const counts = util.generateUniqueNumbers([], 2, slab.min, slab.max);

  const questionType = Math.random() > 0.5 ? "more" : "fewer";

  return {
    questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: (questionType == "fewer") ? 1 : 2,
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: customCSS,
    focusFirstInput: 1,
    exerciseDesc: exerciseDesc,
    sourceDetail: fileNameWithoutExt,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    parts: [
      {
        autoContent: 0,
        content: generateQuestionPart0(iconSet, questionType),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [],
      },
      {
        autoContent: 0,
        content: generateQuestionPart1(iconSet, counts, questionType),
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeys: [],
      },
      {
        autoContent: 1,
        content: "",
        maxPossibleRepeats: 1,
        requiredRepeats: 1,
        displayRepeatCount: 0,
        answerKeysPerRow: 1,
        answerKeys: generateAnswerKeys2(answerCodes, iconSet, counts, questionType),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(iconSet, counts, questionType, slab),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
