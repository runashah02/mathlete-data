<template>
  <div>
    Redirecting ...
  </div>
</template>
<script>
export default {
  name: "LandingPage",
  mounted() {
    let systemUser = sessionStorage.getItem("systemUser") || localStorage.getItem("systemUser");
    if (systemUser) {
      this.$router.push("/practice");
    } else {
      this.$router.push("/");
    }
  },
};
</script>
