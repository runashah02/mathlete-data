<template>
  <div>
    <div id="limit-reached">
      <p>The fun doesn't have to stop!</p>
      <div class="row" style="min-height: 2em">
          <div class="col-12" style="background: url('../../../assets/classroom.svg') no-repeat right top; background-size: contain;">
            <ul class="list-benefits">
            <li>Learn and master core math concepts</li>
            <li>Improve speed, logical reasoning and accuracy</li>
            <li>Unlock the power of mathlete analytics</li>
          </ul>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12">
          <base-button
            button-color="green"
          >
            <span v-if="! isMember">Become a member today!</span>
            <span v-else>Upgrade your package today!</span>
          </base-button>
          <p v-if="! isMember" style="font-size:0.85rem;width:100%;text-align:center;margin-top:10px">Already a member? <router-link to="/login">Sign In</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//importing bootstrap 5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import BaseButton from "../ui/BaseButton.vue";

export default {
  components: {
    "base-button": BaseButton,
  },

  props: {
    isMember: {
      type:Boolean,
      required: false,
      default: false
    }
  }
};
</script>
<style scoped>
.list-benefits {
  list-style-type: none; /* Remove default bullets */
  padding: 0; /* Remove default padding */
  vertical-align:middle;
}

.list-benefits li {
  position: relative;
  padding-left: 30px; /* Space for the image */
  height:40px;
  line-height:40px;
  vertical-align:middle;
}

.list-benefits li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%); /* Vertically center the image */
  width: 20px; /* Set the desired width */
  height: 20px; /* Set the desired height */
  background-image: url('../../assets/animated_tick.gif'); /* Path to your image */
  background-size: contain; /* Ensure the image scales correctly */
  background-repeat: no-repeat; /* Prevent image repetition */
}

</style>