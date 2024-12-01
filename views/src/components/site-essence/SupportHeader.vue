<template>
  <div
    id="support-header"
    class="container-fluid"
    style="
      background-color: #111224;
      color: #ffffff;
      border-bottom: 2px solid #062a66;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div class="fixed-width-content" style="width:1000px">
      <div class="row mt-12">
        <div class="col-12">
          <a class="navbar-brand" href="#"
            ><h1>mathlete.ai</h1></a>
        </div>
      </div>
      <div class="row mt-12">
        <div class="col-12">
          <h1>Advice and answers from the Mathlete team</h1>
        </div>
      </div>
      <div class="row mb-8">
        <div class="col-12">
          <base-input
            type="text"
            id="search-support"
            label=""
            addonLeftIcon="bi-envelope"
            placeholder="Search for articles..."
            v-model.trim="searchSupport"
            :no-error="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../../../public/assets/styles.css";

import BaseInput from "../ui/BaseInput.vue";

export default {
  components: {
    "base-input": BaseInput,
  },

  beforeMount () {
    this.fetchFaqCategories ();
  },

  data() {
    return {};
  },

  methods: {
    async fetchFaqCategories (){

    }
  },
};
</script>

