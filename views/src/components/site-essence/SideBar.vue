<template>
  <div
    class="sidebar"
    ref="sidebar"
    id="sidebar"
    style="overflow-x: visible !important"
  >
    <div class="menu-item">
      <div class="menu-icon" @click="resize">
        <img src="../../assets/menu.svg" width="32" />
      </div>
      <span>mathlete.ai</span>
    </div>
    <div
      :class="{ 'menu-item': true, selected: selectedMenuItem == 'practice' }"
      id="practice-link"
    >
      <router-link to="/welcome/student" class="menu-item-link">
        <div class="menu-icon">
          <img src="../../assets/practice.svg" width="32" />
        </div>
        Practice
      </router-link>
    </div>
    <div
      :class="{
        'menu-item': true,
        selected: selectedMenuItem == 'reward-chart',
      }"
      id="reward-chart-link"
    >
      <router-link
        to="/reward-chart"
        style="color: white; text-decoration: none;"
        onmouseover="this.style.color='#85b1f8'"
        onmouseout="this.style.color='white'"
        class="menu-item-link"
      >
        <div class="menu-icon">
          <img src="../../assets/reward-chart.svg" width="32" />
        </div>
        Reward Chart
      </router-link>
    </div>
    <div
      :class="{
        'menu-item': true,
        selected: selectedMenuItem == 'review',
      }"
      id="review-link"
    >
      <router-link
        to="/review-questions"
        style="color: white; text-decoration: none;"
        onmouseover="this.style.color='#85b1f8'"
        onmouseout="this.style.color='white'"
        class="menu-item-link"
      >
        <div class="menu-icon">
          <img src="../../assets/review.svg" width="32" />
        </div>
        Review
      </router-link>
    </div>
    <div
      class="menu-item"
      :class="{
        'menu-item': true,
        selected: selectedMenuItem == 'my-account',
      }"
      id="my-account-link"
    >
      <router-link
        to="/my-account"
        style="color: white; text-decoration: none;"
        onmouseover="this.style.color='#85b1f8'"
        onmouseout="this.style.color='white'"
        class="menu-item-link"
      >
        <div class="menu-icon">
          <div
            style="
              width: 42px;
              height: 42px;
              line-height: 42px;
              background-color: #354865;
              border-radius: 2px;
              vertical-align: middle;
              text-align: center;
              
            "
          >
            <img :src="systemUser?.userThumbnail" height="38" v-if="systemUser?.userThumbnail"/>
            <div v-else style="background-color:#bf360c;border-radius:2px">{{ systemUser?.initials }}</div>
          </div>
        </div>
        My Account
      </router-link>
    </div>
    <div
      :class="{
        'menu-item': true,
        selected: selectedMenuItem == 'support',
      }"
      id="support-link"
    >
      <a
        href="/support"
        style="color: white; text-decoration: none;"
        onmouseover="this.style.color='#85b1f8'"
        onmouseout="this.style.color='white'"
        class="menu-item-link"
        target="_blank"
        
      >
        <div class="menu-icon">
          <img src="../../assets/support.svg" width="32" />
        </div>
        Support
      </a>
    </div>

    <div
      class="menu-item"
      :class="{
        'menu-item': true,
        selected: selectedMenuItem == 'signout',
      }"
      id="signout-link"
    >
      <router-link
        to="/signout"
        style="color: white; text-decoration: none;"
        onmouseover="this.style.color='#85b1f8'"
        onmouseout="this.style.color='white'"
        class="menu-item-link"
      >
        <div class="menu-icon">
          <img src="../../assets/signout.svg" width="32" />
        </div>
        Sign Out</router-link
      >
    </div>
    <!--
    <div v-if="systemUser?.currentPlan.isFree == 'NO'" style="padding:15px">
      <base-button button-color="brightgreen"><img src="../../assets/small-yellow-star.svg" width="20" style="margin:5px;margin-right:15px"/>Upgrade!</base-button>
    </div>
    -->
  </div>

  <!-- tooltips -->
  <div id="practice-tooltip" class="menu-item-tooltip" role="tooltip">
    <div>Practice</div>
    <div id="arrow" data-popper-arrow></div>
  </div>
  <div id="reward-chart-tooltip" class="menu-item-tooltip" role="tooltip">
    <div>Reward Chart</div>
    <div id="arrow" data-popper-arrow></div>
  </div>
  <div id="review-tooltip" class="menu-item-tooltip" role="tooltip">
    <div>Review</div>
    <div id="arrow" data-popper-arrow></div>
  </div>
  <div id="my-account-tooltip" class="menu-item-tooltip" role="tooltip">
    <div>My Account</div>
    <div id="arrow" data-popper-arrow></div>
  </div>
  <div id="support-tooltip" class="menu-item-tooltip" role="tooltip">
    <div>Support</div>
    <div id="arrow" data-popper-arrow></div>
  </div>
  <div id="signout-tooltip" class="menu-item-tooltip" role="tooltip">
    <div>Sign Out</div>
    <div id="arrow" data-popper-arrow></div>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../../public/assets/styles.css";
