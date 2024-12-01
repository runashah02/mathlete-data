<template>
  <label
    v-if="label"
    class="form-label"
    style="text-transform: uppercase; min-height: 1em;color:#444444"
  >
    {{ label }}
    <span class="em-required" v-if="required">*</span>
    <span v-if="info" style="margin-left: 10px"
      ><i
        :id="`info-icon-${id}`"
        class="bi bi-info-circle-fill"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        :title="info"
        style="cursor: pointer"
      ></i
    ></span>
  </label>

  <div
    class="form-group"
    :class="[
      { 'has-label': label },
      { 'input-group': hasIcon },
      { 'has-success': valid === true },
      { 'has-danger': error || valid === false },
      { focused: focused },
    ]"
  >
    <div v-if="addonLeftIcon" class="input-group-prepend">
      <span class="input-group-text">
        <i :class="addonLeftIcon"></i>
      </span>
    </div>
    <input
      v-bind="$attrs"
      :type="fldType"
      class="form-control"
      :class="[
        { 'is-valid': valid === true },
        { 'is-invalid': valid === false },
        inputClasses,
      ]"
      aria-describedby="addon-right addon-left"
      v-bind:value="modelValue"
      v-on:input="
        fldValue = $event.target.value;
        $emit('update:modelValue', $event.target.value);
      "
    />
    <div
      v-if="togglableVisibility"
      class="input-group-append"
      style="cursor: pointer"
      @click="toggleVisibility"
    >
      <span class="input-group-text">
        <i :class="currentlyVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
      </span>
    </div>
    <div
      v-if="! noError"
      class="text-danger invalid-feedback"
      style="display: block;min-height:1.5em"
      :class="{ 'mt-2': hasIcon }"

    >
      {{ error }}
    </div>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";

export default {
  inheritAttrs: false,
  name: "base-input",
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: false,
      default: "",
    },
    type: {
      type: String,
    },
    required: {
      type: Boolean,
      description: "Whether input is required (adds an asterix *)",
    },
    valid: {
      type: Boolean,
      description: "Whether is valid",
      default: undefined,
    },
    label: {
      type: String,
      description: "Input label (text before input)",
    },
    error: {
      type: String,
      description: "Input error (below input)",
    },
    noError: {
      type: Boolean,
      description: "If set to true, no error will be shown for this input field and no space will be reserved for the error",
      default: false,
    },
    labelClasses: {
      type: String,
      description: "Input label css classes",
    },
    inputClasses: {
      type: String,
      description: "Input css classes",
    },
    addonLeftIcon: {
      type: String,
      description: "Addon left icon",
    },
    info: {
      type: String,
    },
  },
  data() {
    return {
      focused: false,
      currentlyVisible: false,
      togglableVisibility: false,
      fldValue: this.modelValue,
    };
  },
  mounted() {
    this.togglableVisibility = this.type == "password";
    const infoIcon = document.querySelector(`#info-icon-${this.id}`);
    if (infoIcon) {
      new Tooltip(infoIcon, {
        html: true,
      });
    }
  },
  computed: {
    hasIcon() {
      return this.togglableVisibility || this.addonLeftIcon !== undefined;
    },
    fldType() {
      return !this.togglableVisibility
        ? this.type
        : this.currentlyVisible
        ? "text"
        : "password";
    },
  },
  methods: {
    updateValue(evt) {
      let value = evt.target.value;
      this.$emit("input", value);
    },
    setValue(newValue) {
      this.fldValue = newValue;
      this.$emit("input", newValue);
    },
    onFocus(value) {
      this.focused = true;
      this.$emit("focus", value);
    },
    onBlur(value) {
      this.focused = false;
      this.$emit("blur", value);
    },
    toggleVisibility() {
      this.currentlyVisible = !this.currentlyVisible;
    },
  },
};
</script>
<style scoped>
input[type="text"]:disabled {
  background-color: white;
  border: none;
  padding: 0px;
}

.em-required {
  color: red;
}

.text-danger {
  font-size:1em;
}

/* Additional styling to ensure seamless look */
.input-group .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-prepend .input-group-text,
.input-group-append .input-group-text {
  height: calc(1.5em + .75rem + 4px); /* Match the input height */
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-prepend .input-group-text {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-append .input-group-text {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Ensuring the input and icons are seamless */
.input-group .form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.input-group-prepend .input-group-text:first-child {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

.input-group-append .input-group-text:last-child {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
</style>
