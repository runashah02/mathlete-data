<template>
  <main>
    <div class="overlay" v-if="!isOnline"></div>
    <div
      style="
        background-color: #e21b1b;
        color: white;
        border-radius: 8px;
        position: fixed;
        bottom: calc(100px + env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
        height: 60px;
        line-height: 60px;
        padding-left: 15px;
        padding-right: 15px;
        z-index: 999;
      "
      v-if="!isOnline"
    >
      <img
        src="../public/assets/red-alert-icon.svg"
        style="height: 30px; width: 30px; margin-right: 10px;z-index:999"
        
      />
      Hmm...you are not connected to the internet
    </div>
    <router-view></router-view>
  </main>
</template>
<script>
import "../public/assets/styles.css";

export default {
  data() {
    return { isOnline: navigator.onLine };
  },
  mounted() {
    window.addEventListener("online", () => {
      this.isOnline = true;
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  },
};
</script>

<style scoped></style>
