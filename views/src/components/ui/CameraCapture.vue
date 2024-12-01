<template>
  <div class="container">
    <div class="row">
      <video ref="videoElement" id="videoElement" class="col-12" autoplay></video>
      <canvas ref="canvasElement" id="canvasElement" class="col-12" style="display: none"></canvas>
    </div>
    <div class="row" style="margin-top: 5px">
      <div id="capture-btn-div" class="col-12">
        <base-button loading="Capturing" @click="capture" id="capture-btn">
          Capture
        </base-button>
      </div>
      <div id="retry-btn-div" class="col-12" style="display: none">
        <base-button loading="Changing Mode" @click="videoMode" id="retry-btn">
          Retry
        </base-button>
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
  data() {
    return {
      videoStream: null,
      imageData: null,
    };
  },
  mounted() {
    this.initCamera();
  },
  beforeUnmount() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  },
  methods: {
    async initCamera() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        this.$refs.videoElement.srcObject = this.videoStream;
      } catch (error) {
        console.error("Error initializing camera", error);
        alert("Unable to access the camera. Please check camera permissions and try again.");
      }
    },
    videoMode() {
      document.getElementById("videoElement").style.display = "block";
      document.getElementById("capture-btn-div").style.display = "block";

      document.getElementById("canvasElement").style.display = "none";
      document.getElementById("retry-btn-div").style.display = "none";
    },
    capture() {
      const canvas = this.$refs.canvasElement;
      const video = this.$refs.videoElement;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      document.getElementById("videoElement").style.display = "none";
      document.getElementById("capture-btn-div").style.display = "none";

      document.getElementById("canvasElement").style.display = "block";
      document.getElementById("retry-btn-div").style.display = "block";

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageData = canvas.toDataURL();

      this.$emit("capture", this.imageData);
    },
  },
};
</script>
