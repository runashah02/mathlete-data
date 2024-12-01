<template>
  <label
    v-if="label"
    class="form-label"
    style="text-transform: uppercase; min-height: 1em"
  >
    {{ label }}
    <span class="em-required" v-if="required">*</span>
  </label>

 
  <div
      class="text-danger invalid-feedback"
      style="display: block"
      :class="{ 'mt-2': hasIcon }"
    >
      {{ error }}
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: "base-input",
  props: {
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
      description: "Addont left icon",
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
</style>
