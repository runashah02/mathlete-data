const fs = require("fs");
const path = require("path");
const util = require("../utility.js");

const iconsFilePath = path.join(__dirname, "../cute-icons.json");
const imageObjects = JSON.parse(fs.readFileSync(iconsFilePath, "utf-8"));

const fileNameWithoutExt = path.basename(__filename, ".js");

const slabs = [
  { min: 1, max: 3, count: -1, rangeDesc: "1-3" },
  { min: 1, max: 5, count: -1, rangeDesc: "1-5" },
  { min: 1, max: 9, count: -1, rangeDesc: "1-9" }
];

let customCSS = `
    .basic-option {border:2px solid transparent;border-radius:8px}
    .basic-option:hover {border-color:lightgray}
    .basic-option.selected {border-color:darkgray}
    .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; width:fit-content; border-radius: 8px; }
    .object-image-container { position: relative; }
    .object-count-container {text-align:center}
    .object-image {width: 35px; }
`;

let exerciseDesc = `
Which group has more/fewer objects?
2 groups with a different number of objects (of the same kind) are displayed.
To solve, select the group with more/fewer objects.

This exercise generates 2 variations: 1. more, 2.fewer.
All solutions have the same number of steps. Twistiness is always 0.
`;

function generateQuestions() {
  let questions = [];
  let questionNo = 0;

  for (let slabIdx = 0; slabIdx < slabs.length; ++slabIdx) {
    let slab = slabs[slabIdx];

    if (slab.count === 0) continue;
    
    if (slab.count < 0) {
      imageObjects.forEach((icon) => {
        questions.push (generateQuestion(questionNo++, icon, slab));
      });
    } else {
      for (let i = 0; i < slab.count; ++i) {
        let iconIdx = util.getRandomNumber(0, imageObjects.length - 1);
        questions.push (generateQuestion(questionNo++, imageObjects[iconIdx], slab));
      }
    }
  }
  return questions;
}

function generateQuestionPart0(icon, questionType) {
  return `<p><span class='audio-enabled'>Which group has ${
    questionType === "more" ? "more" : "fewer"
  } ${icon.plural}?</span></p>`;
}

function generateAnswerKeys1(answerCodes, icon, counts, questionType) {
  const correctAnswerIndex =
    questionType === "more" ? counts.indexOf(Math.max(...counts)) : counts.indexOf(Math.min(...counts));

  return answerCodes.map((code, i) => ({
    answerCodes: [code],
    content: util.generateObjectsContainerWhole(icon, counts[i], false, 1),
    allowedAnswers: [[[i === correctAnswerIndex ? 1 : 0]]],
  }));
}

function generateAnswerExplanation(icon, counts, questionType, slab) {
  const correctCount = questionType === "more" ? Math.max(...counts) : Math.min(...counts);
  const correctOption = counts.indexOf(correctCount) + 1;

  let expln = ``;
  expln += `<p><span class="audio-enabled">Count ${icon.plural} in each group</span></p>`;
  for (let i = 0; i < counts.length; ++i){
    expln += util.generateObjectsContainerWhole(icon, counts[i], true, 1);
    expln += `<p><span class="audio-enabled">There ${counts[i] == 1? "is": "are"} <span class="em-answer">${counts[i]}</span> ${counts[i] == 1? icon.singular: icon.plural}`
    expln += `<br/>`;
  }
  const lessCount = Math.min (...counts);
  const moreCount = Math.max (...counts);
  let correctAnswerIndex =
    questionType === "more" ? counts.indexOf(Math.max(...counts)) : counts.indexOf(Math.min(...counts));
  correctAnswerIndex ++;

  expln += `<p><span class="audio-enabled">Say the counting numbers from 1 to ${slab.max}</span>.</p>`;
  expln += `<p>`;
  for (i = 1; i <= slab.max; ++i) {
    if (counts.includes(i)) {
      expln += `<span class="em-answer"><span style="margin-right:15px">${i}</span></span>`;
    } else {
      expln += `<span style="margin-right:15px">${i}</span>`;
    }
  }

  if (questionType == "fewer") {
    expln += `<p><span class='audio-enabled'>
    ${lessCount} comes before ${moreCount}. ${lessCount} is less than ${moreCount}</span>.</p>
    <p><span class='audio-enabled'>Option <span class="em-answer">${correctOption}</span> has fewer ${icon.plural}</span>.</p>`;
  } else {
    expln += `<p><span class='audio-enabled'>
    When counting, ${moreCount} comes last. ${moreCount} is more than ${lessCount}.
    Option <span class="em-answer">${correctOption}</span> has more ${icon.plural} 
    </span></p>`;
  }
  return expln;
}

function generateQuestion(questionNo, icon, slab) {
  const answerCodes = Array.from({ length: 2 }, util.generateRandom4);
  const counts = util.generateUniqueNumbers([], 2, slab.min, slab.max);

  const questionType = Math.random() > 0.5 ? "more" : "fewer";

  return {
    questionNo,
    moduleId: 2,
    numberRangeMin: slab.min,
    numberRangeMax: slab.max,
    rangeDesc: slab.rangeDesc,
    variation: (questionType == "fewer" ? 1 : 2),
    questionType: "MULTIPLE_CHOICE",
    exerciseCustomCSS: customCSS,
    exerciseDesc: exerciseDesc,
    focusFirstInput: 1,
    sourceDetail: fileNameWithoutExt,
    totalPoints: 1,
    allowPartialScoring: 0,
    twistiness: 0,
    questionStatus: "PENDING_REVIEW",
    optionsContainer: "FLEX",
    optionsDirection: "column",
    highestNumberHandled: slab.max,   
    parts: [
      {
        autoContent: 0,
        content: generateQuestionPart0(icon, questionType),
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
        shuffleAnswerOptions: 1,
        answerInputCSS: "basic-option",
        answerKeys: generateAnswerKeys1(answerCodes, icon, counts, questionType),
      },
    ],
    explanation: "STATIC",
    answerExplanation: generateAnswerExplanation(icon, counts, questionType, slab),
  };
}

const questions = generateQuestions();
util.saveQuestionsToJSONFile(questions, __dirname, fileNameWithoutExt);
