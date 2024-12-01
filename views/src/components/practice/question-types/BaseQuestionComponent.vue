<template>
  <div
    :class="parentContainerClass"
    :id="id"
    :question-id="question.questionId"
  >
    <div id="exerciseStyleTag" v-if="question.exerciseCustomCSS" v-html="exerciseStyleTag"></div>
    <div v-if="question.questionCustomCSS" v-html="questionStyleTag"></div>
    <audio id="clickSound" src="/assets/ux/click.mp3" preload="auto"></audio>
    <div v-if="show != 'EXPLANATION'">
      <div
        v-for="(questionPart, partIndex) in question.parts"
        :key="partIndex"
        class="row question-part mt-3"
        :id="id + '-part-' + partIndex"
        :question-id="question.questionId"
        :part-index="partIndex"
      >
        <div
          v-if="show == 'CORRECT_ANSWERS'"
          id="extraOptionsShownMsg"
          v-html="extraOptionsShownMsg(partIndex)"
          :question-id="question.questionId"
          :part-index="partIndex"
        ></div>

        <div
          class="col-12"
          v-for="setIndex in Array.from(
            {
              length:
                show === 'CORRECT_ANSWERS'
                  ? questionPart?.maxPossibleRepeats || 1
                  : questionPart?.requiredRepeats || 1,
            },
            (_, i) => i
          )"
          :key="setIndex"
        >
          <div v-if="!isHidden(partIndex)">
            <div
              class="d-inline-block part-set"
              :id="id + '-part-' + partIndex + '-' + setIndex"
              :question-id="question.questionId"
              :part-index="partIndex"
              :set-index="setIndex"
            >
              <div
                v-if="!questionPart.autoContent"
                v-html="questionPart.content"
              ></div>
              <div
                v-else
                v-html="autogenerateContent(partIndex, setIndex)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="question.answerExplanation" class="row">
        <div class="col-12" v-html="question.answerExplanation"></div>
      </div>
      <div v-for="(questionPart, partIndex) in question.parts" :key="partIndex">
        <div v-if="questionPart.answerExplanation" class="row">
          <div class="col-12" v-html="questionPart.answerExplanation"></div>
        </div>
        <div
          v-for="(answerKey, keyIndex) in question.parts[partIndex].answerKeys"
          :key="keyIndex"
        >
          <div class="row part-set" v-if="answerKey.answerExplanation">
            <div v-html="autogenerateExplanation(partIndex, keyIndex)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseQuestionComponent",
  props: {
    id: {
      type: String,
      required: true,
      description:
        "A unique id for the div displaying the question. For e.g., question-201 or correct-answers-6042",
    },
    question: {
      type: Object,
      required: true,
    },
    show: {
      type: String,
      required: false,
      default: "QUESTION",
      description:
        "QUESTION, CORRECT_ANSWERS, STUDENT_ANSWERS, SUPPLIED_ANSWERS, EXPLANATION",
    },
    answers: {
      type: Array,
      required: false,
      description:
        "An array of objects like [{'partIndex': 0, 'setIndex': 0, answerCode: 'a#4r', value: '3'},...] for each answerCode (blank) in the question. Required if show == 'SUPPLIED_ANSWERS'",
    },
    sound: {
      type: Boolean,
      required: false,
      default: true,
      description: "Gamification sound setting",
    },
  },

  computed: {
    exerciseStyleTag() {
      return `<style>${this.question.exerciseCustomCSS}</style>`;
    },
    questionStyleTag() {
      return `<style>${this.question.questionCustomCSS}</style>`;
    },
    parentContainerClass() {
      let parentContainerClass = "";
      switch (this.show) {
        case "QUESTION":
          parentContainerClass = "question-card";
          break;
        case "CORRECT_ANSWERS":
          parentContainerClass = "correct-answers-card";
          break;
        case "STUDENT_ANSWERS":
          parentContainerClass = "student-answers-card";
          break;
        case "EXPLANATION":
          parentContainerClass = "answer-explanation-card";
          break;
        default:
          break;
      }
      return parentContainerClass;
    },
  },

  data() {
    return {
      currentAnswers: [],
      initialAnswerValue: "",
    };
  },

  watch: {
    currentAnswers: {
      handler() {
        // some unnecessary extra calls when question.questionType == 'FILL_IN_THE_BLANKS' && show == 'QUESTION
        // TODO: design a pattern to make this optional
        if (!this.currentAnswers || this.currentAnswers.length == 0) return;
        if (this.show == "EXPLANATION") return;

        this.fillAnswers(this.currentAnswers);
      },
      deep: true,
    },
  },

  beforeMount() {
    //console.log(this.question);
  },

  mounted() {
    this.currentAnswers = this.initAnswersByMode(
      this.show,
      this.question,
      this.initialAnswerValue
    );

    // For a grid the elements within a column are all equal width but each column may be a different
    // width... this width adjustment is done here
    this.$nextTick(() => {
      if ((this.question.optionsContainer || "GRID") == "GRID") {
        this.adjustOptionsWidth();
      }

      this.show == "QUESTION"
        ? this.enableUserInteraction()
        : this.disableUserInteraction();
      if (this.show == "QUESTION" && this.question.focusFirstInput)
        this.focusFirstInput();
    });

    // Wrap the subsequent operations in nextTick, thereby defering them until after the DOM is updated with the new currentAnswers.
    // For example, in OrderRearrangement, answer-option innerHTML is set in fillAnswers, we must wait till answers are filled in
    /*
    this.$nextTick(() => {
      const optionsContainer = this.question.optionsContainer || "GRID";
      alert(optionsContainer);
      if (optionsContainer == "GRID") {
        this.adjustOptionsWidth();
      }

      this.show == "QUESTION"
        ? this.enableUserInteraction()
        : this.disableUserInteraction();
      if (this.show == "QUESTION" && this.question.focusFirstInput)
        this.focusFirstInput();
    }); */
  },

  methods: {
    focusFirstInput() {
      return;
    },

    isHidden(partIndex) {
      const questionPart = this.question.parts[partIndex];
      return !(
        (this.show === "QUESTION" && !questionPart.hideInQuestion) ||
        (this.show === "CORRECT_ANSWERS" &&
          !questionPart.hideInCorrectAnswers) ||
        (this.show === "STUDENT_ANSWERS" &&
          !questionPart.hideInStudentAnswers) ||
        this.show === "SUBMITTED_ANSWERS"
      );
    },

    extraOptionsShownMsg(partIndex) {
      if (
        this.question.parts[partIndex].requiredRepeats <
        this.question.parts[partIndex].maxPossibleRepeats
      ) {
        return `Any ${this.question.parts[partIndex].requiredRepeats} of the following ${this.question.parts[partIndex].maxPossibleRepeats} answers is correct`;
      }
      return "";
    },

    initAnswersByMode(mode, question, initialAnswerValue) {
      let answers = [];
      switch (mode) {
        case "QUESTION":
        case "CORRECT_ANSWERS":
        case "EXPLANATION":
          for (
            let partIndex = 0;
            partIndex < question.parts.length;
            ++partIndex
          ) {
            let part = question.parts[partIndex];
            if (!part.answerKeys || part.answerKeys.length == 0) continue;
            let sets =
              mode === "CORRECT_ANSWERS" || mode === "EXPLANATION"
                ? part.maxPossibleRepeats || 1
                : part.requiredRepeats || 1;
            Array.from({ length: sets }).forEach((_, setIndex) => {
              part.answerKeys.forEach((answerKey, keyIndex) => {
                if (answerKey.allowedAnswers) {
                  answerKey.answerCodes.forEach((answerCode, codeIndex) => {
                    let value =
                      mode === "CORRECT_ANSWERS" || mode == "EXPLANATION"
                        ? part.answerKeys[keyIndex].allowedAnswers[setIndex][
                            codeIndex
                          ][0]
                        : initialAnswerValue !== "INITIAL_ANSWERS"
                        ? initialAnswerValue
                        : part.answerKeys[keyIndex].initialAnswers[setIndex][
                            codeIndex
                          ][0];
                    answers.push({
                      questionPartId: part.questionPartId,
                      partIndex,
                      setIndex,
                      answerKeyId: answerKey.answerKeyId,
                      keyIndex,
                      answerCode,
                      value,
                      isInvalid: true,
                      partOfGroup: answerKey.answerCodes.length > 1,
                    });
                  });
                }
              });
            });
          }
          break;
        case "STUDENT_ANSWERS":
          answers = this.question.studentAnswers;
          break;
        case "SUPPLIED_ANSWERS":
          answers = this.answers;
          break;
        default:
          break;
      }
      return answers;
    },

    adjustOptionsWidth() {
      const mainDiv = document.querySelector(`#${this.id}`);
      let options;

      options = mainDiv.querySelectorAll(".answer-option");
      //options = mainDiv.querySelectorAll(".answer-option");

      if (!options || options.length == 0) return;

      let maxWidth = 0;
      let maxHeight = 0;
      let dropAreaWidth = 0;

      // Calculate the maximum width and height of the .answer-option elements, including margins
      options.forEach((option) => {
        const optionStyles = window.getComputedStyle(option);
        option.style.width = "auto";
        option.style.height = "auto";
        option.style.lineHeight = "auto";
        option.style.display = "inline-block";

        const optionWidth =
          option.offsetWidth + // Includes padding and border
          parseFloat(optionStyles.marginLeft) +
          parseFloat(optionStyles.marginRight);
        if (optionWidth > maxWidth) {
          maxWidth = optionWidth;
        }

        const optionHeight =
          option.clientHeight + // Includes padding and border
          parseFloat(optionStyles.marginTop) +
          parseFloat(optionStyles.marginBottom);

        if (optionHeight > maxHeight) {
          maxHeight = optionHeight;
        }
      });

      options.forEach((option) => {
        option.style.minWidth = `${maxWidth}px`;
        option.style.minHeight = `${maxHeight}px`;
      });

      let optionGrids = mainDiv.querySelectorAll(`.option-grid`);

      optionGrids.forEach((optionGrid) => {
        //let response = this.getPartSetForElem(optionGrid);
        //let { partIndex } = response;

        const answerKeysPerRow = optionGrid.getAttribute("answer-keys-per-row");
        //this.question.parts[partIndex].answerKeysPerRow ||
        //this.question.parts[partIndex].answerKeys?.length || 0;

        // Check if the direct children are .drop-areas or .answer-options
        const dropAreas = optionGrid.querySelectorAll(".drop-area");

        if (dropAreas.length > 0) {
          // Calculate the maximum width of each .drop-area, taking into account multiple .answer-options in a row
          dropAreas.forEach((dropArea) => {
            const dropAreaStyles = window.getComputedStyle(dropArea);
            const dropZonesPerRow = dropArea.getAttribute("drop-zones-per-row");
            //this.question.parts[partIndex].dropZonesPerRow || 1;
            const dropAreaGap =
              parseFloat(dropAreaStyles.getPropertyValue("gap")) || 0;

            // Calculate the total width of each .drop-area based on .answer-option width and gap
            const calculatedDropAreaWidth =
              dropZonesPerRow * maxWidth +
              (dropZonesPerRow - 1) * dropAreaGap +
              parseFloat(dropAreaStyles.paddingLeft) +
              parseFloat(dropAreaStyles.paddingRight) +
              parseFloat(dropAreaStyles.borderLeftWidth) +
              parseFloat(dropAreaStyles.borderRightWidth) +
              parseFloat(dropAreaStyles.marginLeft) +
              parseFloat(dropAreaStyles.marginRight);

            if (calculatedDropAreaWidth > dropAreaWidth) {
              dropAreaWidth = calculatedDropAreaWidth;
            }
            dropArea.style.gridTemplateColumns = `repeat(auto-fit, ${maxWidth}px)`;
            dropArea.style.maxWidth = `${dropAreaWidth}px`; // Set the width to match the calculated width
          });
        } else {
          // If there are no .drop-areas, use the maxWidth of the .answer-options directly
          dropAreaWidth = maxWidth;
        }

        // Get the gap between columns in the option-grid
        const optionGridStyles = window.getComputedStyle(optionGrid);
        const optionGridGap =
          parseFloat(optionGridStyles.getPropertyValue("gap")) || 0;

        // Calculate the total width of the .option-grid based on .drop-area width or .answer-option width
        const optionGridWidth =
          answerKeysPerRow * dropAreaWidth +
          (answerKeysPerRow - 1) * optionGridGap;

        // Set the calculated width for the .option-grid
        optionGrid.style.gridTemplateColumns = `repeat(auto-fit, ${dropAreaWidth}px)`;
        optionGrid.style.maxWidth = `${optionGridWidth}px`; // Set the width to match the calculated width
      });

      // TODO: Improve logic - answerOptions must be rendered on screen to get the maxWidth
      // but have to be hidden for OrderRearrangement

      //let mainDiv = document.querySelector ("#" + this.id);
      let hiddens = mainDiv.querySelectorAll(".hidden");
      hiddens.forEach((hidden) => {
        hidden.classList.remove("d-inline-block");
        hidden.style.display = "none";
      });
    },

    disableUserInteraction() {
      const mainDiv = document.querySelector(`#${this.id}`);
      mainDiv.style.pointerEvents = "none";
    },

    answerChanged(partIndex, setIndex, answerCode, newValue) {
      let currentAnswer = this.currentAnswers.find(
        (a) =>
          a.partIndex == partIndex &&
          a.setIndex == setIndex &&
          a.answerCode == answerCode
      );
      currentAnswer.value = newValue;
    },

    checkAnswers() {
      if (this.incompleteSubmission && this.incompleteSubmission()) {
        let response = confirm(
          "This is an incomplete submission. Are you sure you want to proceed?"
        );
        if (!response) return;
      }

      let allCorrect = true;
      let points = 0;
      let totalPoints = 0;
      let partialPoints = 0;

      // prettier-ignore
      for (let partIndex = 0; partIndex < this.question.parts.length; ++partIndex) {
        if (! this.question.parts[partIndex].answerKeys) continue;

        for (let keyIndex = 0; keyIndex < this.question.parts[partIndex].answerKeys.length; ++keyIndex) {
          let answerKey = this.question.parts[partIndex].answerKeys[keyIndex];
          totalPoints += answerKey.points;
          if (! answerKey.allowedAnswers || answerKey.allowedAnswers.length == 0) continue;

          let answerCodes = answerKey.answerCodes;
          let acceptedSets = [];
          
          for (let setIndex = 0; setIndex < this.question.parts[partIndex].requiredRepeats; ++setIndex) {
            let studentAnswer = [];
            
            for (let codeIndex = 0; codeIndex < answerCodes.length; ++codeIndex) {
              let currentAnswer = this.currentAnswers.find((ca) =>
                  ca.partIndex == partIndex &&
                  ca.setIndex == setIndex &&
                  ca.answerCode == answerCodes[codeIndex]
              );
              studentAnswer.push(currentAnswer.value);
            }

            console.log (studentAnswer);

            if (this.findMatchingSet(acceptedSets, studentAnswer, answerKey.caseSensitive, answerKey.ignoreSpaces, answerKey.ignoreHyphens, answerKey.ignoreCommas, answerKey.matchInAnyOrder)) break;
            let matchingSet = this.findMatchingSet(answerKey.allowedAnswers, studentAnswer, answerKey.caseSensitive, answerKey.ignoreSpaces, answerKey.ignoreHyphens, answerKey.ignoreCommas, answerKey.matchInAnyOrder);
            if (matchingSet) {
              acceptedSets.push(matchingSet);
              if (this.question.allowPartialScoring) partialPoints += answerKey.points;
              for (let codeIndex = 0; codeIndex < answerCodes.length; ++codeIndex) {
                let currentAnswer = this.currentAnswers.find((ca) =>
                    ca.partIndex == partIndex &&
                    ca.setIndex == setIndex &&
                    ca.answerCode == answerCodes[codeIndex]
                );
                currentAnswer.isInvalid = false;
              }               
            }
          }
          if (
            acceptedSets.length !=
            this.question.parts[partIndex].requiredRepeats
          ) {
            allCorrect = false;
          } 
        }
      }

      if (allCorrect) {
        points = totalPoints;
      } else {
        if (this.question.allowPartialScoring) {
          points = partialPoints;
        } else {
          points = 0;
        }
      }
      return {
        allCorrect,
        studentAnswers: this.currentAnswers,
        points,
        totalPoints,
      };
    },

    findMatchingSet(
      answerSets,
      answers,
      caseSensitive,
      ignoreSpaces,
      ignoreHyphens,
      ignoreCommas,
      matchInAnyOrder
    ) {
      const localAnswerSets = structuredClone(answerSets);

      const normalize = (value) => {
        let result = value.toString();
        if (!caseSensitive) result = result.toLowerCase();
        if (ignoreSpaces) {
          result = result.replace(/\s+/g, "");
        }
        if (ignoreHyphens) {
          result = result.replace(/-/g, " ");
        }
        if (ignoreCommas) {
          result = result.replace(/,/g, "");
        }
        return result;
      };

      if (matchInAnyOrder) {
        for (let i = 0; i < localAnswerSets.length; i++) {
          let answerSet = localAnswerSets[i].slice(); // Create a copy of the current answer set
          let allMatch = true;

          for (let j = 0; j < answers.length; j++) {
            let normalizedAnswer = normalize(answers[j]);
            let matchFound = false;

            for (let k = 0; k < answerSet.length; k++) {
              for (let l = 0; l < answerSet[k].length; l++) {
                let possibleAnswer = normalize(answerSet[k][l]);

                if (possibleAnswer == normalizedAnswer) {
                  matchFound = true;
                  answerSet.splice(k, 1); // Remove the matched sub-array
                  break; // Stop checking the rest of this sub-array
                }
              }
              if (matchFound) break; // Move to the next answer if a match is found
            }

            if (!matchFound) {
              allMatch = false;
              break; // No match found, stop checking further
            }
          }

          if (allMatch) return answerSets[i]; // All answers matched
        }
        return null; // No match found in any answer set
      } else {
        // Exact order must match
        for (let i = 0; i < localAnswerSets.length; i++) {
          let answerSet = localAnswerSets[i];
          let allMatch = true;

          if (answerSet.length !== answers.length) {
            continue; // Skip sets with different lengths
          }

          for (let j = 0; j < answers.length; j++) {
            let normalizedAnswer = normalize(answers[j]);
            let matchFound = false;

            for (let l = 0; l < answerSet[j].length; l++) {
              let possibleAnswer = normalize(answerSet[j][l]);

              if (possibleAnswer == normalizedAnswer) {
                matchFound = true;
                break; // Stop checking this specific index if a match is found
              }
            }

            if (!matchFound) {
              allMatch = false;
              break; // No match for this specific answer, stop checking further
            }
          }

          if (allMatch) return answerSets[i]; // Exact match found
        }

        return null; // No exact matches found
      }
    },

    getUniqueAllowedAnswers(question) {
      const uniqueAllowedAnswers = new Set();

      question.parts.forEach((part) => {
        if (part.answerKeys && part.answerKeys.length > 0) {
          part.answerKeys.forEach((answerKey) => {
            if (
              answerKey.allowedAnswers &&
              answerKey.allowedAnswers.length > 0
            ) {
              answerKey.allowedAnswers.forEach((answerSet) => {
                answerSet.forEach((possibleAnswers) => {
                  possibleAnswers.forEach((answer) => {
                    if (answer.trim() !== "") {
                      // Check if the answer is non-empty
                      uniqueAllowedAnswers.add(answer);
                    }
                  });
                });
              });
            }
          });
        }
      });

      return Array.from(uniqueAllowedAnswers);
    },

    getMaxLengthForAllowedAnswers(partIndex, keyIndex) {
      let maxLength = 0;
      if (this.question.parts[partIndex].answerKeys[keyIndex].allowedAnswers) {
        const answerLengths = this.question.parts[partIndex].answerKeys[
          keyIndex
        ].allowedAnswers
          .flat(2)
          .map((elem) => elem.toString().length);

        maxLength = Math.max(...answerLengths);
      }
      return maxLength;
    },

    getTotalLengthForAllowedAnswers(partIndex, keyIndex) {
      let totalLength = 0;
      if (this.question.parts[partIndex].answerKeys[keyIndex].allowedAnswers) {
        const answerLengths = this.question.parts[partIndex].answerKeys[
          keyIndex
        ].allowedAnswers
          .flat(2)
          .map((elem) => elem.toString().length);
        totalLength = answerLengths.reduce((acc, curr) => acc + curr, 0);
      }
      return totalLength;
    },

    getUniqueAnswerCodes(question) {
      const uniqueAnswerCodes = new Set();

      question.parts.forEach((part) => {
        if (part.answerKeys && part.answerKeys.length > 0) {
          part.answerKeys.forEach((answerKey) => {
            let answerCodes = answerKey.answerCodes;
            answerCodes.forEach((answerCode) => {
              uniqueAnswerCodes.add(answerCode);
            });
          });
        }
      });

      return Array.from(uniqueAnswerCodes);
    },

    getAllElements(answerCodes) {
      let allElements = [];
      const mainDiv = document.querySelector("#" + this.id);

      answerCodes.forEach((ac) => {
        let elems = mainDiv.querySelectorAll("[answer-code='" + ac + "']");
        allElements.push(...elems);
      });
      return allElements;
    },

    getPartSetForElem(elem) {
      let currentElement = elem;

      // Traverse up the DOM until you find a div with the class 'part-set'
      while (currentElement) {
        if (
          currentElement.tagName === "DIV" &&
          currentElement.classList.contains("part-set")
        ) {
          return {
            partIndex: currentElement.getAttribute("part-index"),
            setIndex: currentElement.getAttribute("set-index"),
          }; // Return the div with the class 'part-set'
        }
        currentElement = currentElement.parentElement; // Move to the parent node
      }

      return null; // Return null if no parent with class 'part-set' is found
    },

    firstEmptyAnswerEntry() {
      return this.currentAnswers.find((a) => a.value == "");
    },
  },
};
</script>
<style scoped>
#extraOptionsShownMsg {
  padding-bottom: 10px;
  display: block;
}

::v-deep .hidden {
  display: none !important; /* Ensures the element is hidden regardless of other styles */
}

::v-deep .form-control:disabled {
  padding-right: 50px !important;
}
</style>