<template>
  <div>
    <support-header></support-header>
    <div
      class="container-fluid"
      style="display: flex; justify-content: center; align-items: center"
    >
      <div style="width: 1000px">
        <div class="row mt-8">
          <div
            class="col-4"
            v-for="category in helpCategories"
            :key="category.helpCategoryId"
          >
            <router-link :to="'/support/faqs/' + category.helpCategoryId" class="router-link" style="color:black">
              <div class="option-box" style="margin: 10px">
                <div class="icon">
                  <div class="mb-3">
                    <img :src="'/assets/' + category.categoryIcon" width="35" />
                  </div>
                  <span style="font-weight: bold">{{
                    category.categoryName
                  }}</span>
                </div>
                <div class="option-text">
                  {{ category.categoryDesc }}
                </div>
                <div
                  class="articles-count"
                  style="text-align: right; font-size: 0.9em; color: #777777"
                >
                  {{ category.questionCount }} articles
                </div>
              </div>
            </router-link>
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
import SupportHeader from "./SupportHeader.vue";

import axios from "axios";
import config from "@/config";

export default {
  components: {
    "support-header": SupportHeader,
  },
  data() {
    return {
      helpCategories: [],
    };
  },

  beforeMount() {
    this.fetchHelpCategories();
  },

  methods: {
    async fetchHelpCategories() {
      this.loadingData = true;
      try {
        const response = await axios.get(
          `${config.apiEndpoint}/support/categories`
        );
        this.helpCategories = response.data.helpCategories;
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
.flex-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.option-box {
  height: 300px;
  border-radius: 8px;
  padding: 30px;
  border: 2px solid #e3e3e3;
  transition: border-color 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.option-box:hover {
  border-color: #e3e3e3;
}

.articles-count {
  text-align: right;
  font-size: 0.8em;
  color: #333333;
  margin-top: auto;
}
</style>