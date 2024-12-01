<script>
import BaseQuestionComponent from "./BaseQuestionComponent.vue";

export default {
  extends: BaseQuestionComponent,

  data() {
    return {
      initialAnswerValue: "",
      focusInputIndex: 0,
    };
  },

  methods: {

    autogenerateContent(partIndex) {
      let content = `<div class="mt-8 option-grid ${
        this.question.parts[partIndex].answerGridCSS || "default-grid"
      }" answer-keys-per-row="${
        this.question.parts[partIndex].answerKeysPerRow
      }"
        style="grid-template-columns: repeat(auto-fit, auto);margin-top:10px"
      >`;
      let answerKeys = this.question.parts[partIndex].answerKeys;
      for (let keyIdx = 0; keyIdx < answerKeys.length; ++keyIdx) {
        let answerKey = answerKeys[keyIdx];
        let answerCode = answerKey.answerCodes[0];
        content += `<div
          class="answer-option ${
            this.question.parts[partIndex].answerInputCSS || "default-add-btn"
          }"
          answer-code="${answerCode}"
          click-times="${answerKey.clickTimes}"
        >`;
        if (this.question.parts[partIndex].showClickTimes) {
          content += `<span class="click-times-number" style="margin-right:10px">${
            answerKey.clickTimes || 1
          }</span>`;
        }
        content += `${answerKey.content}</div>`;
      }
      if (this.question.parts[partIndex].showDeleteButton) {
        content += `<div
          class="${
            this.question.parts[partIndex].answerInputCSS ||
            "default-delete-btn"
          } delete-last-in-btn" style="display:flex !important; align-items: center; justify-content: center;"
        >1 Erase</div>
  `;
      }
      content += "</div></div>";
      return content;
    },

    getAllDraggables(question) {
      const draggables = new Set();

      question.parts.forEach((part) => {
        if (part.answerKeys && part.answerKeys.length > 0) {
          part.answerKeys.forEach((answerKey) => {
            if (
              !(answerKey.allowedAnswers && answerKey.allowedAnswers.length > 0)
            ) {
              answerKey.answerCodes.forEach((ac) => {
                draggables.add(ac);
              });
            }
          });
        }
      });
      return Array.from(draggables);
    },

    enableUserInteraction() {
      const mainDiv = document.querySelector("#" + this.id);
      const draggables = this.getAllDraggables(this.question);
      draggables.forEach((ca) => {
        const options = mainDiv.querySelectorAll("[answer-code='" + ca + "']");
        if (!options) return;
        options.forEach((option) => {
          const clickTimes = option.getAttribute("click-times");
          option.addEventListener("click", () => {
            this.handleClick(option, ca, clickTimes);
          });
        });
      });

      const deleteLastInBtn = document.querySelector(".delete-last-in-btn");
      if (deleteLastInBtn) {
        deleteLastInBtn.addEventListener("click", () => {
          this.handleDeleteClick();
        });
      }
    },

    /*
    handleClick(answerCode, clickTimes) {
      this.addToDroppables(answerCode, clickTimes);
    },
*/

    handleClick(button, answerCode, clickTimes) {
      if (! this.question.showAnimation) {
        for (let i = 0; i < clickTimes; ++i) {
          this.addToDroppables(answerCode);
        }
        return;
      }
      for (let i = 0; i < clickTimes; ++i) {
        const targetEntry = this.focusInputEntry();
        if (button && targetEntry) {
          const insertContentSpan = button.querySelector(".insert-content");
          const answerSetDiv = document.querySelector(
            `#${this.id}-part-${targetEntry.partIndex}-${targetEntry.setIndex}`
          );
          const targetCell = answerSetDiv.querySelector(
            `[answer-code='${targetEntry.answerCode}']`
          );

          if (targetCell) {
            // Get positions
            const buttonRect = button.getBoundingClientRect();
            const cellRect = targetCell.getBoundingClientRect();

            // Create a temporary element
            const tempElement = document.createElement("div");
            tempElement.innerHTML = insertContentSpan.innerHTML;
            tempElement.style.position = "absolute";
            tempElement.style.left = `${buttonRect.left}px`;
            tempElement.style.top = `${buttonRect.top}px`;
            tempElement.style.width = `${buttonRect.width}px`;
            tempElement.style.height = `${buttonRect.height}px`;
            tempElement.style.transition = "all 0.5s ease";
            tempElement.style.zIndex = "9999"; // Ensure it's visible
            document.body.appendChild(tempElement);

            // Trigger animation
            requestAnimationFrame(() => {
              tempElement.style.left = `${cellRect.left}px`;
              tempElement.style.top = `${cellRect.top}px`;
              tempElement.style.transform = "scale(0.8)";
            });

            // Cleanup after animation and set value
            const onTransitionEnd = () => {
              if (document.body.contains(tempElement)) {
                document.body.removeChild(tempElement);
              }
              this.addToDroppables(answerCode);
              document.getElementById("clickSound").play();
            };

            tempElement.addEventListener("transitionend", onTransitionEnd, {
              once: true,
            });
          }
        }
      }
    },

    handleDeleteClick() {
      this.deleteLastIn();
    },

    disableUserInteraction() {
      const mainDiv = document.querySelector(`#${this.id}`);
      mainDiv.style.pointerEvents = "none";
    },

    focusInputEntry() {
      //return this.currentAnswers.find((a) => a.value == "");
      let entry = this.currentAnswers[this.focusInputIndex];
      return entry;
    },

    lastFilledEntryIndex() {
      const lastFilledIndex = this.currentAnswers
        .slice()
        .reverse()
        .findIndex((a) => a.value !== "");
      if (lastFilledIndex !== -1) {
        const reverseIndex = this.currentAnswers.length - 1 - lastFilledIndex;
        return reverseIndex;
      } else {
        return -1;
      }
    },

    lastFilledAnswerEntry() {
      const lastFilledIndex = this.currentAnswers
        .slice()
        .reverse()
        .findIndex((a) => a.value !== "");
      if (lastFilledIndex !== -1) {
        const reverseIndex = this.currentAnswers.length - 1 - lastFilledIndex;
        return this.currentAnswers[reverseIndex];
      } else {
        return null;
      }
    },

    addToDroppables(draggable) {
      let currentAnswer = this.focusInputEntry();
      this.focusInputIndex =
        (this.focusInputIndex + 1) % this.currentAnswers.length;
      if (currentAnswer) currentAnswer.value = draggable;
    },

    deleteLastIn() {
      let deleteEntry = this.lastFilledEntryIndex();
      if (deleteEntry >= 0) {
        let currentAnswer = this.lastFilledAnswerEntry();
        if (currentAnswer) currentAnswer.value = "";
        this.focusInputIndex = deleteEntry;
      }
    },

    extractAnswerContent(question) {
      let result = {};
      const parser = new DOMParser();

      question.parts.forEach((part) => {
        part.answerKeys.forEach((answerKey) => {
          if (answerKey.content) {
            const doc = parser.parseFromString(answerKey.content, "text/html");
            const span = doc.querySelector("span.insert-content");

            // If the <span> exists, use its innerHTML; otherwise, keep the original content
            result[answerKey.answerCodes] = span
              ? span.innerHTML.trim()
              : answerKey.content.trim();
          }
        });
      });

      return result;
    },

    fillAnswers(answers) {
      const answerContent = this.extractAnswerContent(this.question);
      answers.forEach((ac) => {
        const answerSetDiv = document.querySelector(
          `#${this.id}-part-${ac.partIndex}-${ac.setIndex}`
        );
        const input = answerSetDiv.querySelector(
          `[answer-code='${ac.answerCode}']`
        );
        if (input) {
          if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
            // For <input> or <textarea> elements, set the value
            input.value = ac.value ? answerContent[ac.value] : "";
          } else {
            // For other elements, use innerHTML
            input.innerHTML = ac.value ? answerContent[ac.value] : "";
          }
        }
      });
    },
  },
};
</script>

<style scoped>
::v-deep .default-add-btn {
  background-color: #b7e7fb;
  border-bottom: 2px solid #4394cc;
  border-radius: 4px;
  padding: 15px 25px;
  text-align: center;
  cursor: pointer;
}

::v-deep .default-delete-btn {
  background-color: lightgray;
  border-bottom: 2px solid darkgray;
  border-radius: 4px;
  padding: 15px 25px;
  text-align: center;
  cursor: pointer;
}

.temp-element {
  z-index: 1000;
  pointer-events: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>