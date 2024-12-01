<template>
  <div>
    <guest-header :showSignUp="true" :showSignIn="true"></guest-header>
    <form @submit.prevent="submitForm">
      <div
        class="container-fluid page-content-centered"
        style="min-height: calc(100vh-200px); background-color: #faeada"
      >
        <table>
          <tr>
            <td></td>
            <td>
              <span style="font-size: 2.5em"
                >Math training done right</span
              >
              Your ultimate math trainer. How you train matters.
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <span style="font-size: 2.5em"
                >Step aside, turtles and hares.</span
              >
              <br />
              <span style="font-size: 2.5em">
                Mathletes are here to reign!</span
              >
            </td>
            <td>
              <span style="font-size: 1.5em">1,22,73,947+</span
              ><span style="font-size: 1.5em"> challenging math questions</span>
              <br />
              <span style="font-size: 1.5em">
                covering all elementary and middle school topics</span
              >
              <br />
              The only resource you will ever need to practice Math.
            </td>
          </tr>
          <tr>
            <td>
              <div style="border: 20px solid #efcdaa; border-radius: 8px">
                <practice-focus-areas :showInstruction="false" />
              </div>
            </td>
            <td>
              <img src="/assets/ux/mascot.png" width="400" />
            </td>
          </tr>
        </table>
      </div>
    </form>
    <div style="height: 100px; line-height: 100px; vertical-align: middle">
      <span style="margin-left: 20px; margin-right: 20px">IPM</span>
      <span style="margin-left: 20px; margin-right: 20px">Mental Math</span>
    </div>
  </div>
</template>

<script>
//importing bootstrap 5
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../../../public/assets/styles.css";

//importing vuelidate
import GuestHeader from "../site-essence/GuestHeader.vue";
import PracticeFocusAreas from "../practice-config/PracticeFocusAreas";

export default {
  components: {
    GuestHeader,
    PracticeFocusAreas,
  },

  data() {
    return {};
  },

  methods: {},
};
</script>
<style scoped>
body {
  background-color: #faeada;
}
</style>
