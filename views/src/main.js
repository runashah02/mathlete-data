import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

// Import Bootstrap

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

// Import vue-toastification

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Import vue-confetti

import VueConfetti from "vue-confetti";

// Import vuetify

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

// Import all the Application Vue Files
import App from "./App.vue";
import InternalServerError from "./components/site-essence/InternalServerError.vue";
import ResourceNotFound from "./components/site-essence/ResourceNotFound.vue";
import ForbiddenAccess from "./components/site-essence/ForbiddenAccess.vue";
import PracticeForm from "./components/practice/PracticeForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/500",
      name: "InternalServerError",
      component: InternalServerError,
    },
    {
      path: "/404",
      name: "ResourceNotFound",
      component: ResourceNotFound,
    },
    {
      path: "/403",
      name: "ForbiddenAccess",
      component: ForbiddenAccess,
    },
     {
      path: "/practice/json/:folderName/:fileName/:id",
      component: PracticeForm,
     },
  ],
});

export default router;

const app = createApp(App);

app.use(router);

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
});

app.use(VueConfetti);
app.use(vuetify);

app.mount("#app");
