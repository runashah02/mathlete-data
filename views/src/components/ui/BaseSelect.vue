<template>
  <div>
    <label
      v-if="label"
      class="form-label"
      style="text-transform: uppercase; min-height: 1em"
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
      class="form-group mb-2"
      :class="[{ 'has-label': label }, { focused: focused }]"
    >
      <select
        v-bind="$attrs"
        class="form-select"
        v-bind:value="modelValue"
        @change="
          fldValue = $event.target.value;
          $emit('update:modelValue', $event.target.value);
        "
      >
        <option disabled value="">
          {{ placeholder }}
        </option>
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option[valueField]"
          style="padding-bottom: 30px"
        >
          {{ option[textField] }}
        </option>
      </select>
    </div>
    <div
      v-if="!noError"
      class="text-danger"
      style="display: block; min-height: 1.5em"
    >
      {{ error }}
    </div>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import "../../../public/assets/styles.css";

export default {
  inheritAttrs: false,
  name: "base-select",
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: false,
      default: "",
    },
    required: {
      type: Boolean,
      description: "Whether input is required (adds an asterix *)",
    },
    label: {
      type: String,
      description: "Input label (text before input)",
    },
    labelClasses: {
      type: String,
      description: "Input label css classes",
    },
    selectClasses: {
      type: String,
      description: "Input css classes",
    },
    valueField: {
      type: String,
      default: "value",
    },
    textField: {
      type: String,
      default: "text",
    },
    info: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: "Choose an option",
    },
    error: {
      type: String,
      description: "Invalid value",
    },
    noError: {
      type: Boolean,
      description:
        "If set to true, no error will be shown for this select field and no space will be reserved for the error",
      default: false,
    },
  },
  data() {
    return {
      focused: false,
      fldValue: this.modelValue,
    };
  },
  mounted() {
    const infoIcon = document.querySelector(`#info-icon-${this.id}`);
    if (infoIcon) {
      new Tooltip(infoIcon, {
        html: true,
      });
    }
  },
  methods: {
    updateValue(evt) {
      let value = evt.target.value;
      this.$emit("input", value);
    },
    onFocus(value) {
      this.focused = true;
      this.$emit("focus", value);
    },
    onBlur(value) {
      this.focused = false;
      this.$emit("blur", value);
    },
  },
};
</script>
<style scoped>
.form-select option {
  transform: translateY(5px);
}

.em-required {
  color: red;
}
</style>
