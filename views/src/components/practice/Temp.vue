<template>
  <div :id="id">
    <div v-if="question.exerciseStyles" v-html="styleTag"></div>
    <div class="question-card" v-if="show != 'EXPLANATION'">
      <div class="row question-stmt-row">
        <div class="col-12" v-html="question.questionStmt"></div>
      </div>
      <!-- Options -->

      <div class="row option-grid-row mt-3">
        <div class="col-12" :style="`max-width: ${gridWidth};`">
          <div
            :class="['option-grid', question.optionsGridStyleClass]"
            :style="`grid-template-columns: repeat(auto-fit, ${maxWidth});`"
          >
            <button
              v-for="option in question.answerOptions"
              :key="option.optionId"
              :data-name="option.optionId"
              v-html="option.optionContentPrepend + option.optionContent"
              type="button"
              :class="['answer-option', question.optionsStyleClass]"
            ></button>
            <button
              :class="['answer-option', question.optionsStyleClass]"
              type="button"
              @click="removeLastIn"
              v-if="question.removeLastInBtn"
            >
              <span style="margin-right: 20px">1</span
              ><img src="/assets/ux/delete.svg" width="60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//importing bootstrap 5, sitewide style sheets
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../../public/assets/styles.css";

export default {
  props: {
    id: {},
    question: {},
    show: {
      type: String,
      required: false,
      default: "QUESTION",
    },
    answers: {},
  },

  data() {
    return {
      currentAnswers: [],
      activeDroppable: null,
      activeDraggable: null,
      dropInsideDroppable: false,
    };
  },




 <template>
  <div :id="id">
    <div v-if="question.exerciseStyles" v-html="styleTag"></div>
    <div class="question-card" v-if="show != 'EXPLANATION'">
      <div class="row group-title-row" v-if="question.groupTitle">
        <div class="col-12" v-html="question.groupTitle"></div>
      </div>
      <div class="row question-stmt-row">
        <div class="col-12" v-html="question.questionStmt"></div>
      </div>
      <!-- Options -->
      <div class="row option-grid-row mt-8">
        <div class="col-12" :style="`max-width: ${gridWidth};`">
          <div
            :class="['option-grid', question.optionsGridStyleClass]"
            :style="`grid-template-columns: repeat(auto-fit, ${maxWidth});`"
          >
            <button
              v-for="option in question.answerOptions"
              :key="option.answerCode"
              :data-name="option.answerCode"
              v-html="option.optionContentPrepend + option.optionContent"
              type="button"
              :class="['answer-option', 'btn']"
              style="background-color:#b7e7fb;border-bottom:3px solid #4394cc"
            ></button>
            <button
              :class="['answer-option', 'btn']"
              type="button"
              @click="removeLastIn"
              style="background-color:lightgray;border-bottom:3px solid darkgray"
            >
              <span style="margin-right: 20px">1</span
              ><img src="/assets/ux/delete.svg" width="60" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div>
          <div class="col-12" v-html="question.answerExplanation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {},
    question: {},
    show: {
      type: String,
      required: false,
      default: "QUESTION",
    },
    answers: {},
  },

  watch: {
    currentAnswers: {
      handler() {
        this.fillAnswers(this.currentAnswers);
        this.activeDroppable = this.firstEmptyDroppable();
      },
      deep: true,
    },

    activeDroppable: {
      handler() {
        if (this.question.activeDroppableClass) {
          const mainDiv = document.querySelector("#" + this.id);
          const droppableDataNames = [
            ...new Set(this.question.answers.map((a) => a.answerCode)),
          ];
          droppableDataNames.forEach((ddn) => {
            let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
            elem.classList.remove(this.question.activeDroppableClass);
          });

          if (this.activeDroppable) {
            this.activeDroppable.classList.add(
              this.question.activeDroppableClass
            );
          }
        }
      },
    },
  },

  data() {
    return {
      maxWidth: "auto",
      gridWidth: "auto",
      currentAnswers: [],
      activeDroppable: null,
    };
  },

  mounted() {
    if (this.show === "QUESTION") {
      this.currentAnswers = this.question.answers.map((ac) => ({
        answerCode: ac.answerCode,
        answer: "",
      }));

      const mainDiv = document.querySelector("#" + this.id);
      const draggableDataNames = [
        ...new Set(this.question.answerOptions.map((ao) => ao.answerCode)),
      ];

      const droppableDataNames = [
        ...new Set(this.question.answers.map((a) => a.answerCode)),
      ];

      draggableDataNames.forEach((ddn) => {
        let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
        elem.classList.add("draggable");
        elem.addEventListener("click", () => this.addToActiveDroppable(elem));
      });
      droppableDataNames.forEach((ddn) => {
        let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
        elem.classList.add("droppable");
      });
    } else if (this.show === "CORRECT_ANSWERS") {
      const answers = this.question.answers.map((ac) => ({
        answerCode: ac.answerCode,
        answer: ac.allowedAnswers.length > 0 ? ac.allowedAnswers[0] : "",
      }));
      this.fillAnswers(answers);
    } else if (this.show === "STUDENT_ANSWERS") {
      this.fillAnswers(this.question.studentAnswers);
    } else if (this.show === "SUPPLIED_ANSWERS") {
      this.fillAnswers(this.answers);
    }
    this.setEqualWidth();
  },

  computed: {
    styleTag() {
      // Wrap the dynamic CSS inside a <style> tag
      return `<style>${this.question.exerciseStyles}</style>`;
    },
  },

  methods: {
    setAnswer(answerCode, answer) {
      const answerEntry = this.currentAnswers.find(
        (a) => a.answerCode == answerCode
      );
      if (answerEntry) {
        answerEntry.answer = answer;
      }
    },

    clearAnswer(answerCode) {
      const answerEntry = this.currentAnswers.find(
        (a) => a.answerCode == answerCode
      );
      if (answerEntry) {
        answerEntry.answer = "";
      }
    },

    firstEmptyAnswerEntry() {
      return this.currentAnswers.find((a) => a.answer == "");
    },

    firstEmptyDroppable() {
      const answerEntry = this.firstEmptyAnswerEntry();
      if (answerEntry) {
        const activeDroppableDN = answerEntry.answerCode;
        const mainDiv = document.querySelector("#" + this.id);

        return mainDiv.querySelector("[data-name='" + activeDroppableDN + "']");
      } else {
        return null;
      }
    },

    lastFilledAnswerEntry() {
      const lastFilledIndex = this.currentAnswers
        .slice()
        .reverse()
        .findIndex((a) => a.answer !== "");
      if (lastFilledIndex !== -1) {
        const reverseIndex = this.currentAnswers.length - 1 - lastFilledIndex;
        return this.currentAnswers[reverseIndex];
      } else {
        return null;
      }
    },

    checkAnswers() {
      let allCorrect = true;
      this.question.answers.forEach((ac) => {
        const allowedAnswers = ac.allowedAnswers;
        const studentAnswer = this.currentAnswers.find(
          (ca) => ca.answerCode === ac.answerCode
        ).answer;

        if (
          (allowedAnswers.length > 0 &&
            !allowedAnswers.includes(studentAnswer)) ||
          (allowedAnswers.length === 0 && studentAnswer !== "")
        ) {
          allCorrect = false;
        }
      });
      return { allCorrect, studentAnswers: this.currentAnswers };
    },

    fillAnswers(answers) {
      answers.forEach((ac) => {
        const mainDiv = document.querySelector("#" + this.id);
        const input = mainDiv.querySelector(`[data-name='${ac.answerCode}']`);
        if (ac.answer) {
          const content = this.question.answerOptions.find(
            (ao) => ao.answerCode === ac.answer
          ).optionContent;
          input.innerHTML = content;
        } else {
          input.innerHTML = "";
        }
      });
    },

    setEqualWidth() {
      const mainDiv = document.querySelector("#" + this.id);
      const options = mainDiv.querySelectorAll(".answer-option");
      let maxWidth = 0;
      let gridGap = 0;
      let optionBorderWidth = 0;

      const optionGrids = mainDiv.querySelectorAll(".option-grid");
      optionGrids.forEach((grid) => {
        const gridStyles = window.getComputedStyle(grid);
        gridGap = parseFloat(gridStyles.getPropertyValue("gap"));
        grid.style.display = "block";
      });

      options.forEach((option) => {
        const optionStyles = window.getComputedStyle(option);
        optionBorderWidth = parseFloat(
          optionStyles.getPropertyValue("border-width")
        );
        option.style.width = "auto";
        option.style.display = "inline-block";
        const optionWidth = option.offsetWidth;
        if (optionWidth > maxWidth) {
          maxWidth = optionWidth;
        }
      });
      optionGrids.forEach((grid) => {
        grid.style.display = "grid";
      });

      this.maxWidth = `${maxWidth}px`;
      this.gridWidth = `${
        (maxWidth + gridGap + optionBorderWidth * 2) *
          this.question.optionsGridCols +
        gridGap * 2
      }px`;
    },

    addToActiveDroppable(draggable) {
      if (!this.activeDroppable) return;
      this.setAnswer(
        this.activeDroppable.getAttribute("data-name"),
        draggable.getAttribute("data-name")
      );
    },

    removeLastIn() {
      const lastFilledIndex = this.currentAnswers
        .slice()
        .reverse()
        .findIndex((a) => a.answer !== "");
      if (lastFilledIndex !== -1) {
        const reverseIndex = this.currentAnswers.length - 1 - lastFilledIndex;
        this.currentAnswers[reverseIndex].answer = "";
      }
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
</style>
 

  mounted() {
    if (this.show === "QUESTION") {
      this.currentAnswers = this.question.answers.map((ac) => ({
        answerCode: ac.answerCode,
        answer: "",
      }));

      const mainDiv = document.querySelector("#" + this.id);
      const draggableDataNames = [
        ...new Set(this.question.answers.map((a) => a.allowedAnswers).flat()),
      ];

      const droppableDataNames = [
        ...new Set(this.question.answers.map((a) => a.answerCode)),
      ];

      // Set up draggable elements
      draggableDataNames.forEach((ddn) => {
        let elem = mainDiv.querySelector(`[data-name='${ddn}']`);
        if (elem) {
          elem.classList.add("draggable");
          elem.setAttribute("draggable", true);
          elem.addEventListener("dragstart", (event) =>
            this.onDragStart(event, elem)
          );
          elem.addEventListener("dragend", () => this.onDragEnd());
        }
      });

      // Set up droppable elements
      droppableDataNames.forEach((ddn) => {
        let elem = mainDiv.querySelector(`[data-name='${ddn}']`);
        if (elem) {
          elem.classList.add("droppable");
          elem.addEventListener("dragover", (event) => {
            event.preventDefault();
          });
          elem.addEventListener("drop", (event) => {
            event.preventDefault();
            this.onDrop(elem);
          });
        }
      });
    }
    this.setEqualWidth();
  },

  computed: {
    styleTag() {
      // Wrap the dynamic CSS inside a <style> tag
      return `<style>${this.question.exerciseStyles}</style>`;
    },
  },

  methods: {
    setEqualWidth() {
      const mainDiv = document.querySelector("#" + this.id);
      const options = mainDiv.querySelectorAll(".answer-option");
      let maxWidth = 0;
      let gridGap = 0;
      let optionBorderWidth = 0;

      const optionGrids = mainDiv.querySelectorAll(".option-grid");
      optionGrids.forEach((grid) => {
        const gridStyles = window.getComputedStyle(grid);
        gridGap = parseFloat(gridStyles.getPropertyValue("gap"));
        grid.style.display = "block";
      });

      options.forEach((option) => {
        const optionStyles = window.getComputedStyle(option);
        optionBorderWidth = parseFloat(
          optionStyles.getPropertyValue("border-width")
        );
        option.style.width = "auto";
        option.style.display = "inline-block";
        const optionWidth = option.offsetWidth;
        if (optionWidth > maxWidth) {
          maxWidth = optionWidth;
        }
      });
      optionGrids.forEach((grid) => {
        grid.style.display = "grid";
      });

      this.maxWidth = `${maxWidth}px`;
      this.gridWidth = `${
        (maxWidth + gridGap + optionBorderWidth * 2) *
          this.question.optionsGridCols +
        gridGap * 2
      }px`;
    },

    setAnswer(answerCode, answer) {
      const answerEntry = this.currentAnswers.find(
        (a) => a.answerCode == answerCode
      );
      if (answerEntry) {
        answerEntry.answer = answer;
      }
    },

    clearAnswer(answerCode) {
      const answerEntry = this.currentAnswers.find(
        (a) => a.answerCode == answerCode
      );
      if (answerEntry) {
        answerEntry.answer = "";
      }
    },

    checkAnswers() {
      let allCorrect = true;
      this.question.answers.forEach((ac) => {
        const allowedAnswers = ac.allowedAnswers;
        const studentAnswer = this.currentAnswers.find(
          (ca) => ca.answerCode === ac.answerCode
        ).answer;

        if (
          (allowedAnswers.length > 0 &&
            !allowedAnswers.includes(studentAnswer)) ||
          (allowedAnswers.length === 0 && studentAnswer !== "")
        ) {
          allCorrect = false;
        }
      });
      return { allCorrect, studentAnswers: this.currentAnswers };
    },

    fillAnswers(answers) {
      answers.forEach((ac) => {
        const mainDiv = document.querySelector("#" + this.id);
        const input = mainDiv.querySelector(`[data-name='${ac.answerCode}']`);
        if (ac.answer) {
          const content = this.question.answerOptions.find(
            (ao) => ao.optionId === ac.answer
          ).optionContent;
          input.innerHTML = content;
        } else {
          input.innerHTML = "";
        }
      });
    },

    // Event handlers for dragging
    onDragStart(event, elem) {
      console.log("Drag start");
      this.dropInsideDroppable = false;
      this.activeDraggable = elem;
      event.dataTransfer.setData("text", elem.getAttribute("data-name"));

      // Optional: Style the element while dragging
      //event.target.style.opacity = "0.5";
    },

    onDrop(elem) {
      console.log("Drop");
      if (!(elem && this.activeDraggable)) return;

      this.dropInsideDroppable = true;
      if (elem.classList.contains("droppable")) {
        const draggedDataName = this.activeDraggable.getAttribute("data-name");
        this.setAnswer(elem.getAttribute("data-name"), draggedDataName);

        // Update the content of the droppable to match the dragged item
        elem.innerHTML = this.activeDraggable.outerHTML;
      }
    },

    onDragEnd() {
      console.log("Drag end");
      if (!this.dropInsideDroppable) {
        this.clearAnswer(this.activeDraggable.getAttribute("data-name"));
      }

      // Reset the dragged element's style
      if (this.activeDraggable) {
        this.activeDraggable.style.opacity = "1";
      }

      this.activeDraggable = null;
    },
  },
};
</script>

<style scoped>
.draggable {
  cursor: move;
}

.droppable {
  border: 2px dashed #b7e7fb;
  min-height: 80px;
  min-width: 80px;
}

.active-droppable {
  background-color: #dff0ff;
}
</style>






<template>
  <div :id="id">
    <div v-if="question.exerciseStyles" v-html="styleTag"></div>

    <div class="question-card" v-if="show != 'EXPLANATION'">
      <div class="row" v-if="show == 'QUESTION' && question.groupTitle">
        <div class="col-12" v-html="question.groupTitle"></div>
      </div>

      <div class="row">
        <div class="col-12" v-html="question.questionStmt"></div>
      </div>

      <div
        class="row option-grid-row mt-3"
        v-for="setIndex in currentAnswers.length"
        :key="setIndex"
        :id="id + '-answer-set-' + (setIndex - 1)"
      >
        <div class="col-12" :style="`max-width: ${options.gridWidth};`">
          <div
            :class="['option-grid', question.optionsGridStyleClass]"
            :style="`grid-template-columns: repeat(auto-fit, ${options.maxWidth});`"
          >
            <div
              v-for="option in question.answerOptions"
              :key="option.answerCode"
              v-html="option.optionContent"
              :class="[
                'answer-option',
                option.overrideOptionsStyle
                  ? option.overrideOptionsStyle
                  : question.optionsStyleClass,
              ]"
              :data-name="option.answerCode"
              :set-index="setIndex - 1"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div v-if="this.question.explanation == 'STATIC'">
          <div class="col-12" v-html="question.answerExplanation"></div>
        </div>
        <div class="col-12" v-else>
          <div
            class="mt-8"
            v-for="(option, index) in question.answerOptions"
            :key="index"
          >
            <div
              :class="['answer-option', question.optionsStyleClass]"
              v-html="option.optionContent"
            ></div>
            <div>
              {{ option.answerExplanation }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
      description: "A unique id for the div displaying the question",
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
      description: `An array of objects like [[{answerCode: 'a#4r', answer: '3'},...]] for each answerCode (blank) in the question for each set. 
        Required if show == 'SUPPLIED_ANSWERS'`,
    },
  },

  computed: {
    styleTag() {
      return `<style>${this.question.exerciseStyles}</style>`;
    },
  },

  // many questions have multiple sets of possible correct answers. For e.g., there may be 3 ways of
  // traversing a matrix from starting point to finish point while collecting the same total points.
  // requiredNumberOfAnswerSets indicates the number of possible answers the student is required to give.
  // Minimum is 1. In the above example it can be 1, 2 or 3

  data() {
    return {
      currentAnswers: [],
      options: {
        maxWidth: "auto",
        gridWidth: "auto",
      },
      requiredNumberOfAnswerSets:
        this.question.requiredNumberOfAnswerSets &&
        this.question.requiredNumberOfAnswerSets > 0
          ? this.question.requiredNumberOfAnswerSets
          : 1,
    };
  },

  watch: {
    currentAnswers: {
      handler() {
        this.fillAnswers(this.currentAnswers);
      },
      deep: true,
    },
  },

  beforeMount() {
    if (this.show != "EXPLANATION") {
      this.currentAnswers = this.getAnswersByMode(this.show, this.question);
    }
  },

  mounted() {
    // all options (whether in the options grid or in the question stmt) to be clickable

    if (this.show == "QUESTION") {
      const mainDiv = document.querySelector("#" + this.id);
      const optionDataNames = [
        ...new Set(this.question.answers[0].map((ao) => ao.answerCode)),
      ];

      optionDataNames.forEach((odn) => {
        let elems = mainDiv.querySelectorAll("[data-name='" + odn + "']");

        elems.forEach((elem) => {
          elem.addEventListener("click", () =>
            this.answerOptionClicked(
              elem.getAttribute("set-index") || 0,
              elem.getAttribute("data-name")
            )
          );
        });
      });
    }
    this.setOptionsWidth();
  },

  methods: {
    getAnswersByMode(mode, question) {
      let answers = null;
      switch (mode) {
        case "QUESTION":
          answers = question.answers
            .map((answerSet) => {
              return answerSet.map((a) => {
                return {
                  answerCode: a.answerCode,
                  answer: false,
                };
              });
            })
            .slice(0, this.question.requiredNumberOfAnswerSets);
          break;
        case "CORRECT_ANSWERS":
          answers = question.answers.map((answerSet) => {
            return answerSet.map((a) => {
              return {
                answerCode: a.answerCode,
                answer: a.isCorrect,
              };
            });
          });
          break;
        case "STUDENT_ANSWERS":
          answers = question.studentAnswers;
          break;
        case "SUPPLIED_ANSWERS":
          answers = this.answers;
          break;
        default:
          break;
      }
      return answers;
    },

    setOptionsWidth() {
      const mainDiv = document.querySelector("#" + this.id);
      const answerSetDiv0 = mainDiv.querySelector(
        "#" + this.id + "-answer-set-0"
      );
      let options, optionGrid;
      if (answerSetDiv0) {
        options = answerSetDiv0.querySelectorAll(".answer-option");
        optionGrid = answerSetDiv0.querySelector(".option-grid");
      } else {
        options = mainDiv.querySelectorAll(".answer-option");
        optionGrid = mainDiv.querySelector(".option-grid");
      }

      if (options) {
        let maxWidth = 0;
        let gridGap = 0;
        let optionBorderWidth = 0;

        if (optionGrid) {
          const gridStyles = window.getComputedStyle(optionGrid);
          gridGap = parseFloat(gridStyles.getPropertyValue("gap"));
          optionGrid.style.display = "block";
        }

        options.forEach((option) => {
          const optionStyles = window.getComputedStyle(option);
          optionBorderWidth = parseFloat(
            optionStyles.getPropertyValue("border-width")
          );
          option.style.width = "auto";
          option.style.display = "inline-block";
          const optionWidth = option.offsetWidth;
          if (optionWidth > maxWidth) {
            maxWidth = optionWidth;
          }
        });

        if (optionGrid) {
          optionGrid.style.display = "grid";
        }

        this.options.maxWidth = `${maxWidth}px`;
        this.options.gridWidth = `${
          (maxWidth + gridGap + optionBorderWidth * 2) *
            this.question.optionsGridCols +
          gridGap * 2 +
          10
        }px`;
      }
    },

    answerOptionClicked(setIndex, answerCode) {
      let currentState = this.currentAnswers[setIndex].find(
        (a) => a.answerCode == answerCode
      ).answer;

      if (this.question.questionType != "MULTIPLE_SELECT") {
        this.currentAnswers[setIndex].forEach((a) => {
          a.answer = false;
        });
      }

      this.currentAnswers[setIndex].find(
        (a) => a.answerCode == answerCode
      ).answer = !currentState;
    },

    checkAnswers() {
      let allCorrect = true;
      let acceptedAnswers = [];
      for (
        let setIndex = 0;
        setIndex < this.currentAnswers.length;
        ++setIndex
      ) {
        let answerSet = this.currentAnswers[setIndex];
        if (this.contains(acceptedAnswers, answerSet)) {
          // correct answer but cannot be accepted as it is same as previously accepted correct answers
          break;
        }
        if (this.contains(this.question.answers, answerSet)) {
          // correct answer
          acceptedAnswers.push(answerSet);
        }
      }
      if (acceptedAnswers.length !== this.requiredNumberOfAnswerSets) {
        allCorrect = false;
      }

      return {
        allCorrect,
        studentAnswers: this.currentAnswers,
      };
    },

    contains(answers, answerSet) {
      // Loop through all possible answer sets
      let isMatch = true;

      for (let answer of answers) {
        isMatch = true;
        // Compare the studentSet with the current answerSet
        for (let i = 0; i < answer.length; i++) {
          let correctAnswer = answer[i];
          let studentAnswer = answerSet.find(
            (s) => s.answerCode === correctAnswer.answerCode
          );

          if (
            !correctAnswer ||
            correctAnswer.isCorrect !== studentAnswer.answer
          ) {
            isMatch = false;
            break; // Stop if any mismatch is found
          }
        }

        // If the entire set matches, return true
        if (isMatch) {
          return true;
        }
      }

      // If no matching set is found, return false
      return false;
    },

    fillAnswers(answers) {
      if (this.show == "EXPLANATION") return;
      if (!answers) return;
      for (let setIndex = 0; setIndex < answers.length; ++setIndex) {
        let answerSet = answers[setIndex];
        const mainDiv = document.querySelector("#" + this.id);
        const answerSetDiv = mainDiv.querySelector(
          "#" + this.id + "-answer-set-" + setIndex
        );

        answerSet.forEach((as) => {
          const input = answerSetDiv.querySelector(
            `[data-name='${as.answerCode}']`
          );
          if (as.answer) {
            input.classList.add("selected");
          } else {
            input.classList.remove("selected");
          }
        });
      }
    },
  },
};
</script>


