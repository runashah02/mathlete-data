<template>
  <label
    v-if="label"
    class="form-label"
    style="text-transform: uppercase; min-height: 1em"
  >
    {{ label }}
    <span v-if="required">*</span>
  </label>
  <div class="autocomplete">
    <input
      style="width: 100%"
      type="text"
      class="form-control"
      v-model="optionText"
      @input="onInput"
      @blur="onBlur"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter.prevent="onEnter"
    />
    <ul class="list-group position-absolute" v-if="isOpen">
      <li
        class="list-group-item"
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        @mousedown="onSuggestionClick(suggestion)"
        :class="{ 'bg-primary text-white': highlightedIndex === index }"
        style="cursor: pointer"
      >
        {{ suggestion.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    initialText: {
      Type: String,
    },
    initialValue: {
      Type: String,
    },
    fetchApi: {
      Type: String,
    },
    label: {
      Type: String,
    },
  },
  data() {
    return {
      optionText: "",
      optionValue: "",
      isOpen: false,
      highlightedIndex: -1,
      suggestions: [],
    };
  },
  mounted() {
    this.optionText = this.initialText;
    this.optionValue = this.initialValue;
  },
  computed: {
    filteredSuggestions() {
      return this.suggestions.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(this.optionText.toLowerCase())
      );
    },
  },
  methods: {
    onInput(event) {
      this.optionValue = "";
      let val = event.target.value;
      if (val.length > 2) {
        this.fetchRows(this.fetchApi, val);
      } else {
        this.suggestions = [];
        this.isOpen = false;
      }
    },
    onBlur() {
      setTimeout(() => {
        this.isOpen = false;
      }, 200);
    },
    onArrowDown() {
      if (this.highlightedIndex < this.filteredSuggestions.length - 1) {
        this.highlightedIndex++;
      }
    },
    onArrowUp() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      }
    },
    onEnter() {
      if (this.highlightedIndex !== -1) {
        this.optionText = this.filteredSuggestions[this.highlightedIndex].text;
        this.optionValue =
          this.filteredSuggestions[this.highlightedIndex].value;
        this.isOpen = false;
        this.$emit("selected", {
          value: this.optionValue,
          text: this.optionText,
        });
      }
    },
    onSuggestionClick(suggestion) {
      this.optionText = suggestion.text;
      this.optionValue = suggestion.value;
      this.isOpen = false;
      this.$emit("selected", {
        value: this.optionValue,
        text: this.optionText,
      });
    },

    fetchRows(api, srchTxt) {
      let token = "";
      let self = this;
      self.isOpen = false;
      axios({
        method: "get",
        url: `${api}/${srchTxt}`,
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => {
          self.suggestions = response.data;
          self.isOpen = true;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == "500") {
            this.$router.push("/500");
          } else {
            if (error.response.status == "404") {
              this.$router.push("/404");
            }
          }
        });
    },
  },
};
</script>

<style scoped>
.autocomplete {
  position: relative;
}

.list-group {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  bottom: 100%;
}
</style>
