<template>
  <div
    class="fixed-bottom"
    :style="{
      height: height + 'px',
      verticalAlign: 'middle',
      width: '100%',
      backgroundColor: backgroundColor,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "FixedBottom",
  props: {
    height: {
      type: Number,
      required: true,
    },
    backgroundColor: {
      type: String,
    },
  },
};
</script>

<style scoped>
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #f0f0f0;
}
</style>
