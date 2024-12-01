<template>
  <div style="display: inline-table; margin-left: 15px;background-color: #d1e3ff;padding: 10px;border-radius: 4px;">
    <span>Time Elapsed: </span>
    <span>{{ hours }}:{{ minutes }}:{{ seconds }}</span>
   </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      elapsedSeconds: 0,
      lastInteractionTime: Date.now(),
      inactivityTimeout: null,
      inactivityLimit: 30000, // 30 seconds
      isPaused: false,
    };
  },
  computed: {
    hours() {
      return String(Math.floor(this.elapsedSeconds / 3600)).padStart(2, "0");
    },
    minutes() {
      return String(Math.floor((this.elapsedSeconds % 3600) / 60)).padStart(
        2,
        "0"
      );
    },
    seconds() {
      return String(this.elapsedSeconds % 60).padStart(2, "0");
    },
  },
  mounted() {
    this.startTimer();
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("mousemove", this.updateInteractionTime);
    window.addEventListener("click", this.updateInteractionTime);
    window.addEventListener("keypress", this.updateInteractionTime);
  },
  beforeUnmount() {
    this.stopTimer();
    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blur", this.onBlur);
    window.removeEventListener("mousemove", this.updateInteractionTime);
    window.removeEventListener("click", this.updateInteractionTime);
    window.removeEventListener("keypress", this.updateInteractionTime);
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (!this.isPaused) {
          this.elapsedSeconds++;
        }
      }, 1000);
      this.resetInactivityTimeout();
    },
    stopTimer() {
      clearInterval(this.timer);
      clearTimeout(this.inactivityTimeout);
    },
    updateInteractionTime() {
      this.lastInteractionTime = Date.now();
      if (this.showOverlay) {
        this.showOverlay = false;
      }
      this.resetInactivityTimeout();
    },
    resetInactivityTimeout() {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(
        this.checkInactivity,
        this.inactivityLimit
      );
    },
    checkInactivity() {
      const now = Date.now();
      if (now - this.lastInteractionTime >= this.inactivityLimit) {
        this.pauseTimer();
      }
    },
    pauseTimer() {
      this.showOverlay = true;
    },
    resumeTimer() {
      this.lastInteractionTime = Date.now();
      this.showOverlay = false;
      this.resetInactivityTimeout();
    },
    onFocus() {
      this.lastInteractionTime = Date.now();
      if (this.showOverlay) {
        this.resumeTimer();
      }
    },
    onBlur() {
      this.pauseTimer();
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
