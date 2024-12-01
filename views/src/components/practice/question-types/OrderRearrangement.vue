<script>
import BaseQuestionComponent from "./BaseQuestionComponent.vue";
// A limitation - order rearrangement can not be repeatable

export default {
  extends: BaseQuestionComponent,

  data() {
    return {
      draggedIndex: -1,
      floatingElem: null,
      initialAnswerValue: "INITIAL_ANSWERS",
    };
  },

  methods: {
    // In case of Order Rearrangement, the draggable element as well as the droppable element is the same
    // unlike DragAndDrop.vue, where draggable elements are dropped onto droppable zones

    // We call these elements Orderable

    orderableContainer(partIndex, answerCode) {
      let CSS = this.question.parts[partIndex].answerInputCSS || "";
      return `<div class="answer-option orderable ${CSS}" answer-code="${answerCode}"></div>`;
    },

    orderableContent(partIndex, answerCode, answerContent) {
      // the content is put in a div with class answer-option so that adjustOptionsWidth works correctly
      return `<div class="answer-option" answer-code="${answerCode}">${answerContent}</div>`;
    },

    // Generate empty orderable containers
    // fillAnswers will fill the initial values in these containers based on this.currentAnswers when page is mounted

    autogenerateContent(partIndex) {
      let answerKeys = this.question.parts[partIndex]?.answerKeys;
      if (!answerKeys) return;

      let content = `<div class="option-grid ${
        this.question.parts[partIndex].answerGridCSS || "default-grid"
      }"
        style="grid-template-columns: repeat(auto-fit, auto);"
        answer-keys-per-row="${this.question.parts[partIndex].answerKeysPerRow}"
      >`;
      for (let keyIdx = 0; keyIdx < answerKeys.length; ++keyIdx) {
        let answerKey = answerKeys[keyIdx];
        if (!answerKey?.allowedAnswers) continue;
        let answerCodes = answerKey.answerCodes;
        for (let codeIndex = 0; codeIndex < answerCodes.length; ++codeIndex) {
          let answerCode = answerCodes[codeIndex];
          content += this.orderableContainer(partIndex, answerCode);
        }
      }
      content += "</div>";
      return content;
    },

    extractAnswerContent(question) {
      let result = {};
      question.parts.forEach((part) => {
        if (part.answerKeys) {
          part.answerKeys.forEach((answerKey) => {
            if (answerKey.content) {
              result[answerKey.answerCodes] = answerKey.content;
            }
          });
        }
      });
      return result;
    },

    fillAnswers(answers) {
      const answerContent = this.extractAnswerContent(this.question);
      answers.forEach((ac) => {
        const answerSetDiv = document.querySelector(
          `#${this.id}-part-${ac.partIndex}-${ac.setIndex}`
        );
        const elem = answerSetDiv.querySelector(
          `[answer-code='${ac.answerCode}']`
        );
        if (ac.value) {
          elem.innerHTML = this.orderableContent(
            ac.partIndex,
            ac.value,
            answerContent[ac.value]
          );
        } else {
          elem.innerHTML = "";
        }
      });
    },

    getAllOrderables() {
      return document.querySelectorAll(`#${this.id} .orderable`);
    },

    enableUserInteraction() {
      const orderables = this.getAllOrderables();

      orderables.forEach((elem) => {
        elem.setAttribute("draggable", true);
        elem.addEventListener("dragstart", (event) => {
          this.onDragStart(event, elem);
        });
        elem.addEventListener("dragend", (event) => {
          this.onDragEnd(event, elem);
        });
        elem.addEventListener("dragover", (event) => {
          event.preventDefault();
        });
        elem.addEventListener("drop", (event) => {
          this.onDrop(event, elem);
        });
        elem.addEventListener("touchstart", (event) =>
          this.onTouchStart(event, elem)
        );
        elem.addEventListener("touchend", (event) =>
          this.onTouchEnd(event, elem)
        );
        elem.addEventListener("touchmove", (event) =>
          this.onTouchMove(event, elem)
        );
      });
    },

    moveOption(partIndex, fromIndex, toIndex) {
      // If the indices are the same, no need to move anything
      if (fromIndex === toIndex) return;

      let answers = this.currentAnswers.filter((ca) => {
        return ca.partIndex == partIndex && ca.setIndex == 0;
      });

      if (fromIndex > toIndex) {
        // Right shift: move from a higher index to a lower index
        const temp = answers[fromIndex].value; // Store the value at fromIndex

        // Shift all elements between toIndex and fromIndex to the right
        for (let i = fromIndex; i > toIndex; i--) {
          answers[i].value = answers[i - 1].value;
        }

        // Set the value of toIndex to what was at fromIndex
        answers[toIndex].value = temp;
      } else {
        // Left shift: move from a lower index to a higher index
        const temp = answers[fromIndex].value; // Store the value at fromIndex

        // Shift all elements between fromIndex and toIndex to the left
        for (let i = fromIndex; i < toIndex; i++) {
          answers[i].value = answers[i + 1].value;
        }

        // Set the value of toIndex to what was at fromIndex
        answers[toIndex].value = temp;
      }
    },

    getIndexForAnswerCode(elem) {
      let answerCode = elem.getAttribute("answer-code");
      let response = this.getPartSetForElem(elem);
      let { partIndex } = response;
      return this.currentAnswers.findIndex((ca) => {
        return (
          ca.partIndex == partIndex &&
          ca.setIndex == 0 &&
          ca.answerCode == answerCode
        );
      });
    },

    onDragStart(event, elem) {
      if (elem.classList.contains("orderable")) {
        this.draggedIndex = this.getIndexForAnswerCode(elem);
      }
    },

    onDrop(event, elem) {
      if (this.draggedIndex == -1) return;
      if (elem.classList.contains("orderable")) {
        let droppedIndex = this.getIndexForAnswerCode(elem);
        if (droppedIndex > -1) {
          let response = this.getPartSetForElem(elem);
          let { partIndex } = response;
          this.moveOption(partIndex, this.draggedIndex, droppedIndex);
        }
        this.draggedIndex = -1;
      }
    },

    onDragEnd() {
      this.draggedIndex = -1;
    },

    applyComputedStyles(sourceElem, targetElem) {
      const computedStyles = window.getComputedStyle(sourceElem);
      for (let key of computedStyles) {
        targetElem.style[key] = computedStyles.getPropertyValue(key);
      }
    },

    createFloatingElem(elem, x, y) {
      this.floatingElem = elem.cloneNode(true);
      this.floatingElem.classList.add("floating-drag");
      this.applyComputedStyles(elem, this.floatingElem);
      this.floatingElem.style.position = "absolute";
      this.floatingElem.style.pointerEvents = "none";
      document.body.appendChild(this.floatingElem);
      this.updateFloatingElemPosition(x, y);
    },

    removeFloatingElem() {
      // Remove the floating element
      if (this.floatingElem) {
        document.body.removeChild(this.floatingElem);
        this.floatingElem = null;
      }
    },

    onTouchStart(event, elem) {
      if (elem.classList.contains("orderable")) {
        this.draggedIndex = this.getIndexForAnswerCode(elem);
        const touch = event.touches[0];
        this.createFloatingElem(elem, touch.clientX, touch.clientY);
      }
    },

    onTouchMove(event) {
      event.preventDefault();
      if (this.floatingElem) {
        const touch = event.touches[0];
        this.updateFloatingElemPosition(touch.clientX, touch.clientY);
      }
    },

    updateFloatingElemPosition(x, y) {
      const rect = this.floatingElem.getBoundingClientRect(); // Get the floating element's dimensions
      const elemWidth = rect.width;
      const elemHeight = rect.height;

      // Center the floating element at the touch position
      this.floatingElem.style.position = "absolute";
      this.floatingElem.style.left = x - elemWidth / 2 + "px";
      this.floatingElem.style.top = y - elemHeight / 2 + "px";
      this.floatingElem.style.pointerEvents = "none"; // Ensure the floating element does not interfere with other events
    },

    onTouchEnd(event) {
      // This event is only triggered when an element (this.activeDraggable) that was being dragged
      // by touch is dropped anywhere

      if (this.draggedIndex == -1) return;
      const touch = event.changedTouches[0];
      let elem = this.droppableElem(touch.clientX, touch.clientY);
      if (elem) {
        let droppedIndex = this.getIndexForAnswerCode(elem);

        if (droppedIndex > -1) {
          let response = this.getPartSetForElem(elem);
          let { partIndex } = response;
          this.moveOption(partIndex, this.draggedIndex, droppedIndex);
        }
      }
      this.removeFloatingElem();
      this.draggedIndex = -1;
    },

    droppableElem(dropX, dropY) {
      const droppables = this.getAllOrderables();

      for (let idx = 0; idx < droppables.length; ++idx) {
        let elem = droppables[idx];
        const dropzoneRect = elem.getBoundingClientRect();
        if (
          dropX > dropzoneRect.left &&
          dropX < dropzoneRect.right &&
          dropY > dropzoneRect.top &&
          dropY < dropzoneRect.bottom
        ) {
          return elem;
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.floating-drag {
  pointer-events: none; /* Ensure it doesn't block interaction */
}

::v-deep .orderable {
  border: 2px solid #b7e7fb;
  padding: 0px;
  cursor: pointer;
  border-radius: 8px;
  text-align: center;
}
</style>