<script>
import BaseQuestionComponent from "./BaseQuestionComponent.vue";

export default {
  extends: BaseQuestionComponent,

  data() {
    return {
      defaultInputType: "INPUT",
    };
  },

  methods: {
    autogenerateContent(partIndex, setIndex) {
      let answerKeys = this.question.parts[partIndex].answerKeys;
      if (!answerKeys || answerKeys.length == 0) return;

      let content = `<div class='answer-set'>`;

      for (let keyIdx = 0; keyIdx < answerKeys.length; ++keyIdx) {
        let inputType =
          this.question.parts[partIndex].answerKeys[keyIdx].inputType ||
          this.defaultInputType;
        let inputWidth =
          this.question.parts[partIndex].answerKeys[keyIdx].inputWidth ||
          "auto";
        let inputHeight =
          this.question.parts[partIndex].answerKeys[keyIdx].inputHeight ||
          "auto";

        if (inputWidth == "auto") {
          if (inputType == "INPUT" || inputType == "CONTENT_EDITABLE_DIV") {
            const answerLengths = this.question.parts[partIndex].answerKeys[
              keyIdx
            ].allowedAnswers
              .flat(2)
              .map((elem) => elem.toString().length);
            inputWidth = Math.max([...answerLengths]);
            inputWidth = Math.max(1.1 * inputWidth, 5);
            inputWidth = inputWidth + 5; // account for padding --- TODO a better way
            inputWidth = inputWidth + "ch";
          } else {
            if (inputType == "COMBINED_INPUT") {
              const answerLengths = this.question.parts[partIndex].answerKeys[
                keyIdx
              ].allowedAnswers
                .flat(2)
                .map((elem) => elem.toString().length);
              inputWidth = answerLengths.reduce((acc, curr) => acc + curr, 0);
              inputWidth = Math.max(1.1 * inputWidth, 5);
              inputWidth = inputWidth + 5;
              inputWidth = inputWidth + "ch";
            }
          }
        }

        if (this.question.parts[partIndex].displayRepeatCount) {
          content += `<div class='set-index'>${setIndex + 1}</div>`;
        }

        let answerCodes = answerKeys[keyIdx].answerCodes;

        if (inputType == "INPUT") {
          answerCodes.forEach((ac) => {
            content += `<input type='text' input-type='${inputType}' class='form-control' maxlength='${inputWidth}' style='width:${inputWidth};height:${inputHeight};display:inline;margin-right:10px' answer-code='${ac}'/>`;
          });
          content += answerKeys[keyIdx].answerUnit || "";
        }

        if (inputType == "CONTENT_EDITABLE_DIV") {
          answerCodes.forEach((ac) => {
            content += `<div contenteditable='true' input-type='${inputType}' maxlength='${inputWidth}' style='width:${inputWidth};height:${inputHeight};display:inline;margin-right:10px' answer-code='${ac}'/>`;
          });
          content += answerKeys[keyIdx].answerUnit || "";
        }

        if (inputType == "COMBINED_INPUT") {
          let combinedAnswerCodes = " ".join(answerCodes);
          content += `<input type='text' input-type='${inputType}' class='form-control' maxlength='${inputWidth}' style='width:${inputWidth};height:${inputHeight};margin-right:10px' answer-code='${combinedAnswerCodes}'/>`;
          content += answerKeys[keyIdx].answerUnit || "";
        }
      }
      content += "</div>";
      return content;
    },

    autogenerateExplanation(partIndex, setIndex) {
      let answerKeys = this.question.parts[partIndex].answerKeys;
      if (!answerKeys || answerKeys.length == 0) return;

      let content = `<div class='answer-set'>`;

      for (let keyIdx = 0; keyIdx < answerKeys.length; ++keyIdx) {
        let inputType =
          this.question.parts[partIndex].answerKeys[keyIdx].inputType ||
          this.defaultInputType;
        let inputWidth =
          this.question.parts[partIndex].answerKeys[keyIdx].inputWidth ||
          "auto";
        let inputHeight =
          this.question.parts[partIndex].answerKeys[keyIdx].inputHeight ||
          "auto";

        if (inputWidth == "auto") {
          if (inputType == "INPUT" || inputType == "CONTENT_EDITABLE_DIV") {
            const answerLengths = this.question.parts[partIndex].answerKeys[
              keyIdx
            ].allowedAnswers
              .flat(2)
              .map((elem) => elem.toString().length);
            inputWidth = Math.max([...answerLengths]);
            inputWidth = Math.max(1.1 * inputWidth, 5);
            inputWidth = inputWidth + 5; // account for padding --- TODO a better way
            inputWidth = inputWidth + "ch";
          } else {
            if (inputType == "COMBINED_INPUT") {
              const answerLengths = this.question.parts[partIndex].answerKeys[
                keyIdx
              ].allowedAnswers
                .flat(2)
                .map((elem) => elem.toString().length);
              inputWidth = answerLengths.reduce((acc, curr) => acc + curr, 0);
              inputWidth = Math.max(1.1 * inputWidth, 5);
              inputWidth = inputWidth + 5;
              inputWidth = inputWidth + "ch";
            }
          }
        }

        if (this.question.parts[partIndex].displayRepeatCount) {
          content += `<div class='set-index'>${setIndex + 1}</div>`;
        }

        let answerCodes = answerKeys[keyIdx].answerCodes;

        if (inputType == "INPUT") {
          answerCodes.forEach((ac) => {
            content += `<input type='text' input-type='${inputType}' class='form-control' maxlength='${inputWidth}' style='width:${inputWidth};height:${inputHeight};display:inline;margin-right:10px' answer-code='${ac}'/>`;
          });
          content += answerKeys[keyIdx].answerUnit || "";
        }

        if (inputType == "CONTENT_EDITABLE_DIV") {
          answerCodes.forEach((ac) => {
            content += `<div contenteditable='true' input-type='${inputType}' maxlength='${inputWidth}' style='width:${inputWidth};height:${inputHeight};display:inline;margin-right:10px' answer-code='${ac}'/>`;
          });
          content += answerKeys[keyIdx].answerUnit || "";
        }

        if (inputType == "COMBINED_INPUT") {
          let combinedAnswerCodes = " ".join(answerCodes);
          content += `<input type='text' input-type='${inputType}' class='form-control' maxlength='${inputWidth}' style='width:${inputWidth};height:${inputHeight};margin-right:10px' answer-code='${combinedAnswerCodes}'/>`;
          content += answerKeys[keyIdx].answerUnit || "";
        }
      }
      content += "</div>";
      return content;
    },


    enableUserInteraction() {
      const mainDiv = document.querySelector("#" + this.id);

      this.currentAnswers.forEach((ca) => {
        const answerSetDiv = mainDiv.querySelector(
          "#" + this.id + "-part-" + ca.partIndex + "-" + ca.setIndex
        );
        const blank = answerSetDiv.querySelector(
          "[answer-code='" + ca.answerCode + "']"
        );
        if (!blank) return;
        if (blank.hasAttribute("contentEditable")) {
          blank.addEventListener("blur", (event) => {
            this.answerChanged(
              ca.partIndex,
              ca.setIndex,
              ca.answerCode,
              event.target.innerHTML
            );
          });
        } else {
          blank.addEventListener("change", (event) => {
            this.answerChanged(
              ca.partIndex,
              ca.setIndex,
              ca.answerCode,
              event.target.value
            );
          });
        }
      });

      const combinedInputs = mainDiv.querySelectorAll (`[input-type='COMBINED_INPUTS']`);
      
    },

    disableUserInteraction() {
      let inputElements = document.querySelectorAll(
        `#${this.id} input #${this.id} [contentEditable="true"]`
      );
      inputElements.forEach((input) => {
        input.disabled = true;
      });
    },

    answerChanged(event, newValue) {
      document.getElementById("clickSound").play();
      let inputElement = event.target;
      let partIndex = inputElement.getAttribute("part-index");
      let setIndex = inputElement.getAttribute("set-index");
      let answerCode = inputElement.getAttribute("answer-code");
      let inputType = inputElement.getAttribute("input-type");
      if (inputType == "COMBINED_INPUT") {
        let answerCodes = answerCode.split(" ");
        let answerValues = newValue.split(" ");
        for (let idx = 0; idx < answerCodes; ++idx) {
          let currentAnswer = this.currentAnswers.find(
            (a) =>
              a.partIndex == partIndex &&
              a.setIndex == setIndex &&
              a.answerCode == answerCodes[idx]
          );
          if (idx < answerValues.length) {
            currentAnswer.value = answerValues[idx].trim();
          }
        }
      } else {
        let currentAnswer = this.currentAnswers.find(
          (a) =>
            a.partIndex == partIndex &&
            a.setIndex == setIndex &&
            a.answerCode == answerCode
        );
        currentAnswer.value = newValue.trim();
      }
    },

    focusFirstElement() {
      // Query for the first input or contentEditable div within the component
      const firstElement = document.querySelector(
        `#${this.id} input, #${this.id} [contentEditable="true"]`
      );

      if (firstElement) {
        firstElement.focus();
      }
    },

    fillAnswers(answers) {
      if (this.show == "EXPLANATION") return;
      const mainDiv = document.querySelector("#" + this.id);
      answers.forEach((answer) => {
        const answerDiv = mainDiv.querySelector(
          "#" + this.id + "-part-" + answer.partIndex + "-" + answer.setIndex
        );
        const input = answerDiv.querySelector(
          `[answer-code='${answer.answerCode}']`
        );
        if (input) {
          if (input.hasAttribute("contentEditable")) {
            input.innerHTML = answer.value;
          } else {
            input.value = answer.value;
          }
          if (this.show == "STUDENT_ANSWERS") {
            if (answer.isInvalid) {
              if (!answer.partOfGroup) {
                input.classList.add("is-invalid");
              } else {
                answerDiv.classList.add("is-invalid");
              }
            } else {
              if (!answer.partOfGroup) {
                input.classList.add("is-valid");
              } else {
                answerDiv.classList.add("is-valid");
              }
            }
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.answer-set {
  margin-bottom: 10px;
}
</style>



<template>
  <div :id="id">
    <div v-if="question.exerciseStyles" v-html="styleTag"></div>
    <div class="question-card" v-if="show != 'EXPLANATION'">
      <div class="row group-title-row" v-if="question.groupTitle">
        <div class="col-12" v-html="question.groupTitle"></div>
      </div>
      <div class="row question-stmt-row">
        <div class="col-12" v-html="question.questionStmt"></div>
      </div>
      <!-- Options -->

      <div class="row option-grid-row mt-3">
        <div class="col-12" :style="`max-width: ${gridWidth};`">
          <div
            :class="['option-grid', question.optionsGridStyleClass]"
            :style="`grid-template-columns: repeat(auto-fit, ${maxWidth});`"
          >
            <button
              v-for="option in question.answerOptions"
              :key="option.answerCode"
              :data-name="option.answerCode"
              v-html="option.optionContentPrepend + option.optionContent"
              type="button"
              :class="['answer-option', 'btn', 'btn-light']"
            ></button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div>
          <div class="col-12" v-html="question.answerExplanation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {},
    question: {},
    show: {
      type: String,
      required: false,
      default: "QUESTION",
    },
    answers: {},
  },

  watch: {
    currentAnswers: {
      handler() {
        this.fillAnswers(this.currentAnswers);
        this.activeDroppable = this.firstEmptyDroppable();
      },
      deep: true,
    },

    activeDroppable: {
      handler() {
        if (this.question.activeDroppableClass) {
          const mainDiv = document.querySelector("#" + this.id);
          const droppableDataNames = [
            ...new Set(this.question.answers.map((a) => a.answerCode)),
          ];
          droppableDataNames.forEach((ddn) => {
            let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
            elem.classList.remove(this.question.activeDroppableClass);
          });

          if (this.activeDroppable) {
            this.activeDroppable.classList.add(
              this.question.activeDroppableClass
            );
          }
        }
      },
    },
  },

  data() {
    return {
      maxWidth: "auto",
      gridWidth: "auto",
      currentAnswers: [],
      activeDroppable: null,
      activeDraggable: null,
      floatingElem: null,
      dropInsideDroppable: false,
    };
  },

  mounted() {
    if (this.show === "QUESTION") {
      this.currentAnswers = this.question.answers.map((ac) => ({
        answerCode: ac.answerCode,
        answer: "",
      }));

      const mainDiv = document.querySelector("#" + this.id);
      const draggableDataNames = [
        ...new Set(this.question.answerOptions.map((ao) => ao.answerCode)),
      ];

      const droppableDataNames = [
        ...new Set(this.question.answers.map((a) => a.answerCode)),
      ];

      draggableDataNames.forEach((ddn) => {
        let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
        elem.classList.add("draggable");
        if (this.question.clickToDrop) {
          elem.addEventListener("click", () => this.addToActiveDroppable(elem));
        }
        elem.addEventListener("dragstart", () => this.onDragStart(elem));
        elem.addEventListener("dragend", () => this.onDragEnd(elem));
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
      droppableDataNames.forEach((ddn) => {
        let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
        elem.classList.add("droppable");

        elem.addEventListener("dragover", (event) => {
          event.preventDefault();
        });

        // Handle the drop event
        elem.addEventListener("drop", (event) => {
          event.preventDefault();
          this.onDrop(elem);
        });

        elem.addEventListener("dragstart", () => this.onDragStart(elem));
        elem.addEventListener("dragend", () => this.onDragEnd(elem));
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
    } else if (this.show === "CORRECT_ANSWERS") {
      const answers = this.question.answers.map((ac) => ({
        answerCode: ac.answerCode,
        answer: ac.allowedAnswers.length > 0 ? ac.allowedAnswers[0] : "",
      }));
      this.fillAnswers(answers);
    } else if (this.show === "STUDENT_ANSWERS") {
      this.fillAnswers(this.question.studentAnswers);
    } else if (this.show === "SUPPLIED_ANSWERS") {
      this.fillAnswers(this.answers);
    }
    this.setEqualWidth();
  },

  computed: {
    styleTag() {
      // Wrap the dynamic CSS inside a <style> tag
      return `<style>${this.question.exerciseStyles}</style>`;
    },
  },

  methods: {
    setAnswer(answerCode, answer) {
      //alert (answerCode);
      //alert (answer);

      if (
        !this.question.allowRandomDrops &&
        answerCode != this.activeDroppable.getAttribute("data-name")
      )
        return;
      const answerEntry = this.currentAnswers.find(
        (a) => a.answerCode == answerCode
      );
      if (answerEntry) {
        answerEntry.answer = answer;
      }
    },

    clearAnswer(answerCode) {
      if (this.lastFilledAnswerEntry) {
        if (
          !this.question.allowRandomDrops &&
          answerCode != this.lastFilledAnswerEntry().answerCode
        )
          return;
      }
      const answerEntry = this.currentAnswers.find(
        (a) => a.answerCode == answerCode
      );
      if (answerEntry) {
        answerEntry.answer = "";
      }
    },

    firstEmptyAnswerEntry() {
      return this.currentAnswers.find((a) => a.answer == "");
    },

    firstEmptyDroppable() {
      const answerEntry = this.firstEmptyAnswerEntry();
      if (answerEntry) {
        const activeDroppableDN = answerEntry.answerCode;
        const mainDiv = document.querySelector("#" + this.id);

        return mainDiv.querySelector("[data-name='" + activeDroppableDN + "']");
      } else {
        return null;
      }
    },

    lastFilledAnswerEntry() {
      const lastFilledIndex = this.currentAnswers
        .slice()
        .reverse()
        .findIndex((a) => a.answer !== "");
      if (lastFilledIndex !== -1) {
        const reverseIndex = this.currentAnswers.length - 1 - lastFilledIndex;
        return this.currentAnswers[reverseIndex];
      } else {
        return null;
      }
    },

    checkAnswers() {
      let allCorrect = true;
      this.question.answers.forEach((ac) => {
        const allowedAnswers = ac.allowedAnswers;
        const studentAnswer = this.currentAnswers.find(
          (ca) => ca.answerCode === ac.answerCode
        ).answer;

        if (
          (allowedAnswers.length > 0 &&
            !allowedAnswers.includes(studentAnswer)) ||
          (allowedAnswers.length === 0 && studentAnswer !== "")
        ) {
          allCorrect = false;
        }
      });
      return { allCorrect, studentAnswers: this.currentAnswers };
    },

    fillAnswers(answers) {
      answers.forEach((ac) => {
        const mainDiv = document.querySelector("#" + this.id);
        const input = mainDiv.querySelector(`[data-name='${ac.answerCode}']`);
        if (ac.answer) {
          const content = this.question.answerOptions.find(
            (ao) => ao.answerCode === ac.answer
          ).optionContent;
          input.innerHTML = content;
        } else {
          input.innerHTML = "";
        }
      });
    },

    setEqualWidth() {
      const mainDiv = document.querySelector("#" + this.id);
      const options = mainDiv.querySelectorAll(".answer-option");
      let maxWidth = 0;
      let gridGap = 0;
      let optionBorderWidth = 0;

      const optionGrids = mainDiv.querySelectorAll(".option-grid");
      optionGrids.forEach((grid) => {
        const gridStyles = window.getComputedStyle(grid);
        gridGap = parseFloat(gridStyles.getPropertyValue("gap"));
        grid.style.display = "block";
      });

      options.forEach((option) => {
        const optionStyles = window.getComputedStyle(option);
        optionBorderWidth = parseFloat(
          optionStyles.getPropertyValue("border-width")
        );
        option.style.width = "auto";
        option.style.display = "inline-block";
        const optionWidth = option.offsetWidth;
        if (optionWidth > maxWidth) {
          maxWidth = optionWidth;
        }
      });
      optionGrids.forEach((grid) => {
        grid.style.display = "grid";
      });

      this.maxWidth = `${maxWidth}px`;
      this.gridWidth = `${
        (maxWidth + gridGap + optionBorderWidth * 2) *
          this.question.optionsGridCols +
        gridGap * 2
      }px`;
    },

    addToActiveDroppable(draggable) {
      if (!this.activeDroppable) return;
      this.setAnswer(
        this.activeDroppable.getAttribute("data-name"),
        draggable.getAttribute("data-name")
      );
    },

    onDragStart(elem) {
      this.dropInsideDroppable = false;
      this.activeDraggable = elem;
    },

    onTouchStart(event, elem) {
      console.log("touch start");
      console.log(elem.getAttribute("data-name"));
      this.activeDraggable = elem;

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

    onDrop(elem) {
      if (!(elem && this.activeDraggable)) return;
      this.dropInsideDroppable = true;
      if (elem.classList.contains("droppable")) {
        if (this.activeDraggable.classList.contains("draggable")) {
          this.setAnswer(
            elem.getAttribute("data-name"),
            this.activeDraggable.getAttribute("data-name")
          );
        } else {
          /*
          this.setAnswer(
            elem.getAttribute("data-name"),
            this.currentAnswers.find(
              (a) =>
                a.answerCode == this.activeDraggable.getAttribute("data-name")
            ).answer
          );
          this.clearAnswer(this.activeDraggable.getAttribute("data-name"));
          */
        }
      }
    },

    onTouchEnd(event) {
      if (this.activeDraggable) {
        console.log("Touch End of");
        console.log(this.activeDraggable);

        const touch = event.changedTouches[0];
        let elem = this.isDropInsideDroppable(touch.clientX, touch.clientY);
        console.log("Dropped On");
        console.log(elem);
        if (elem && elem.classList.contains("droppable")) {
          this.dropInsideDroppable = true;
          this.setAnswer(
            elem.getAttribute("data-name"),
            this.activeDraggable.getAttribute("data-name")
          );
        }

        // Remove the floating element
        document.body.removeChild(this.floatingElement);
        this.floatingElement = null;
      }
    },

    isDropInsideDroppable(dropX, dropY) {
      const mainDiv = document.querySelector("#" + this.id);
      const droppableDataNames = [
        ...new Set(this.question.answers.map((a) => a.answerCode)),
      ];
      for (let idx = 0; idx < droppableDataNames.length; ++idx) {
        let ddn = droppableDataNames[idx];
        let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
        const dropzoneRect = elem.getBoundingClientRect();
        if (
          dropX > dropzoneRect.left &&
          dropX < dropzoneRect.right &&
          dropY > dropzoneRect.top &&
          dropY < dropzoneRect.bottom
        ) {
          console.log(elem);
          return elem;
        }
      }
      return null;
    },

    allowDrop(event) {
      event.preventDefault(); // Enable dropping
    },

    onDragEnd() {
      if (!this.dropInsideDroppable) {
        this.clearAnswer(this.activeDraggable.getAttribute("data-name"));
      }
      this.activeDraggable = null;
    },

    addRemoveBtn(elem) {
      // Check if a remove button already exists to avoid duplicating it
      if (!elem.querySelector(".remove-btn")) {
        // Create the remove button element
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");

        // Append the button to the element
        elem.style.position = "relative"; // Ensure elem has relative position so the button can be positioned inside it
        elem.appendChild(removeBtn);

        // Add click event to remove the content from the droppable element
        removeBtn.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default behavior (e.g., form submission)
          event.stopPropagation(); // Prevent any other click events from triggering
          this.removeFromDroppable(elem);
        });
      }
    },

    removeLastIn() {
      const lastFilledIndex = this.currentAnswers
        .slice()
        .reverse()
        .findIndex((a) => a.answer !== "");
      if (lastFilledIndex !== -1) {
        const reverseIndex = this.currentAnswers.length - 1 - lastFilledIndex;
        this.currentAnswers[reverseIndex].answer = "";
      }
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
</style>
    setAnswer(draggable, droppable, transferType) {
      if (!transferType) transferType = "COPY";
      let value = draggable.getAttribute("answer-code");
      let response = this.getPartSetForElem(droppable);
      if (!response) return;
      let { partIndex, setIndex } = response;
      this.answerChanged(
        partIndex,
        setIndex,
        droppable.getAttribute("answer-code"),
        value
      );
      if (transferType == "MOVE") {
        draggable.style.opacity = "0.5";
        draggable.style.pointerEvents = "none";
      }
    },

    clearAnswer(draggable, droppable, transferType) {
      if (!transferType) transferType = "COPY";
      let response = this.getPartSetForElem(droppable);
      if (!response) return;
      let { partIndex, setIndex } = response;
      this.answerChanged(
        partIndex,
        setIndex,
        droppable.getAttribute("answer-code"),
        ""
      );
      if (transferType == "MOVE") {
        draggable.style.opacity = "1.0";
        draggable.style.pointerEvents = "auto";
      }
    },



    onDrop(event, elem) {
      if (!(elem && this.activeDraggable)) return;
      this.dropInsideDroppable = true;
      let response = this.getPartSetForElem(elem);
      if (!response) return;
      let { partIndex, setIndex } = response;

      if (this.activeDraggable.classList.contains("draggable")) {
        this.answerChanged(
          partIndex,
          setIndex,
          elem.getAttribute("answer-code"),
          this.activeDraggable.getAttribute("answer-code")
        );
      } else {
        // If the dragged element is a droppable
        this.answerChanged(
          partIndex,
          setIndex,
          elem.getAttribute("answer-code")
        );
      }
    },


    onTouchStart(event, elem) {
      this.activeDraggable = elem;

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
        "content": "<div style='display:grid;max-width:556;gap:10px;grid-template-columns:140px 140px 140px 140px;'><div style='border:2px solid #b7e7fb; border-radius:4px;text-align:center;'><div style='border-bottom:2px solid #b7e7fb;padding-bottom:10px;margin-bottom:10px'>6</div><div answer-code='0000' class='interactive-grid-slot dropzone active-slot' style='height:100px;'></div></div><div style='border:2px solid #b7e7fb; border-radius:4px; text-align:center'><div style='border-bottom:2px solid #b7e7fb;padding-bottom:10px;margin-bottom:10px'>8</div><div answer-code='1111' class='interactive-grid-slot dropzone' style='height:100px'></div></div><div  style='border:2px solid #b7e7fb; border-radius:4px;text-align:center;'><div style='border-bottom:2px solid #b7e7fb;padding-bottom:10px;margin-bottom:10px'>1</div><div answer-code='2222' class='interactive-grid-slot dropzone' style='height:100px'></div></div><div style='border:2px solid #b7e7fb; border-radius:4px;text-align:center;'><div style='border-bottom:2px solid #b7e7fb;padding-bottom:10px;margin-bottom:10px'>4</div><div answer-code='3333' class='interactive-grid-slot dropzone' style='height:100px'></div></div></div>",

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
      if (this.activeDraggable) {
        console.log("Touch End of");
        console.log(this.activeDraggable);

        const touch = event.changedTouches[0];
        let elem = this.isDropInsideDroppable(touch.clientX, touch.clientY);
        console.log("Dropped On");
        console.log(elem);
        if (elem && elem.classList.contains("droppable")) {
          this.dropInsideDroppable = true;
          this.setAnswer(this.activeDraggable, elem);
        }

        // Remove the floating element
        document.body.removeChild(this.floatingElement);
        this.floatingElement = null;
      }
    },

    isDropInsideDroppable(dropX, dropY) {
      const mainDiv = document.querySelector("#" + this.id);
      const droppableAnswerCodes = this.getDroppables(this.question);
      for (let idx = 0; idx < droppableAnswerCodes.length; ++idx) {
        let ddn = droppableAnswerCodes[idx];
        let elem = mainDiv.querySelector("[answer-code='" + ddn + "']");
        const dropzoneRect = elem.getBoundingClientRect();
        if (
          dropX > dropzoneRect.left &&
          dropX < dropzoneRect.right &&
          dropY > dropzoneRect.top &&
          dropY < dropzoneRect.bottom
        ) {
          console.log(elem);
          return elem;
        }
      }
      return null;
    },


    adjustOptionsWidth() {
      const mainDiv = document.querySelector (`#${this.id}`);
      let 

      const answerSetDivs = document.querySelectorAll(".part-set");

      for (let setIndex = 0; setIndex < answerSetDivs.length; ++setIndex) {
        let answerSetDiv = answerSetDivs[setIndex];
        let optionGrid = answerSetDiv.querySelector(".option-grid");
        let options;

        if (optionGrid) {
          options = optionGrid.querySelectorAll(".answer-option");
        } else {
          options = answerSetDiv.querySelectorAll(".answer-option");
        }

        if (!options || options.length == 0) continue;
        let maxWidth = 0,
          gridWidth = 0;

        let gridGap = 0;
        let optionBorderWidth = 0;

        if (optionGrid) {
          const gridStyles = window.getComputedStyle(optionGrid);
          gridGap = parseFloat(gridStyles.getPropertyValue("gap")) || 0;
          optionGrid.style.display = "block";
        }

        options.forEach((option) => {
          const optionStyles = window.getComputedStyle(option);
          optionBorderWidth =
            parseFloat(optionStyles.getPropertyValue("border-width")) || 0;
          option.style.width = "auto";
          option.style.display = "inline-block";
          const optionWidth = option.offsetWidth;
          if (optionWidth > maxWidth) {
            maxWidth = optionWidth;
          }
        });


        if (optionGrid) {
          optionGrid.style.display = "grid";
          let partIndex = answerSetDiv.getAttribute("part-index");
          gridWidth =
            (maxWidth + gridGap + optionBorderWidth * 2) *
              (this.question.parts[partIndex].answerKeysPerRow ||
                this.question.parts[partIndex].answerKeys.length) +
            gridGap * 2 +
            10;
          //alert (gridWidth);
          optionGrid.style.maxWidth = `${gridWidth}px`;
          optionGrid.style.gridTemplateColumns = `repeat(auto-fit, ${maxWidth}px)`;
        } else {
          options.forEach((option) => {
            alert (option.getAttribute ("answer-code"));s
            option.style.minWidth = `${maxWidth}px`;
          });
        }
      }
    },
      options.forEach((option) => {
        option.style.minWidth = `${maxWidth}px`;
        option.style.minHeight = `${maxHeight}px`;
      });



<template>
  <div :id="id">
    <div v-if="question.exerciseStyles" v-html="styleTag"></div>

    <div class="question-card" v-if="show != 'EXPLANATION'">
      <div
        class="row group-title-row"
        v-if="
          question.groupTitle &&
          (show == 'QUESTION' || question.showGroupTitleInSolution)
        "
      >
        <div class="col-12" v-html="question.groupTitle"></div>
      </div>

      <div
        v-if="show == 'QUESTION' || question.showQuestionStmtInSolution"
        class="row question-stmt-row"
      >
        <div class="col-12" v-html="question.questionStmt"></div>
      </div>

      <!-- Options Grid -->
      <div class="row option-grid-row mt-3">
        <div class="col-12" :style="`max-width: ${options.gridWidth};`">
          <div
            :class="['option-grid', question.optionsGridStyleClass]"
            :style="`grid-template-columns: repeat(auto-fit, ${options.maxWidth});`"
          >
            <div
              v-for="option in localAnswerOptions"
              :key="option.answerCode"
              :data-name="option.answerCode"
              :class="['answer-option', question.optionsStyleClass]"
              draggable="true"
              v-html="option.optionContent"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div>
          <div class="col-12" v-html="question.answerExplanation"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
      description: "A unique id for the div displaying the question",
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
      description: `An array of objects like [[{answerCode: 'a#4r', answer: '3'},...]] for each answerCode (blank) in the question for each set. 
        Required if show == 'SUPPLIED_ANSWERS'`,
    },
  },

  data() {
    return {
      currentAnswers: [],
      localAnswerOptions: [],
      options: {
        maxWidth: "auto",
        gridWidth: "auto",
      },
      draggedIndex: -1,
      floatingElem: null,
    };
  },

  computed: {
    styleTag() {
      return `<style>${this.question.exerciseStyles}</style>`;
    },
  },

  watch: {
    localAnswerOptions: {
      handler() {
        this.currentAnswers = this.localAnswerOptions.map((ao, index) => {
          return {
            answerCode: ao.answerCode,
            answer: index,
          };
        });
      },
      deep: true,
    },
  },

  beforeMount() {
    if (this.show != "EXPLANATION") {
      this.currentAnswers = this.getAnswersByMode(this.show, this.question);
      this.localAnswerOptions = this.reorganizeAnswerOptions(
        [...this.question.answerOptions],
        this.currentAnswers
      );
    }
  },

  mounted() {
    // all options (whether in the options grid or in the question stmt) to be draggable and droppable

    if (this.show == "QUESTION") {
      const mainDiv = document.querySelector("#" + this.id);
      const optionDataNames = [
        ...new Set(this.question.answers.map((ao) => ao.answerCode)),
      ];

      optionDataNames.forEach((odn) => {
        let elem = mainDiv.querySelector("[data-name='" + odn + "']");
        elem.addEventListener("dragstart", () => {
          this.onDragStart(elem);
        });
        elem.addEventListener("dragend", () => {
          this.onDragEnd(elem);
        });
        elem.addEventListener("dragover", (event) => {
          event.preventDefault();
        });
        elem.addEventListener("drop", () => {
          this.onDrop(elem);
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
    }
    if (this.show != "EXPLANATION") {
      this.setOptionsWidth();
    }
  },

  methods: {
    getAnswersByMode(mode, question) {
      let answers = null;
      switch (mode) {
        case "QUESTION":
          answers = question.answerOptions.map((a) => {
            return {
              answerCode: a.answerCode,
              answer: a.choiceOrderNo,
            };
          });
          break;
        case "CORRECT_ANSWERS":
          answers = question.answers.map((a) => {
            return {
              answerCode: a.answerCode,
              answer: a.correctOrderNo,
            };
          });
          break;
        case "STUDENT_ANSWERS":
          answers = question.studentAnswers;
          break;
        case "SUPPLIED_ANSWERS":
          answers = this.answers;
          break;
        default:
          break;
      }
      return answers;
    },

    reorganizeAnswerOptions(answerOptions, answers) {
      let orderMap = answers.reduce((map, answer) => {
        map[answer.answerCode] = answer.answer;
        return map;
      }, {});

      answerOptions.sort((a, b) => {
        return orderMap[a.answerCode] - orderMap[b.answerCode];
      });
      return answerOptions;
    },

    setOptionsWidth() {
      const mainDiv = document.querySelector("#" + this.id);
      const options = mainDiv.querySelectorAll(".answer-option");
      if (options) {
        let maxWidth = 0;
        let gridGap = 0;
        let optionBorderWidth = 0;

        const optionGrid = mainDiv.querySelector(".option-grid");

        if (optionGrid) {
          const gridStyles = window.getComputedStyle(optionGrid);
          gridGap = parseFloat(gridStyles.getPropertyValue("gap"));
          optionGrid.style.display = "block";
        }

        options.forEach((option) => {
          const optionStyles = window.getComputedStyle(option);
          optionBorderWidth = parseFloat(
            optionStyles.getPropertyValue("border-width")
          );
          option.style.width = "auto";
          option.style.display = "inline-block";
          const optionWidth = option.offsetWidth;
          if (optionWidth > maxWidth) {
            maxWidth = optionWidth;
          }
        });

        if (optionGrid) {
          optionGrid.style.display = "grid";
        }

        this.options.maxWidth = `${maxWidth}px`;
        this.options.gridWidth = `${
          (maxWidth + gridGap + optionBorderWidth * 2) *
            this.question.optionsGridCols +
          gridGap * 2 +
          10
        }px`;
      }
    },

    moveOption(fromIndex, toIndex) {
      const [elem] = this.localAnswerOptions.splice(fromIndex, 1);
      this.localAnswerOptions.splice(toIndex, 0, elem);
      return;
    },

    onDragStart(elem) {
      let answerCode = elem.getAttribute("data-name");
      this.draggedIndex = this.localAnswerOptions.findIndex(
        (ao) => ao.answerCode == answerCode
      );
    },

    onDrop(elem) {
      let answerCode = elem.getAttribute("data-name");
      let droppedIndex = this.localAnswerOptions.findIndex(
        (ao) => ao.answerCode == answerCode
      );
      if (this.draggedIndex > -1 && droppedIndex > -1) {
        this.moveOption(this.draggedIndex, droppedIndex);
      }
      this.draggedIndex = -1;
    },

    onDragEnd() {
      this.draggedIndex = -1;
    },

    onTouchStart(event, elem) {
      let answerCode = elem.getAttribute("data-name");
      this.draggedIndex = this.localAnswerOptions.findIndex(
        (ao) => ao.answerCode == answerCode
      );

      // Clone the element being dragged
      this.floatingElem = elem.cloneNode(true);
      this.floatingElem.classList.add("floating-drag");
      this.floatingElem.style.position = "absolute";
      this.floatingElem.style.pointerEvents = "none";

      // Append the cloned element to the document body
      document.body.appendChild(this.floatingElem);

      // Position the floating element at the initial touch point
      const touch = event.touches[0];
      this.updateFloatingElemPosition(touch.clientX, touch.clientY);
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
      if (this.draggedIndex >= 0) {
        const touch = event.changedTouches[0];
        let elem = this.isDropInsideDroppable(touch.clientX, touch.clientY);
        if (elem) {
          let droppedIndex = this.localAnswerOptions.findIndex(
            (a) => a.answerCode == elem.getAttribute("data-name")
          );
          this.moveOption(this.draggedIndex, droppedIndex);
        }

        document.body.removeChild(this.floatingElem);
        this.floatingElem = null;
      }
    },

    isDropInsideDroppable(dropX, dropY) {
      const mainDiv = document.querySelector("#" + this.id);
      const droppableDataNames = [
        ...new Set(this.question.answers.map((a) => a.answerCode)),
      ];
      for (let idx = 0; idx < droppableDataNames.length; ++idx) {
        let ddn = droppableDataNames[idx];
        let elem = mainDiv.querySelector("[data-name='" + ddn + "']");
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

    checkAnswers() {
      let allCorrect = true;
      this.question.answers.forEach((a) => {
        let currentAnswer = this.currentAnswers.find(
          (ca) => ca.answerCode == a.answerCode
        );
        if (a.correctOrderNo != currentAnswer.answer) allCorrect = false;
      });
      return { allCorrect, studentAnswers: this.currentAnswers };
    },
  },
};
</script>

<style scoped>
.draggable {
  cursor: move;
  opacity: 1;
}

.draggable:active {
  opacity: 0.6; /* While dragging */
}

.active-droppable {
  background-color: #dff0ff;
}
</style>


  static async getModules(curriculums, grades, practiceType) {
    // Returns modules -> topics --> curriculumGrades {curriculumId: [grades]}
      let resultset = {};
      let curriculumsArr = curriculums.join(",");
      let gradesArr = grades.join(",");
      // Execute the stored procedures to fetch modules and topics
      const [modules] = await dbService.query("sp_modules_by_curriculum_grade", [1, curriculumsArr, gradesArr, practiceType || "CONCEPTS"]);
      const [topics] = await dbService.query("sp_topics_by_curriculum_grade", [1, curriculumsArr, gradesArr, practiceType || "CONCEPTS"]);

      if (!modules) return;

      // Iterate through each module
      modules.forEach((module) => {

        let moduleId = module.moduleId;
        // If the module does not exist in the resultset, add it
        if (!resultset[moduleId]) {
          module.topics = {};
          module.curriculumIds = [];
          module.grades = [];
          module.totalTopics = 0;
          resultset[moduleId] = module;
        }
        // If the module already exists, push additional topics

        let moduleTopics = topics.filter((topic) => topic.moduleId == moduleId);

        if (moduleTopics) {
          moduleTopics.forEach((moduleTopic) => {
            let topicId = moduleTopic.topicId;
            if (!resultset[moduleId].topics[topicId]) {
              moduleTopic.curriculumGrades = {};
              resultset[moduleId].totalTopics += 1;
              resultset[moduleId].topics[topicId] = moduleTopic;
            }

            if (!resultset[moduleId].topics[topicId].curriculumGrades[moduleTopic.curriculumId]) {
              resultset[moduleId].topics[topicId].curriculumGrades[moduleTopic.curriculumId] = [moduleTopic.grade];
            } else {
              resultset[moduleId].topics[topicId].curriculumGrades[moduleTopic.curriculumId].push[moduleTopic.grade];
            }

            if (!resultset[moduleId].curriculumIds.includes(moduleTopic.curriculumId)) {
              resultset[moduleId].curriculumIds.push(moduleTopic.curriculumId);
            }
            if (!resultset[moduleId].grades.includes(moduleTopic.grade)) {
              resultset[moduleId].grades.push(moduleTopic.grade);
            }

            delete resultset[moduleId].topics[topicId].curriculumId;
            delete resultset[moduleId].topics[topicId].grade;

          })
        }
      });
      console.log (resultset);
      return resultset;
  }
}