//import BaseButton from "../ui/BaseButton.vue";
import { createPopper } from "@popperjs/core";

export default {
  components: {
    //"base-button": BaseButton,
  },  
  props: {
    selectedMenuItem: {
      Type: String,
    },
    state: null,
  },
  emits: ["resize"],
  methods: {
    expand() {
      document.getElementById("sidebar").style.width = "200px";
      localStorage.setItem("sidebar", "expanded");
      this.$emit("resize", 200);
    },
    collapse() {
      document.getElementById("sidebar").style.width = "0px";
      localStorage.setItem("sidebar", "collapsed");
      this.$emit("resize", 0);
    },
    minimize() {
      document.getElementById("sidebar").style.width = "68px";
      localStorage.setItem("sidebar", "minimized");
      this.$emit("resize", 75);
    },
    isExpanded() {
      return document.getElementById("sidebar").style.width == "200px";
    },
    isCollapsed() {
      return document.getElementById("sidebar").style.width == "0px";
    },
    isMinimized() {
      return document.getElementById("sidebar").style.width == "68px";
    },
    resize() {
      // If the screenwidth < 768, hide the menu, emit an event and return

      let screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        this.collapse();
        return;
      }

      // Else toggle between a full menu and an icon menu
      if (this.isExpanded()) {
        this.minimize();
      } else {
        this.expand();
      }
    },
    createSubmenuLogic(button, tooltip) {
      const popperInstance = createPopper(button, tooltip, {
        placement: "right",
        strategy: "fixed",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });

      return {
        toggle() {
          if (!tooltip.hasAttribute("data-show")) {
            tooltip.setAttribute("data-show", "");
            popperInstance.update();
          } else {
            tooltip.removeAttribute("data-show");
          }
        },
        handleClickOutside(event) {
          if (
            !tooltip.contains(event.target) &&
            !button.contains(event.target)
          ) {
            tooltip.removeAttribute("data-show");
          }
        },
      };
    },

    createTooltipLogic(button, tooltip, sidebar) {
      const popper = createPopper(button, tooltip, {
        placement: "right",
        strategy: "fixed",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });

      button.addEventListener("mouseenter", () => {
        if (sidebar.style.width == "68px") {
          tooltip.setAttribute("data-show", "");
          popper.update();
        }
      });

      button.addEventListener("mouseleave", () => {
        tooltip.removeAttribute("data-show");
      });
    },
  },
  data() {
    return {
      tooltip1: null,
      tooltip2: null,
      tooltip3: null,
      tooltip4: null,
      tooltip5: null,
      tooltip6: null,
      systemUser: undefined,
    };
  },
  beforeMount() {
    this.systemUser = JSON.parse(
      sessionStorage.getItem("systemUser") || localStorage.getItem("systemUser")
    );
  },
  mounted() {
    if (localStorage.getItem("sidebar") == "expanded") this.expand();
    if (localStorage.getItem("sidebar") == "minimized") this.minimize();

    let sidebar = this.$refs.sidebar;

    this.tooltip1 = this.createTooltipLogic(
      document.querySelector("#practice-link"),
      document.querySelector("#practice-tooltip"),
      sidebar
    );
    this.tooltip2 = this.createTooltipLogic(
      document.querySelector("#reward-chart-link"),
      document.querySelector("#reward-chart-tooltip"),
      sidebar
    );
    this.tooltip3 = this.createTooltipLogic(
      document.querySelector("#review-link"),
      document.querySelector("#review-tooltip"),
      sidebar
    );
    this.tooltip4 = this.createTooltipLogic(
      document.querySelector("#support-link"),
      document.querySelector("#support-tooltip"),
      sidebar
    );

    this.tooltip5 = this.createTooltipLogic(
      document.querySelector("#my-account-link"),
      document.querySelector("#my-account-tooltip"),
      sidebar
    );
    this.tooltip6 = this.createTooltipLogic(
      document.querySelector("#signout-link"),
      document.querySelector("#signout-tooltip"),
      sidebar
    );
  },
};
</script>

