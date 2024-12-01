        <div class="row mt-8">
          <div class="col-12">
            <div class="icon">
              <div class="mb-3">
                <img :src="'/assets/' + category.categoryIcon" width="55" />
              </div>
              <h1>{{ category.categoryName }}</h1>
            </div>
            <div class="option-text">
              {{ category.categoryDesc }}
            </div>
            <div
              class="articles-count"
              style="font-size: 0.9em; color: #777777"
            >
              {{ category.questionCount }} articles
            </div>
          </div>
        </div>


<template>
  <div>
    <div class="accordion" style="margin-top: 20px; border: none !important">
      <div
        class="accordion-item"
        v-for="day in practiceSummary"
        :key="day.practiceSummaryId"
      >
        <span class="accordion-header" :id="'heading' + day.practiceSummaryId">
          <button
            class="accordion-button"
            data-bs-toggle="collapse"
            :data-bs-target="'#review-' + day.practiceSummaryId"
          >
            {{ formatPracticeDt(day.practiceDt) }} |
            {{ day.questionsAttempted }} questions |
            {{ formatTime(day.timeSpentInSecs) }}
          </button>
        </span>
        <div
          :id="'review-' + day.practiceSummaryId"
          class="accordion-collapse collapse"
        >
          <div class="accordion-body">
            <div
              class="row"
              v-for="question in day.questions"
              :key="'question-' + question.questionLogId"
              style="
                border-bottom: 1px solid lightgray;
                padding-bottom: 20px;
                margin-bottom: 20px;
              "
            >
              <div class="col-1">
                <img
                  src="../../assets/tick.png"
                  width="20"
                  height="20"
                  v-if="question.allCorrect == 1"
                />
                <img
                  src="../../assets/cross.png"
                  width="20"
                  height="20"
                  v-else
                />

              </div>
              <div class="col-11">
                <question-log :question="question"></question-log>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../../public/assets/styles.css";
const { format } = require("date-fns");

import QuestionLog from "./QuestionLog.vue";

import axios from "axios";
import config from "@/config";

export default {
  components: {
    QuestionLog,
  },

  props: {
    month: {
      type: Number,
      required: false,
      default: 10,
    },
    year: {
      type: Number,
      required: false,
      default: 2024,
    },
    questionLog: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      systemUser: undefined,
      practiceSummary: [],
      questions: [],
      loadingData: false,
      activePracticeDt: null,
      showOverlay: false,
    };
  },

  beforeMount() {
    this.systemUser = JSON.parse(
      sessionStorage.getItem("systemUser") || localStorage.getItem("systemUser")
    );
    if (this.systemUser) {
      this.fetchPracticeSummary();
    } else {
      this.$router.push("/login");
    }
  },

  methods: {
    currentQuestionComponent(questionType) {
      switch (questionType) {
        case "FILL_IN_THE_BLANKS":
          return "FillInTheBlanks";
        case "MULTIPLE_CHOICE":
          return "MultipleChoice";
        case "MULTIPLE_SELECT":
          return "MultipleChoice";
        default:
          return null;
      }
    },

    formatPracticeDt(dtString) {
      return format(new Date(dtString), "dd-MMM-yyyy");
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    },

    async fetchPracticeSummary() {
      this.loadingData = true;
      try {
        const axiosConfig = {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization:
              "Bearer " +
              (sessionStorage.getItem("authtoken") ||
                localStorage.getItem("authtoken")),
          },
        };

        const response = await axios.post(
          `${config.apiEndpoint}/practiceSummary`,
          {
            month: 10,
            year: 2024,
          },
          axiosConfig
        );
        let practiceSummary = response.data.practiceSummary;
        practiceSummary.forEach((pc) => {
          let practiceDtTm = new Date(pc.practiceDt);
          let practiceDt = practiceDtTm.toLocaleDateString("en-IN");

          let questions = this.questionLog.filter((q) => {
            let solvedAtDtTm = new Date(q.solvedAt);
            let solvedAtDt = solvedAtDtTm.toLocaleDateString("en-IN");
            console.log(practiceDt + " ############### " + solvedAtDt);
            return solvedAtDt === practiceDt;
          });
          pc.questions = questions;
        });

        this.practiceSummary = practiceSummary;
      } catch (error) {
        console.log(error);
        if (error.response.status == "401") {
          // Unauthorized Login - No authentication token provided
          this.$router.push("/login");
        } else if (error.response.status == "403") {
          // Forbidden Access - The role does not permit access to the resource
          this.$router.push("/403");
        } else {
          // Internal Server Error
          //this.$router.push("/500");
          console.log(error);
        }
      } finally {
        this.loadingData = false;
      }
    },
  },
};
</script>

<style scoped>
.card-header .btn-link {
  text-decoration: none;
}
::v-deep table {
  border: 0px;
}
::v-deep td {
  border: 0px;
}

::v-deep table.embed-tbl-grid td {
  border: 3px solid #b7e7fb;
}
::v-deep td {
  padding: 10px;
}
::v-deep .bold-text {
  font-weight: bold;
}
::v-deep table.embed-tbl-grid {
  border: 3px solid #b7e7fb;
}
::v-deep table {
  width: auto;
}

.solution-card {
  pointer-events: none;
}

::v-deep .highlight {
  display: inline-block;
  padding: 10px;
  background-color: #c6deef;
  border: 1px solid #4394cc;
  border-radius: 2px;
  margin: 10px;
}

.draggable-option {
  border: 3px solid #e3e3e3;
  padding: 10px;
  border-radius: 8px;
  cursor: crosshair;
  margin-right: 10px;
}

.answer-option {
  border: 2px solid transparent;
  padding: 10px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 8px;

  background-color: var(--bg-color);
  border-color: var(--border-color);
}

.answer-option:hover {
  background-color: var(--hover-bg-color);
  border-color: var(--hover-border-color);
}

.selected {
  background-color: var(--select-bg-color) !important;
  border-color: var(--select-border-color) !important;
}
</style>
