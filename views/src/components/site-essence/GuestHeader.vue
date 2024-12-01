<template>
  <div
    id="header"
    class="container-fluid"
    style="
      background-color: #FAEADA;
      color: #111224;
      height:60px;
    "
  >
    <div class="row d-flex align-items-center" style="height: 100%;">
      <div class="col-2">
        <a
          class="navbar-brand"
          href="#"
          >MATHLETE.AI</a
        >
      </div>
      <div class="col-6">
        Learn how the AI in mathlete.ai works to help you excel at school and popular math competitions
      </div>
      <div class="col-2" v-if="showSignUp">
        <router-link to="/signup/student">
          <base-button
            button-color="darkblue"
            button-border-color="white"
            button-color-hover="blue"
            button-border-color-hover="blue"
            button-font-color="white"
            button-font-color-hover="white"
            :hover="true"
            button-width="100%"
          >Sign Up - It's Free</base-button
          >
        </router-link>
      </div>
      <div class="col-2" v-if="showSignIn">
        <router-link to="/login">
          <base-button
            button-color="darkblue"
            button-border-color="white"
            button-color-hover="blue"
            button-border-color-hover="blue"
            button-font-color="white"
            button-font-color-hover="white"
            :hover="true"
            button-width="100%"
          >
            Sign In</base-button
          ></router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
import BaseButton from "../ui/BaseButton.vue";

export default {
  components: { BaseButton },
  props: {
    showSignUp: {
      type: Boolean,
      default:true
    },
    showSignIn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

