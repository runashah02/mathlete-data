<template>
  <div>
    <div>
      <label
        v-if="label"
        class="form-label"
        style="text-transform: uppercase; min-height: 1em"
      >
        {{ label }}
        <span class="em-required" v-if="required">*</span>
      </label>
    </div>
    <div
      style="
        align-items: center;
        background-color: #f7f8f8;
        border: 1px dashed #d3dde1;
        border-radius: 8px;
        box-sizing: border-box;
        color: #455560;
        display: flex;
        font-size: 16px;
        font-weight: 500;
        overflow: hidden;
        padding: 19px 12px 19px 19px;
        transition: border-color 0.2s, fill 0.2s, background-color 0.2s;
        cursor: pointer;
        justify-content: space-between;
      "
    >
      <input
        type="file"
        ref="fileInput"
        @change="onFileSelected"
        style="display: none"
      />
      <img
        v-if="dispImageUrl"
        v-bind:src="dispImageUrl"
        v-on:click="openFileDialog"
        :style="{
          height: height,
          width: width || auto,
          cursor: 'pointer',
        }"
      />
      <span v-else style="font-size: 1.2em">
        <i
          class="bi-card-image"
          style="margin-right: 15px; font-size: 1.4em"
        ></i>
        Drag and drop file here</span
      >
      <button
        v-if="showButton && !(this.iimageUrl || this.uploadImageUrl)"
        class="btn btn-secondary"
        v-on:click.prevent="openFileDialog"
      >
        Choose File
      </button>

      <img
        class="closeRedBtn"
        src="../../../public/assets/close-red-icon.svg"
        style="height: 25px; width: 25px; cursor: pointer"
        v-if="showButton && (this.iimageUrl || this.uploadImageUrl)"
        v-on:click.prevent="deleteFile"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      Type: String,
      required: true,
    },
    imageUrl: {
      Type: String,
      Description: "The URL of the image",
    },
    placeholderUrl: {
      Type: String,
      Description:
        "The URL of the image to be displayed in case the imageURL is not available",
    },
    height: {
      Type: String,
      Description: "The height of the image e.g., 120px or 50%",
    },
    width: {
      Type: String,
      Description: "The width of the image e.g., 120px or 50%",
    },
    imageClasses: {
      Type: String,
    },
    required: {
      type: Boolean,
      description: "Whether input is required (adds an asterix *)",
    },
    label: {
      type: String,
      description: "Input label (text before input)",
    },
    showButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedFile: null,
      uploadImageUrl: null,
      iimageUrl: this.imageUrl,
    };
  },
  computed: {
    dispImageUrl() {
      let dispImageUrl = this.uploadImageUrl
        ? this.uploadImageUrl
        : this.iimageUrl
        ? this.iimageUrl
        : this.placeholderUrl
        ? this.placeholderUrl
        : undefined;
      return dispImageUrl;
    },
  },
  methods: {
    deleteFile() {
      this.selectedFile = null;
      this.uploadImageUrl = null;
      this.iimageUrl = null;
      this.$emit("fileDeleted");
    },
    openFileDialog() {
      this.$refs.fileInput.click();
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.uploadImageUrl = URL.createObjectURL(this.selectedFile); // set the preview image
      this.$emit("fileSelected", {
        url: this.uploadImageUrl,
        file: this.selectedFile,
      });
    },
  },
};
</script>
<style scoped>
.closeRedBtn:hover {
  filter: hue-rotate(40deg);
}
</style>
