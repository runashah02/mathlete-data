<template>
  <div
    style="
      display: inline-block;
      margin-left: 15px;
      background-color: #d1e3ff;
      padding: 10px;
      border-radius: 4px;
    "
  >
    Score: {{ score }}
  </div>
</template>
<script>
//importing bootstrap 5, sitewide style sheets
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../../public/assets/styles.css";

export default {
  data() {
    return {
      score: 0,
    };
  },

  methods: {
    incrementScore(points) {
      this.score = this.score + points;
      console.log (this.score);
    },

    decrementScore(points) {
      this.score = this.score - points;
    },
  },
};
</script>

