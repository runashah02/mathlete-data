<template>
  <div>
    <base-container
      selected-menu-item="practice"
      :page-error="pageError"
      style="z-index: 999"
      :hideSideMenu="true"
    >
      <div v-if="loadingData" style="padding: 20px">
        Loading. Please wait...
      </div>
      <div v-else>
        <div class="fixed-width-content" style="padding-top: 10px">
          <audio
            id="successSound"
            src="/assets/ux/success.mp3"
            preload="auto"
          ></audio>

          <div class="row" v-if="isLimitReached">
            <div class="col-12">
              <div class="notification">
                <span style="margin-right: 10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#FD9D78"
                    class="bi bi-exclamation-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"
                    />
                  </svg>
                </span>
                You have reached your daily practice limit.
                <a href="">{{
                  systemUser ? "Upgrade your package" : "Become a member"
                }}</a>
                for unlimited practice.
              </div>
            </div>
          </div>
          <div class="question" v-if="currentView == 'QUESTION'">
            <form>
              <div id="PracticeForm">
                <span class="font-style:italic;font-size:0.9em"
                  >{{ question.sourceDetail }}.js</span
                >
                <component
                  key="'question_' + question.questionId"
                  :id="'question-' + question.questionId"
                  :is="currentQuestionComponent"
                  show="QUESTION"
                  :question="question"
                  :ref="'question_' + question.questionId"
                ></component>
              </div>
              <div class="row mt-8 mb-8">
                <div class="col-12">
                  <base-button
                    :state="submitBtnState"
                    loading="Saving"
                    button-color="green"
                    button-width="200px"
                    @click.prevent="checkAnswers"
                    v-if="!isLimitReached"
                    >Submit</base-button
                  >
                </div>
              </div>
              <!--- Added for testing. Remove in production --->
            </form>
          </div>
          <div v-else>
            <h1>Sorry, Incorrect Answer</h1>
            <div class="mt-4 mb-4">
              <span style="font-weight: bold">The correct answer is:</span>
              <component
                :id="'correct-answers-' + question.questionId"
                :is="currentQuestionComponent"
                show="CORRECT_ANSWERS"
                :question="question"
                :ref="'correct_answers_' + question.questionId"
                style="pointer-events: none"
              ></component>
            </div>
            <div class="row mt-8 mb-8">
              <div class="col-12">
                <base-button
                  :state="submitBtnState"
                  loading="Saving"
                  button-color="green"
                  button-width="200px"
                  @click.prevent="nextQuestion"
                  >Got It!</base-button
                >
              </div>
            </div>
            <div class="mt-4 mb-4">
              <span style="font-weight: bold">You answered:</span>
              <component
                :id="'student-answers-' + question.questionId"
                :is="currentQuestionComponent"
                show="STUDENT_ANSWERS"
                :question="question"
                :ref="'student_answers_' + question.questionId"
                style="pointer-events: none"
              ></component>
            </div>

            <div class="mt-4 mb-4" v-if="question.explanation != 'NONE'">
              <span style="font-weight: bold">Explanation:</span>
              <br /><br />
              <component
                :id="'explanation-' + question.questionId"
                :is="currentQuestionComponent"
                show="EXPLANATION"
                :question="question"
                :ref="'explanation_' + question.questionId"
                style="pointer-events: none"
              ></component>
            </div>
            <div class="row mt-8 mb-8">
              <div class="col-12">
                <base-button
                  :state="submitBtnState"
                  loading="Saving"
                  button-color="green"
                  button-width="200px"
                  @click.prevent="nextQuestion"
                  >Got It!</base-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </base-container>

    <!-- Limit reached modal -->
    <draggable-modal
      id="limit-reached-modal"
      modal-title="Daily practice limit reached"
      ref="limitReachedModal"
    >
      <limit-reached-notification
        ref="limitReachedNotification"
        :is-member="systemUser ? true : false"
      ></limit-reached-notification>
    </draggable-modal>
  </div>
</template>
<script>
//importing bootstrap 5, sitewide style sheets
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../../public/assets/styles.css";
import "../../../public/assets/questions.css";

//importing basecomponents for the page
import BaseContainer from "../ui/BaseContainer.vue";
import BaseButton from "../ui/BaseButton.vue";
import DraggableModal from "../../components/ui/BaseDraggableModal";
import LimitReachedNotification from "./LimitReachedNotification";

import { useToast } from "vue-toastification";

import ScoreBoard from "./ScoreBoard.vue";
import SolvedExampleLink from "./SolvedExampleLink.vue";
import PracticeTimer from "./PracticeTimer.vue";

import FillInTheBlanks from "./question-types/FillInTheBlanks.vue";
import MultipleChoice from "./question-types/MultipleChoice.vue";
import ClickToAdd from "./question-types/ClickToAdd.vue";