<style scoped>
.menu-item {
  width: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
}
.menu-item:hover {
  color: #85b1f8;
}

.menu-item.selected {
  border-left: 5px solid;
  border-color: #0d64f2;
  background-color: #062a66;
}

.submenu-item {
  width: 100%;
  padding: 10px;
}
.submenu-item:hover {
  color: #85b1f8;
}

.menu-icon {
  display: inline-flex;
  width: 52px;
  cursor: pointer;
}

.menu-item {
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

i,
svg {
  transform: scale(1.2);
}

.menu-icon i {
  stroke-width: 8px;
}

.sidebar {

  min-height:100%;
  overflow-y: auto;
  background-color: #111224;
  color: white;
  transition: width 0.5s ease;
}

.submenu {
  background-color: white;
  color: #4a5b78;
  font-weight: bold;
  padding: 10px;
  font-size: 1em;
  border-radius: 4px;
  display: none;
  z-index: 99999;
  border: 1px solid lightgray;
}
.submenu[data-show] {
  display: block;
}

.menu-item-tooltip {
  background-color: #111224;
  color: white;
  font-weight: bold;
  padding: 10px;
  font-size: 1em;
  border-radius: 4px;
  display: none;
  z-index: 99999;
  border: 1px solid lightgray;
}

.menu-item-tooltip[data-show] {
  display: block;
}

#arrow,
#arrow::before {
  position: absolute;
  width: 12px;
  height: 12px;
  background: inherit;
  border-right: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: "";
  transform: rotate(45deg);
}

.submenu[data-popper-placement^="right"] > #arrow {
  left: -8px;
  /* Change the width and height for the right arrow */
  width: 12px;
  height: 12px;
  /* Adjust the position of the arrow */
  top: calc(50% - 6px);
}

/* Rotate the arrow differently for right placement */
.submenu[data-popper-placement^="right"] > #arrow::before {
  transform: rotate(135deg);
}

.menu-item-tooltip[data-popper-placement^="right"] > #arrow {
  left: -6px;
  /* Change the width and height for the right arrow */
  width: 12px;
  height: 12px;
  /* Adjust the position of the arrow */
  top: calc(50% - 6px);
}

/* Rotate the arrow differently for right placement */
.menu-item-tooltip[data-popper-placement^="right"] > #arrow::before {
  transform: rotate(135deg);
}

.submenu-link {
  text-decoration: none;
  color: #4a5b78;
}

.submenu-link:hover {
  color: #0d6efd;
}

.menu-item-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}
</style>
