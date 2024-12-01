<script>
import BaseQuestionComponent from "./BaseQuestionComponent.vue";

export default {
  extends: BaseQuestionComponent,

  data() {
    return {
      initialAnswerValue: 0,
    };
  },

  methods: {
    autogenerateContent(partIndex) {
      let content = "";
      let answerKeys = this.question.parts[partIndex]?.answerKeys;
      if (!answerKeys) return content;

      let optionsContainer =
        this.question.optionsContainer || "GRID";

      if (optionsContainer == "GRID") {
        content += `<div class="option-grid ${
          this.question.parts[partIndex].answerGridCSS || "default-grid"
        }"
        style="grid-template-columns: repeat(auto-fit, auto);"
        answer-keys-per-row="${
          this.question.parts[partIndex].answerKeysPerRow ||
          this.question.parts[partIndex].answerKeys.length
        }"
      >`;
      } else {
        if (optionsContainer == "FLEX") {
          content += `<div class="option-flex option-flex--${
            this.question.optionsDirection
          } ${this.question.parts[partIndex].answerGridCSS || "default-flex"}"
          answer-keys-per-row="1"
        >`;
        }
      }
      for (let keyIdx = 0; keyIdx < answerKeys.length; ++keyIdx) {
        let answerKey = answerKeys[keyIdx];
        let answerCode = answerKey.answerCodes[0];

        content += `<div
          class="answer-option ${
            this.question.parts[partIndex].answerInputCSS || "default-option"
          }"
          answer-code="${answerCode}"
        >${answerKey.content}</div>
  `;
      }
      content += "</div></div>";
      return content;
    },

    enableUserInteraction() {
      const mainDiv = document.querySelector("#" + this.id);
      this.currentAnswers.forEach((ca) => {
        const answerSetDiv = mainDiv.querySelector(
          "#" + this.id + "-part-" + ca.partIndex + "-" + ca.setIndex
        );
        const option = answerSetDiv.querySelector(
          "[answer-code='" + ca.answerCode + "']"
        );
        
        if (!option) return;
        option.addEventListener("click", () => {
          this.answerChanged(
            ca.partIndex,
            ca.setIndex,
            ca.answerCode,
            ca.value == 1 ? 0 : 1
          );
        });
      });
    },

    answerChanged(partIndex, setIndex, answerCode, newValue) {
      let currentAnswer = this.currentAnswers.find(
        (ca) =>
          ca.partIndex == partIndex &&
          ca.setIndex == setIndex &&
          ca.answerCode == answerCode
      );

      if (this.question.questionType != "MULTIPLE_SELECT") {
        this.currentAnswers
          .filter((ca) => ca.partIndex == partIndex && ca.setIndex == setIndex)
          .forEach((a) => {
            a.value = 0;
          });
      }

      currentAnswer.value = newValue;
    },

    autogenerateExplanation(partIndex, keyIndex) {
      // Generates HTML for input blanks from the answerKeys in the given question part
      // setIndex is simply added to the generated output if required for this particular question

      let content = "";
      let answerKeys = this.question.parts[partIndex].answerKeys;
      if (!answerKeys || answerKeys.length == 0) return;
      let answerKey = answerKeys[keyIndex];
      let answerCode = answerKey.answerCodes[0];

      if (!this.question.parts[partIndex].hideOptionInExplanation) {
        content += `<div
          class="answer-option ${
            this.question.parts[partIndex].answerInputCSS || "default-option"
          }"
          answer-code="${answerCode}"
        >${answerKey.content}</div>`;
      }
      content += `<div>${answerKey.answerExplanation}</div>`;
      return content;
    },

    disableUserInteraction() {
      const mainDiv = document.querySelector(`#${this.id}`);
      mainDiv.style.pointerEvents = "none";
    },

    focusFirstElement() {
      return;
    },

    incompleteSubmission() {
      return !this.currentAnswers.find((ca) => ca.value === 1);
    },

    fillAnswers(answers) {
      // Select, unselect options
      const mainDiv = document.querySelector("#" + this.id);
      answers.forEach((answer) => {
        const answerDiv = mainDiv.querySelector(
          "#" + this.id + "-part-" + answer.partIndex + "-" + answer.setIndex
        );
        const input = answerDiv.querySelector(
          `[answer-code='${answer.answerCode}']`
        );
        if (input) {
          //console.log (input);

          if (answer.value == 1) {
            input.classList.add("selected");
          } else {
            input.classList.remove("selected");
          }
        }
        if (this.show == "STUDENT_ANSWERS") {
          if (answer.partOfGroup) {
            const answerDiv = document.querySelector(
              "#" +
                this.id +
                "-part-" +
                answer.partIndex +
                "-" +
                answer.setIndex
            );

            if (answer.isInvalid) {
              answerDiv.classList.add("is-invalid");
            } else {
              answerDiv.classList.add("is-valid");
            }
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.option-grid {
  display: grid;
}

::v-deep .option-flex {
  display: flex;
}

::v-deep .option-flex--column {
  flex-direction: column;
  align-items: flex-start;
}

::v-deep .option-flex--row {
  flex-direction: row;
}

::v-deep .option-flex > div {
  display: inline;
  width: auto;
}

::v-deep .default-flex {
  gap: 10px;
}

.default-grid {
  gap: 10px;
}

.default-option {
  border: 2px solid transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: "background-color 0.3s, border-color 0.3s";
  background-color: #ffffff;
  border-color: #b7e7fb;
  text-align: center;
}

.default-option:hover {
  background-color: #b7e7fb;
  border-color: #4394cc;
}

.default-option.selected {
  background-color: #b7e7fb;
  border-color: #2e678e;
}
</style>