import DragAndDrop from "./question-types/DragAndDrop.vue";
import OrderRearrangement from "./question-types/OrderRearrangement.vue";

import axios from "axios";
import config from "@/config";

export default {
  components: {
    "base-container": BaseContainer,
    "base-button": BaseButton,
    "draggable-modal": DraggableModal,
    "score-board": ScoreBoard,
    "solved-example-link": SolvedExampleLink,
    "limit-reached-notification": LimitReachedNotification,
    timer: PracticeTimer,
    FillInTheBlanks,
    MultipleChoice,
    ClickToAdd,
    DragAndDrop,
    OrderRearrangement,
  },

  data() {
    return {
      loadingData: false,
      formSubmitted: false,
      showOverlay: false,
      systemUser: null,
      currentView: "QUESTION",
      question: {},
      dataSource: "",
      questionId: 0,
      fileName: "",
      folderName: "",
      questionNo: 0,
      isLimitReached: false,
      questionLog: {
        studentId: null,
        practiceSessionId: null,
        questionId: null,
        solved: null,
        presentedAt: null,
        solvedAt: null,
        activeTimeInSecs: 0,
        allCorrect: null,
        points: 0,
        totalPoints: 0,
      },
      practiceSessionId: null,
      pageError: null,
      isDoodleMode: false,
      isDrawing: false,
      context: null,
    };
  },

  computed: {
    currentQuestionComponent() {
      if (!this.question) return null;
      switch (this.question.questionType) {
        case "FILL_IN_THE_BLANKS":
          return "FillInTheBlanks";
        case "SHORT_ANSWERS":
          return "FillInTheBlanks";
        case "MULTIPLE_CHOICE":
          return "MultipleChoice";
        case "MULTIPLE_SELECT":
          return "MultipleChoice";
        case "DRAG_AND_DROP":
          return "DragAndDrop";
        case "CLICK_TO_ADD":
          return "ClickToAdd";
        case "ORDER_REARRANGEMENT":
          return "OrderRearrangement";
        default:
          return null;
      }
    },
    submitBtnState() {
      return this.formSubmitted ? "loading" : undefined;
    },
  },

  beforeMount() {
    this.systemUser = JSON.parse(
      sessionStorage.getItem("systemUser") || localStorage.getItem("systemUser")
    );
    if (this.$route.path.startsWith("/practice/json/")) {
      this.dataSource = "json";
      this.folderName = this.$route.params.folderName;
      this.fileName = this.$route.params.fileName;
      this.questionId = this.$route.params.id;
    } else {
      this.dataSource = "data";
      this.practiceSessionId = parseInt(this.$route.params.practiceSessionId);
      this.questionId = parseInt(this.$route.params.questionId || 0);
      this.getPracticeSessionById(this.practiceSessionId);
    }
    //this.questionNo = parseInt(this.$route.params.id);
    this.fetchQuestion();
  },

  mounted() {
    this.questionLog.studentId = this.systemUser?.systemUserId;
    this.questionLog.practiceSessionId = this.practiceSessionId;
  },

  methods: {
    async fetchQuestion() {
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

        let response;
        if (this.dataSource == "json") {
          response = await axios.get(
            `${config.apiEndpoint}/question/${this.dataSource}/${this.folderName}/${this.fileName}/${this.questionId}`,
            axiosConfig
          );
        } else {
          if (this.questionId > 0) {
            response = await axios.get(
              `${config.apiEndpoint}/question/data/${this.questionId}`,
              axiosConfig
            );
          } else {
            response = await axios.get(
              `${config.apiEndpoint}/practice/${this.practiceSessionId}`,
              axiosConfig
            );
          }
        }

        this.question = response.data.question;
        /*
        if (this.question.questionType == "GROUP_QUESTION") {
          this.questionNo = this.questionNo + 1;
          this.fetchQuestion();
        }
*/
        this.questionLog.questionId = this.question.questionId;
        this.questionLog.presentedAt = new Date();
      } catch (error) {
        console.log(error);
        if (!(error && error?.response?.status)) {
          this.pageError = 500;
        } else {
          if (error.response.status == "401") {
            // Unauthorized Login - No authentication token provided
            this.$router.push("/login");
          } else if (error.response.status == "403") {
            // Forbidden Access - The role does not permit access to the resource
            this.$router.push("/403");
          } else if (error.response.status == "429") {
            this.isLimitReached = true;
            this.checkLimit();
          } else {
            this.pageError = 500;
            // Internal Server Error
            //this.$router.push("/500");
          }
        }
      } finally {
        this.loadingData = false;
      }
    },

    async getPracticeSessionById(practiceSessionId) {
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

        const response = await axios.get(
          `${config.apiEndpoint}/practiceSession/${practiceSessionId}`,
          axiosConfig
        );

        this.practiceSession = response.data.practiceSession;
      } catch (error) {
        console.log(error);
        if (!(error && error.response && error.response.status))
          this.pageError = 500;
        //this.$router.push("/500");
        if (error.response.status == "401") {
          // Unauthorized Login - No authentication token provided
          this.$router.push("/login");
        } else if (error.response.status == "403") {
          // Forbidden Access - The role does not permit access to the resource
          this.$router.push("/403");
        } else if (error.response.status == "429") {
          this.isLimitReached = true;
          this.checkLimit();
        } else {
          // Internal Server Error
          //this.$router.push("/500");
          this.pageError = 500;
        }
      } finally {
        this.loadingData = false;
      }
    },

    checkLimit() {
      if (this.isLimitReached) {
        this.$refs.limitReachedModal.open();
      }
    },

    nextQuestion() {
      //      this.questionNo = this.questionNo + 1;
      this.currentView = "QUESTION";
      if (this.dataSource == "json") {
        this.questionId++;
        this.fetchQuestion();
      } else {
        this.fetchQuestion();
      }
    },

    async checkAnswers() {
      this.questionLog.solvedAt = new Date();
      const refName = "question_" + this.question.questionId;
      let response = this.$refs[refName].checkAnswers();
      if (!response) return;
      let allCorrect = response.allCorrect;
      let studentAnswers = response.studentAnswers;

      this.questionLog.allCorrect = allCorrect;
      this.questionLog.studentAnswers = studentAnswers;
      this.questionLog.points = response.points;
      this.questionLog.totalPoints = response.totalPoints;
      this.question.studentAnswers = studentAnswers;
      if (allCorrect) {
        this.showOverlay = true;
        document.getElementById("successSound").play();
        const toast = useToast();
        let successMsgs = [
          "Well Done!",
          "Correct!",
          "Keep it up!",
          "Great!",
          "Excellent!",
          "Awesome!",
        ];
        let rand = Math.floor(Math.random() * successMsgs.length);
        let toastMsg = successMsgs[rand];
        toast.success(toastMsg, {
          position: "top-center",
          hideProgressBar: true,
          closeButton: false,
          timeout: 1000,
          onClose: async () => {
            this.showOverlay = false;
            this.$refs.score.incrementScore(1);
            if (this.systemUser && this.dataSource != "json")
              await this.addQuestionLogEntry();
            this.nextQuestion();
          },
        });
      } else {
        if (this.systemUser && this.dataSource != "json")
          await this.addQuestionLogEntry();
        this.currentView = "SOLUTION";
      }
    },

    async addQuestionLogEntry() {
      try {
        this.formSubmitted = true;
        const axiosConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              (sessionStorage.getItem("authtoken") ||
                localStorage.getItem("authtoken")),
          },
        };
        this.questionLog.studentId = this.systemUser.systemUserId;

        await axios.post(
          `${config.apiEndpoint}/questionLog`,
          { questionLog: this.questionLog },
          axiosConfig
        );
        this.showOverlay = true;
      } catch (error) {
        console.log(error);
        if (error.response.status == "401") {
          this.$router.push("/login");
        } else if (error.response.status == "403") {
          this.$router.push("/403");
        } else {
          this.pageError = 500;
          //this.$router.push("/500");
        }
      } finally {
        this.formSubmitted = false;
      }
    },

    toggleDoodleMode() {
      this.isDoodleMode = !this.isDoodleMode;
      if (this.isDoodleMode) {
        // Set up canvas
        this.$nextTick(() => {
          const canvas = this.$refs.doodleCanvas;
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          this.context = canvas.getContext("2d");
          this.context.strokeStyle = "black";
          this.context.lineWidth = 2;

          // Enable pointer events when doodle mode is active
          canvas.style.pointerEvents = "auto";
        });
      } else {
        // Disable pointer events to prevent interaction when doodle mode is off
        const canvas = this.$refs.doodleCanvas;
        canvas.style.pointerEvents = "none";
        this.isDrawing = false;
      }
    },

    startDrawing(event) {
      event.preventDefault();
      this.isDrawing = true;
      this.context.beginPath();
      this.context.moveTo(event.clientX, event.clientY);
    },
    draw(event) {
      if (!this.isDrawing) return;
      this.context.lineTo(event.clientX, event.clientY);
      this.context.stroke();
    },
    stopDrawing() {
      this.isDrawing = false;
      this.context.closePath();
    },
  },
};
</script>
<style scoped>
.doodle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1; /* Higher than the form to overlay */
  pointer-events: none; /* Allow form interaction */
}

::v-deep span.em-answer {
  font-weight: bold;
}
</style>
