<template>
  <div>
    <support-header></support-header>
    <div
      class="container-fluid"
      style="display: flex; justify-content: center; align-items: center"
    >
      <div style="width: 1000px">
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
              class="articles-count mt-4"
              style="font-size: 0.9em; color: #777777"
            >
              {{ category.questionCount }} articles
            </div>
          </div>
        </div>

        <div class="row mt-8">
          <div class="col-12">
            <div class="accordion" id="faq-accordion">
              <div
                class="accordion-item"
                v-for="question in faqs"
                :key="question.helpQuestionId"
              >
                <span class="accordion-header">
                  <button
                    class="accordion-button"
                    data-bs-toggle="collapse"
                    :data-bs-target="'#answer-' + question.helpQuestionId"
                  >
                    {{ question.question }}
                  </button>
                </span>
                <div
                  class="accordion-collapse collapse"
                  data-bs-parent="#faq-accordion"
                  :id="'answer-' + question.helpQuestionId"
                >
                  <div class="accordion-body">
                    {{ question.answer }}
                  </div>
                </div>
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
import SupportHeader from "../site-essence/SupportHeader.vue";

import axios from "axios";
import config from "@/config";

export default {
  components: {
    "support-header": SupportHeader,
  },
  data() {
    return {
      category: {},
      faqs: [],
    };
  },

  beforeMount() {
    this.fetchFAQs();
  },

  methods: {
    async fetchFAQs() {
      this.loadingData = true;
      try {
        const response = await axios.get(
          `${config.apiEndpoint}/support/faqs/${this.$route.params.categoryId}`
        );
        this.category = response.data.helpCategory;
        this.faqs = response.data.questions;
      } catch (error) {
        console.log(error);
        //Internal Server Error
        this.$router.push("/500");
      } finally {
        this.loadingData = false;
      }
    },
  },
};
</script>
<style scoped>
</style>