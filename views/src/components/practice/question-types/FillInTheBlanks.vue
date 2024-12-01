<script>
import BaseQuestionComponent from "./BaseQuestionComponent.vue";

// All input elements embedded in this.question.parts[partIndex].content must have an attribute answer-code
// which ties to the answer-code in the answerKeys. If one input field ties to multiple answer-codes, they must
// be separated by " ". For e.g., answer-code="abhy vyrd"

export default {
  extends: BaseQuestionComponent,

  data() {
    return {
      defaultInputType: "INPUT",
      initialAnswerValue: "",
    };
  },

  methods: {
    autogenerateContent(partIndex, setIndex) {
      // Generates HTML for input blanks from the answerKeys in the given question part for a single set
      // setIndex is simply added to the generated output if required for this particular question

      // All the information required to generate the content for the part of the question is available in
      // the question.parts["partIndex"].answerKeys. So, we iterate over the answerKeys to generate the HTML
      // content

      let answerKeys = this.question.parts[partIndex].answerKeys;
      if (!answerKeys || answerKeys.length == 0) return;

      let content = `<div class='answer-set'>`;
      if (this.question.parts[partIndex].displayRepeatCount) {
        content += `<div class='set-index-div'>${setIndex + 1}</div>`;
      }

      for (let keyIndex = 0; keyIndex < answerKeys.length; ++keyIndex) {
        let inputType =
          this.question.parts[partIndex].answerKeys[keyIndex].inputType ||
          this.defaultInputType;
        let inputWidth =
          this.question.parts[partIndex].answerKeys[keyIndex].inputWidth ||
          "auto";
        let inputHeight =
          this.question.parts[partIndex].answerKeys[keyIndex].inputHeight ||
          "auto";
        let inputColumnGap =
          this.question.parts[partIndex].answerKeys[keyIndex].inputColumnGap ||
          "10px";
        let maxlength;

        if (inputWidth == "auto") {
          if (inputType == "INPUT" || inputType == "CONTENT_EDITABLE_DIV") {
            inputWidth = this.getMaxLengthForAllowedAnswers(
              partIndex,
              keyIndex
            );
          } else {
            if (inputType == "COMBINED_INPUT") {
              inputWidth = this.getTotalLengthForAllowedAnswers(
                partIndex,
                keyIndex
              );
            }
          }
          inputWidth = Math.max(1.1 * inputWidth, 5);
          maxlength = inputWidth + 20;
          inputWidth = inputWidth + 10 + "ch"; // account for padding --- TODO a better way
        }

        let answerCodes = answerKeys[keyIndex].answerCodes;
        let commonAttributes = `input-type='${inputType}' maxlength='${maxlength}' style='display:inline-block;width:${inputWidth};height:${inputHeight};margin-right:${inputColumnGap}'`;

        if (inputType == "INPUT") {
          answerCodes.forEach((ac) => {
            content += `<input type='text' class='form-control' ${commonAttributes} answer-code='${ac}'/>`;
          });
          content += answerKeys[keyIndex].answerUnit || "";
        }

        if (inputType == "CONTENT_EDITABLE_DIV") {
          answerCodes.forEach((ac) => {
            content += `<div contenteditable='true' ${commonAttributes} answer-code='${ac}'/>`;
          });
          content += answerKeys[keyIndex].answerUnit || "";
        }

        if (inputType == "COMBINED_INPUT") {
          let combinedAnswerCodes = answerCodes.join(" ");

          content += `<input type='text' class='form-control' ${commonAttributes} answer-code='${combinedAnswerCodes}'/>`;
          content += answerKeys[keyIndex].answerUnit || "";
        }
      }
      content += "</div>";
      return content;
    },

    autogenerateExplanation(partIndex) {
      // Generates HTML for input blanks from the answerKeys in the given question part
      // setIndex is simply added to the generated output if required for this particular question

      let content = "";
      let answerKeys = this.question.parts[partIndex].answerKeys;
      if (!answerKeys || answerKeys.length == 0) return;

      for (let keyIndex = 0; keyIndex < answerKeys.length; ++keyIndex) {
        content += "<div>" + answerKeys[keyIndex].answerExplanation + "</div>";
      }
      return content;
    },

    enableUserInteraction() {
      let inputElements = document.querySelectorAll(`#${this.id} input`);
      inputElements.forEach((input) => {
        input.addEventListener("change", (event) => {
          this.handleChange(event, event.target.value);
        });
      });

      inputElements = document.querySelectorAll(
        `#${this.id} [contentEditable="true"]`
      );
      inputElements.forEach((input) => {
        input.addEventListener("blur", (event) => {
          this.handleChange(event, event.target.innerHTML);
        });
      });
    },

    disableUserInteraction() {
      // Select all input elements and contentEditable elements inside the component
      let inputElements = document.querySelectorAll(
        `#${this.id} input:not([disabled]), #${this.id} [contentEditable="true"]`
      );

      inputElements.forEach((input) => {
        if (input.tagName === "INPUT") {
          // Disable input elements
          input.disabled = true;
        } else if (input.hasAttribute("contentEditable")) {
          // Disable contentEditable elements by removing their editability
          input.setAttribute("contentEditable", "false");
          input.style.pointerEvents = "none"; // Optional: Prevent interaction
        }
      });
    },

    incompleteSubmission() {
      const inputElements = document.querySelectorAll(
        `#${this.id} input:not([disabled]):not([readonly]), #${this.id} [contentEditable="true"]:not([disabled])`
      );
      for (let idx = 0; idx < inputElements.length; ++idx) {
        let input = inputElements[idx];
        if (input.hasAttribute("contenteditable")) {
          if (input.innerHTML == "") return true;
        } else {
          if (input.value == "") return true;
        }
      }
      return false;
    },

    handleChange(event, newValue) {
      document.getElementById("clickSound").play();

      let inputElement = event.target;
      let response = this.getPartSetForElem(inputElement);
      if (!response) return; // TODO : Should not happen, throw an error

      let partIndex = response.partIndex;
      let setIndex = response.setIndex;
      let answerCode = inputElement.getAttribute("answer-code");
      let answerCodes = answerCode.split(" ");
      let inputType = inputElement.getAttribute("input-type");
      if (inputType == "COMBINED_INPUT") {
        let answerValues = newValue.split(" ");
        for (let idx = 0; idx < answerCodes.length; ++idx) {
          if (idx < answerValues.length) {
            this.answerChanged(
              partIndex,
              setIndex,
              answerCodes[idx],
              answerValues[idx]
            );
          }
        }
      } else {
        let answerValue = newValue;
        this.answerChanged(partIndex, setIndex, answerCodes[0], answerValue);
      }
    },

    focusFirstInput() {
      // Query for the first non-disabled, non-readonly input or contentEditable div within the component
      const firstElement = document.querySelector(
        `#${this.id} input:not([disabled]):not([readonly]), #${this.id} [contentEditable="true"]:not([disabled])`
      );
      // If an element is found, focus on it
      if (firstElement) {
        firstElement.focus();
      }
    },

    fillAnswers(answers) {
      const inputElements = document.querySelectorAll(
        `#${this.id} input, #${this.id} [contenteditable]`
      );

      for (let idx = 0; idx < inputElements.length; ++idx) {
        let input = inputElements[idx];
        let response = this.getPartSetForElem(input);
        if (response == null) continue;
        let { partIndex, setIndex } = response;
        let answerCode = input.getAttribute("answer-code");
        let isInvalid = false;
        let currentAnswer;

        let answerCodes = answerCode.split(" ");
        let value = "";
        answerCodes.forEach((ac) => {
          currentAnswer = answers.find(
            (ca) =>
              ca.partIndex == partIndex &&
              ca.setIndex == setIndex &&
              ca.answerCode == ac
          );
          value += currentAnswer.value + " ";
          if (currentAnswer.isInvalid) isInvalid = true;
        });
        value = value.trim();
        if (input.hasAttribute("contenteditable")) {
          input.innerHTML = value;
        } else {
          input.value = value;
        }

        if (this.show == "STUDENT_ANSWERS") {
          let inputType = input.getAttribute("input-type");
          if (isInvalid) {
            if (!(currentAnswer.partOfGroup && inputType != "COMBINED_INPUT")) {
              input.classList.add("is-invalid");
            } else {
              const answerDiv = document.querySelector(
                "#" + this.id + "-part-" + partIndex + "-" + setIndex
              );
              answerDiv.classList.add("is-invalid");
            }
          } else {
            if (!(currentAnswer.partOfGroup && inputType != "COMBINED_INPUT")) {
              input.classList.add("is-valid");
            } else {
              const answerDiv = document.querySelector(
                "#" + this.id + "-part-" + partIndex + "-" + setIndex
              );
              answerDiv.classList.add("is-valid");
            }
          }
        }
      }
    },
  },
};
</script>
<style scoped>
::v-deep .answer-set {
  margin: 5px;
}

::v-deep .set-index-div {
  display: inline-block;
  text-align: center;
  line-height: 30px;
  vertical-align: middle;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #333333;
  color: white;
  margin-right: 10px;
}
</style>