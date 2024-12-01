<template>
  <div>
    <div v-if="pageError === 500">
      <internal-server-error></internal-server-error>
    </div>
    <div v-else>
      <div class="topbar" ref="topbar" style="width: 100%">
        <top-bar @listClicked="expandMenu"></top-bar>
      </div>
      <div class="wrapper" ref="wrapper">
        <div
          class="sidebar"
          ref="sidebar"
          :style="{ width: sidebarWidth + 'px' }"
          v-if="!hideSideMenu"
        >
          <side-bar
            ref="sidebarMenu"
            :selected-menu-item="selectedMenuItem"
            @resize="updateMargin"
          />
        </div>
        <div class="main-content" ref="mainContent">
          <div class="main-content-inner">
            <div class="fixed-width-content">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../site-essence/SideBar.vue";
import TopBar from "../site-essence/TopBar.vue";
import InternalServerError from "../site-essence/InternalServerError.vue";

export default {
  components: {
    "side-bar": SideBar,
    "top-bar": TopBar,
    InternalServerError,
  },
  props: {
    selectedMenuItem: String,
    defaultSidebarWidth: {
      type: Number,
      default: 200,
    },
    showOverlay: {
      type: Boolean,
      default: false,
      required: false,
    },
    hideSideMenu: {
      type: Boolean,
      default: false,
      required: false,
    },    
    pageError: {
      type: Number,
      default: 0,
      required: false,
    },
    loadingData: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      sidebarWidth: this.defaultSidebarWidth,
      wrapperHeight: "100vh",
    };
  },
  methods: {
    updateMargin(sidebarWidth) {
      if (sidebarWidth == 0) {
        this.$refs.topbar.style.display = "block";
        this.$refs.wrapper.style.height = "calc(100vh - 50px)";
        this.wrapperHeight = "calc(100vh - 50px)";
      }
      this.sidebarWidth = sidebarWidth ?? 220;
    },

    expandMenu() {
      if (
        this.$refs.sidebar.style.display == "block" &&
        this.$refs.sidebarMenu?.isExpanded()
      ) {
        this.$refs.sidebarMenu?.collapse();
        this.$refs.topbar.style.display = "block";
        this.$refs.wrapper.style.height = "calc(100vh - 50px)";
        this.wrapperHeight = "calc(100vh - 50px)";
      } else {
        this.$refs.sidebar.style.display = "block";
        this.$refs.sidebarMenu?.expand();
        this.$refs.topbar.style.display = "none";
        this.$refs.wrapper.style.height = "100vh";
        this.wrapperHeight = "100vh";
      }
    },

    handleResize() {
      let screenWidth = window.innerWidth;
      if (screenWidth > 768) {
        this.$refs.sidebarMenu?.expand();
        if (this.$refs.wrapper) {
          this.$refs.wrapper.style.height = "100vh";
          this.wrapperHeight = "100vh";
        }
      } else {
        this.$refs.sidebarMenu?.collapse();
        if (this.$refs.wrapper) {
          this.$refs.wrapper.style.height = "calc (100vh - 50px)";
          this.wrapperHeight = "calc (100vh - 50px)";
        }
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
}

.sidebar {
  flex-shrink: 0;
  height: 100%;
  position: relative;
  transition: width 0.2s;
  overflow-y: auto;
}

.main-content {
  flex-grow: 1;
  min-height: calc(100vh - 50px);
  position: relative;
}

@media screen and (max-width: 767px) {
  .sidebar {
    display: none;
  }

  .topbar {
    display: block;
  }

  .wrapper {
    height: calc(100vh - 100px);
  }
}

@media screen and (min-width: 768px) {
  .sidebar {
    display: block;
    width: 220px;
  }
  .topbar {
    display: none;
  }

  .wrapper {
    height: 100vh;
  }
}

.main-content-inner {
  padding: 20px;
  padding-top: 0px;
}
</style>
