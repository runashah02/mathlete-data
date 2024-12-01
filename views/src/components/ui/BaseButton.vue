<template>
  <button
    ref="base-btn"
    v-bind="$attrs"
    type="submit"
    class="btn"
    :class="buttonClasses"
    :style="[buttonClass, hoverStyle]"
    :disabled="state == 'disabled' || state == 'loading'"
    @mouseover="applyHoverStyle"
    @mouseout="removeHoverStyle"
  >
    <span v-if="!(state == 'loading')">
      <slot />
    </span>
    <span v-else>
      {{ loading }}
    </span>
    <div
      v-if="state == 'loading'"
      class="spinner-border spinner-border-sm"
      style="margin-left: 10px"
      role="status"
    ></div>
  </button>
</template>
<script>
export default {
  props: {
    buttonColor: {
      type: String,
      default: "green",
      description:
        "A string representation of one of the system colors for the button background - Possible values are green, blue, darkblue, white and gray. Default is gray",
    },
    buttonClasses: String,
    buttonFontColor: {
      type: String,
      default: "white",
      description:
        "A string representation of one of the system colors for the button font - Possible values are green, blue, darkblue, white and gray. Default is gray",
    },
    buttonBorderColor: {
      type: String,
      description:
        "A string representation of one of the system colors for the button border - Possible values are green, blue, darkblue, white and gray. Default is gray",
    },
    hover: {
      type: Boolean,
      default: false,
      required: false
    },
    buttonColorHover: {
      type: String,
      default: "green",
      description:
        "A string representation of one of the system colors for the button background on hover - Possible values are green, blue, darkblue, white and gray. Default is gray",
    },
    buttonFontColorHover: {
      type: String,
      default: "white",
      description:
        "A string representation of one of the system colors for the button font on hover - Possible values are green, blue, darkblue, white and gray. Default is gray",
    },
    buttonBorderColorHover: {
      type: String,
      description:
        "A string representation of one of the system colors for the button border on hover - Possible values are green, blue, darkblue, white and gray. Default is gray",
    },
    state: {
      type: String,
      required: false,
      default: "enabled",
      description:
        "The button has 3 possible states - 'enabled', 'disabled' and 'loading'",
    },
    loading: {
      type: String,
      required: false,
      default: "Wait",
      description: "The button label when the button is in the loading state",
    },
    buttonWidth: {
      type: String,
      default: "100%",
      description: "Button width in % or px. For e.g., 100% or 200px",
    },
    
  },
  data() {
    return {
      BUTTONCOLORS: [
        { colorString: "green", colorRGB: "#31ad7b" },
        { colorString: "brightgreen", colorRGB: "#00b971" },
        { colorString: "blue", colorRGB: "#0d6efd" },
        { colorString: "darkblue", colorRGB: "#111224" },
        { colorString: "gray", colorRGB: "#6c757d" },
        { colorString: "white", colorRGB: "#ffffff" },
        { colorString: "lightgray", colorRGB: "#E9ECEF" },
        { colorString: "orange", colorRGB: "#f5bc00"},
        { colorString: "darkorange", colorRGB: "#dca900"},
        { colorString: "transparent", colorRGB: "transparent" },
      ],
      hoverStyle: {}
    };
  },
  methods: {
    getRGBValue(colorString) {
      let colorRGB;
      if (colorString) {
        let buttonColor = this.BUTTONCOLORS.find(
          (color) => color.colorString == colorString.toLowerCase()
        );
        if (buttonColor) colorRGB = buttonColor.colorRGB;
      }
      return colorRGB;
    },
    applyHoverStyle() {
      if (this.hover) {
        this.hoverStyle = this.buttonClassHover;
      }
    },
    removeHoverStyle() {
      this.hoverStyle = {};
    },
  },
  computed: {
    buttonClass() {
      let buttonColorRGB =
        this.getRGBValue(this.buttonColor) || this.getRGBValue("green");
      let buttonBorderColorRGB =
        this.getRGBValue(this.buttonBorderColor) || buttonColorRGB;
      let buttonFontColorRGB =
        this.getRGBValue(this.buttonFontColor) || this.getRGBValue("white");
      return {
        "background-color": buttonColorRGB,
        border: "1px solid " + buttonBorderColorRGB,
        width: this.buttonWidth,
        color: buttonFontColorRGB,
      };
    },
    buttonClassHover() {
      let buttonColorRGBHover =
        this.getRGBValue(this.buttonColorHover) || this.getRGBValue(this.buttonColor) || this.getRGBValue("green");
      let buttonBorderColorRGBHover =
        this.getRGBValue(this.buttonBorderColorHover) || buttonColorRGBHover;
      let buttonFontColorRGBHover =
        this.getRGBValue(this.buttonFontColorHover) || this.getRGBValue(this.buttonFontColor) ||
        this.getRGBValue("white");
      let style = {
        "background-color": buttonColorRGBHover,
        border: "1px solid " + buttonBorderColorRGBHover,
        width: this.buttonWidth,
        color: buttonFontColorRGBHover,
      };
      return style;
    },
  },
};
</script>

<style scoped></style>
