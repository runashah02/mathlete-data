<template>
  <div class="topbar" id="topbar">
    <div class="menu-item">
      <div class="menu-icon" @click="listClicked">
        <i class="bi-list"></i>
      </div>
      Mathlete
    </div>
  </div>
</template>
<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "../../../public/assets/styles.css";

export default {
  methods: {
    listClicked() {
      this.$emit("listClicked");
    },
  },
};
</script>

<style scoped>
.menu-item {
  width: 100%;
  padding: 20px;
}
.menu-item:hover {
  color: #85b1f8;
}

.menu-item.selected {
  border-left: 5px solid;
  border-color: #0d64f2;
  background-color: #062a66;
}

.menu-icon {
  display: inline-flex;
  width: 52px;
  cursor: pointer;
}

.menu-item {
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

i,
svg {
  transform: scale(1.2);
}

.menu-icon i {
  stroke-width: 8px;
}

.topbar {
  width: 100%;
  background-color: #111224;
  color: white;
}
</style>
