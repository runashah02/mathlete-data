<script>
import BaseQuestionComponent from "./BaseQuestionComponent.vue";

export default {
  extends: BaseQuestionComponent,

  data() {
    return {
      firstEmptyDroppable: null,
      activeDraggable: null,
      activeDroppable: null,
      floatingElem: null,
      dropInsideDroppable: false,
    };
  },

  watch: {
    currentAnswers: {
      handler() {
        this.firstEmptyDroppable = this.getFirstEmptyDroppable();
        if (this.question.transferType == "MOVE") {
          this.styleDraggablesAsEmpty();
        }
      },
      deep: true,
    },

    firstEmptyDroppable: {
      handler() {
        if (this.question.firstEmptyDroppableClass) {
          const droppables = this.getAllDroppables(this.question);
          droppables.forEach((elem) => {
            elem.classList.remove(this.question.firstEmptyDroppableClass);
          });

          if (this.firstEmptyDroppable) {
            this.firstEmptyDroppable.classList.add(
              this.question.firstEmptyDroppableClass
            );
          }
        }
      },
    },
  },

  methods: {
    styleDraggablesAsEmpty() {
      let draggables = this.getAllDraggables(this.question);
      let usedDraggableCodes = this.currentAnswers
        .filter((ca) => ca.value !== "")
        .map((ca) => ca.value);

      draggables.forEach((draggable) => {
        if (!draggable.parentNode.classList.contains("droppable")) {
          let draggableCode = draggable.getAttribute("answer-code");
          if (usedDraggableCodes.includes(draggableCode)) {
            draggable.style.opacity = "0.5";
          } else {
            draggable.style.opacity = "1"; // Reset the opacity for unused draggables
          }
        }
      });
    },

    getFirstEmptyDroppable() {
      if (this.show != "QUESTION") return null;
      const answerEntry = this.firstEmptyAnswerEntry();
      if (answerEntry) {
        const answerSetDiv = document.querySelector(
          `#${this.id}-part-${answerEntry.partIndex}-${answerEntry.setIndex}`
        );
        return answerSetDiv.querySelector(
          `[answer-code='${answerEntry.answerCode}']`
        );
      } else {
        return null;
      }
    },

    makeDraggable(partIndex, answerCode, answerContent) {
      let CSS =
        this.question.parts[partIndex].answerOptionCSS || "default-draggable";
      return `<div
          class="answer-option ${CSS} draggable" answer-code="${answerCode}">${answerContent}</div>`;
    },

    makeDroppable(partIndex, answerCode) {
      let CSS = this.question.parts[partIndex].answerInputCSS || "droppable";
      return `<div
          class="answer-option ${CSS} droppable" answer-code="${answerCode}"></div>`;
    },

    autogenerateContent(partIndex) {
      let content = `<div class="option-grid ${
        this.question.parts[partIndex].answerGridCSS || "default-grid"
      }"
        style="grid-template-columns: repeat(auto-fit, auto);"
        answer-keys-per-row="${this.question.parts[partIndex].answerKeysPerRow}"
      >`;
      let answerKeys = this.question.parts[partIndex].answerKeys;
      for (let keyIdx = 0; keyIdx < answerKeys.length; ++keyIdx) {
        let answerKey = answerKeys[keyIdx];
        let elementType = answerKey.allowedAnswers ? "droppable" : "draggable";

        if (elementType == "droppable") {
          content += `<div><div class="drop-area-label">
          ${answerKey.dropAreaLabel}
          </div>
          <div class="drop-area" drop-zones-per-row=${answerKey.dropZonesPerRow} 
          style="display:grid;grid-template-columns:repeat(auto-fit, auto);">`;
        }
        let answerCodes = answerKey.answerCodes;
        for (let codeIndex = 0; codeIndex < answerCodes.length; ++codeIndex) {
          let answerCode = answerCodes[codeIndex];
          if (elementType == "droppable") {
            content += this.makeDroppable(partIndex, answerCode);
          } else {
            content += this.makeDraggable(
              partIndex,
              answerCode,
              answerKey.content
            );
          }
        }
        if (elementType == "droppable") {
          content += `</div></div>`;
        }
      }
      content += "</div>";
      return content;
    },

    getAllDraggableCodes(question) {
      // Every answercode that is an allowedAnswer to some other answercode must be a draggable
      let draggableCodes = this.getUniqueAllowedAnswers(question);
      return draggableCodes;
    },

    getAllDroppableCodes(question) {
      // Every answer code that has allowedAnswer must be droppable

      const uniqueAnswerCodes = new Set();
      question.parts.forEach((part) => {
        if (part.answerKeys && part.answerKeys.length > 0) {
          part.answerKeys.forEach((answerKey) => {
            if (
              answerKey.allowedAnswers &&
              answerKey.allowedAnswers.length > 0
            ) {
              let answerCodes = answerKey.answerCodes;
              answerCodes.forEach((answerCode) => {
                uniqueAnswerCodes.add(answerCode);
              });
            }
          });
        }
      });

      return Array.from(uniqueAnswerCodes);
    },

    getAllDraggables(question) {
      return this.getAllElements(this.getAllDraggableCodes(question));
    },

    getAllDroppables(question) {
      return this.getAllElements(this.getAllDroppableCodes(question));
    },

    enableUserInteraction() {
      const mainDiv = document.querySelector(`#${this.id}`);
      mainDiv.style.pointerEvents = "auto";

      let draggables = this.getAllDraggables(this.question);
      let droppables = this.getAllDroppables(this.question);

      //prettier-ignore
      draggables.forEach((elem) => {
        elem.classList.add ("draggable");
        elem.setAttribute ("draggable", true);
        elem.addEventListener("click", (event) => this.addToFirstEmptyDroppable(event, elem));
        elem.addEventListener("dragstart", (event) => this.onDragStart(event, elem));
        elem.addEventListener("dragend", (event) => this.onDragEnd(event, elem));
        elem.addEventListener("touchstart", (event) => this.onTouchStart(event, elem));
        elem.addEventListener("touchend", (event) => this.onTouchEnd(event, elem));
        elem.addEventListener("touchmove", (event) => this.onTouchMove(event, elem));
      });

      //prettier-ignore
      droppables.forEach((elem) => {
        elem.classList.add("droppable");
        elem.setAttribute ("draggable", true);
        elem.addEventListener("dragstart", (event) => this.onDragStart(event, elem));
        elem.addEventListener("dragend", (event) => this.onDragEnd(event, elem));
        elem.addEventListener("dragover", (event) => {event.preventDefault();});
        elem.addEventListener("drop", (event) => {event.preventDefault(); this.onDrop(event, elem);});
        elem.addEventListener("touchstart", (event) => this.onTouchStart(event, elem));
        elem.addEventListener("touchend", (event) => this.onTouchEnd(event, elem)); 
        elem.addEventListener("touchmove", (event) => this.onTouchMove(event, elem));
      });
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
      content += `<div style="margin-bottom:10px">${answerKey.answerExplanation}</div>`;
      return content;
    },

    extractAnswerContent(question) {
      let result = {};

      // Loop through each part of the question
      question.parts.forEach((part) => {
        if (part.answerKeys) {
          part.answerKeys.forEach((answerKey) => {
            // If content exists for the answerKey, add it to the result
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
          elem.innerHTML = this.makeDraggable(
            ac.partIndex,
            ac.value,
            answerContent[ac.value]
          );
        } else {
          elem.innerHTML = "";
        }
      });
    },

    addToFirstEmptyDroppable(event, draggable) {
      if (!this.firstEmptyDroppable) return;
      let response = this.getPartSetForElem(this.firstEmptyDroppable);
      if (!response) return;
      let { partIndex, setIndex } = response;
      let answerCode = this.firstEmptyDroppable.getAttribute("answer-code");
      let value = draggable.getAttribute("answer-code");
      this.answerChanged(partIndex, setIndex, answerCode, value);
    },

    onDragStart(event, elem) {
      // This event will be triggered when an element inside the draggable or the droppable is dragged
      // by a mouse. The elem is the element being dragged

      this.activeDraggable = elem;
      this.dropInsideDroppable = false;
    },

    onDrop(event, elem) {
      // This event is only triggered when an element (this.activeDraggable) that was being dragged
      // is dropped into a droppable.

      // The elem is the element into which the draggable is dropped

      if (!(elem && this.activeDraggable)) return;
      this.dropInsideDroppable = true;
      let response = this.getPartSetForElem(elem);
      if (!response) return;
      let { partIndex, setIndex } = response;
      let answerCode = elem.getAttribute("answer-code");

      if (this.activeDraggable.classList.contains("draggable")) {
        let value = this.activeDraggable.getAttribute("answer-code");
        this.answerChanged(partIndex, setIndex, answerCode, value);
      } else {
        // The activeDraggable is actually a droppable that is temporarily filled by an answer

        let actualDraggable = this.activeDraggable.firstElementChild;
        let value = actualDraggable.getAttribute("answer-code");

        // Clear the activeDraggable - TODO: Find partIndex, setIndex of actual droppable
        this.answerChanged(
          partIndex,
          setIndex,
          this.activeDraggable.getAttribute("answer-code"),
          ""
        );

        // Add the activeDraggable to the new droppable
        this.answerChanged(partIndex, setIndex, answerCode, value);
      }
    },

    allowDrop(event) {
      event.preventDefault(); // Enable dropping
    },

    onDragEnd() {
      // This event is triggered whether dropped inside a droppable or dropped anywhere outside

      if (!this.dropInsideDroppable) {
        if (this.activeDraggable.classList.contains("droppable")) {
          let response = this.getPartSetForElem(this.activeDraggable);
          if (!response) return;
          let { partIndex, setIndex } = response;

          this.answerChanged(
            partIndex,
            setIndex,
            this.activeDraggable.getAttribute("answer-code"),
            ""
          );
        }
        this.activeDraggable = null;
      }
    },

    onTouchStart(event, elem) {
      // This event will be triggered when an element inside the draggable or the droppable is dragged
      // by touch. The elem is the element being dragged

      if (elem.classList.contains("droppable") && !elem.firstElementChild)
        return;

      this.activeDraggable = elem;
      this.dropInsideDroppable = false;

      // Clone the element being dragged
      this.floatingElement = elem.cloneNode(true); // true for deep copy (including child elements)
      this.floatingElement.classList.add("floating-drag"); // Add a specific class for styling
      this.floatingElement.style.position = "absolute"; // Make sure it's absolutely positioned
      this.floatingElement.style.pointerEvents = "none"; // Ensure the floating element does not interfere with other events

      // Append the cloned element to the document body
      document.body.appendChild(this.floatingElement);

      // Position the floating element at the initial touch point
      const touch = event.touches[0];
      this.updateFloatingElementPosition(touch.clientX, touch.clientY);
    },

    onTouchMove(event) {
      event.preventDefault();
      if (this.floatingElement) {
        const touch = event.touches[0];
        this.updateFloatingElementPosition(touch.clientX, touch.clientY);
      }
    },

    updateFloatingElementPosition(x, y) {
      const rect = this.floatingElement.getBoundingClientRect(); // Get the floating element's dimensions
      const elementWidth = rect.width;
      const elementHeight = rect.height;

      // Center the floating element at the touch position
      this.floatingElement.style.position = "absolute";
      this.floatingElement.style.left = x - elementWidth / 2 + "px";
      this.floatingElement.style.top = y - elementHeight / 2 + "px";
      this.floatingElement.style.pointerEvents = "none"; // Ensure the floating element does not interfere with other events
    },

    onTouchEnd(event) {
      // This event is only triggered when an element (this.activeDraggable) that was being dragged
      // by touch is dropped anywhere

      if (!this.activeDraggable) return;

      const touch = event.changedTouches[0];
      let droppable = this.droppableElem(touch.clientX, touch.clientY);

      const draggedFromDropZone =
        this.activeDraggable.classList.contains("droppable");
      if (droppable) {
        if (draggedFromDropZone) {
          // Moving from one drop zone to another dropzone

          let fromDroppable = this.activeDraggable;
          let toDroppable = droppable;
          let actualDraggable = this.activeDraggable.firstElementChild;

          let response = this.getPartSetForElem(fromDroppable);
          let fromPartIndex = response["partIndex"];
          let fromSetIndex = response["setIndex"];

          response = this.getPartSetForElem(toDroppable);
          let toPartIndex = response["partIndex"];
          let toSetIndex = response["setIndex"];

          this.answerChanged(
            fromPartIndex,
            fromSetIndex,
            fromDroppable.getAttribute("answer-code"),
            ""
          );
          this.answerChanged(
            toPartIndex,
            toSetIndex,
            toDroppable.getAttribute("answer-code"),
            actualDraggable.getAttribute("answer-code")
          );
        } else {
          // Moving from options to dropzone
          let actualDraggable = this.activeDraggable;
          let toDroppable = droppable;

          let response = this.getPartSetForElem(toDroppable);
          let toPartIndex = response["partIndex"];
          let toSetIndex = response["setIndex"];

          this.answerChanged(
            toPartIndex,
            toSetIndex,
            toDroppable.getAttribute("answer-code"),
            actualDraggable.getAttribute("answer-code")
          );
        }
      } else {
        if (draggedFromDropZone) {
          let fromDroppable = this.activeDraggable;

          let response = this.getPartSetForElem(fromDroppable);
          let fromPartIndex = response["partIndex"];
          let fromSetIndex = response["setIndex"];

          this.answerChanged(
            fromPartIndex,
            fromSetIndex,
            fromDroppable.getAttribute("answer-code"),
            ""
          );
        }
      }

      // Remove the floating element
      if (this.floatingElement) {
        document.body.removeChild(this.floatingElement);
        this.floatingElement = null;
      }
    },

    droppableElem(dropX, dropY) {
      const droppables = this.getAllDroppables(this.question);

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
/* Add some optional drag styles */
.interactive-grid-slot.dragging {
  border: 2px dashed #4394cc;
}
.interactive-grid-slot.dropzone {
  border: 2px solid #b7e7fb;
  min-height: 90px;
}
.draggable {
  opacity: 1 !important; /* Ensures the element remains fully opaque */
}

.draggable:active,
.draggable:focus {
  opacity: 1 !important; /* Optional: keep opacity intact when clicked or focused */
}

.draggable:drag {
  opacity: 1 !important; /* Override opacity reduction during drag */
}

.floating-drag {
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #b7e7fb;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  pointer-events: none; /* Ensure it doesn't block interaction */
}

::v-deep .drop-area {
  transition: "background-color 0.3s, border-color 0.3s";
  background-color: #ffffff;
  text-align: center;
}

::v-deep .droppable {
  border: 2px dotted transparent;
  padding: 0px;
  cursor: pointer;
  border-radius: 8px;
  transition: "background-color 0.3s, border-color 0.3s";
  background-color: #ffffff;
  border-color: #b7e7fb;
  text-align: center;
}

::v-deep .droppable:not(:empty) {
  border: none; /* Remove the border if the droppable is not empty */
  background-color: #ffffff;
}

::v-deep .draggable {
  border: 2px solid #b7e7fb;
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
}

::v-deep .drop-area-label {
  text-align: center;
  font-size: 1.2em;
  padding-bottom: 10px;
}
</style>
