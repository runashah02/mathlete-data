const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: false,             // Disable Hot Module Replacement
    liveReload: false,      // Disable live reloading
  }
});
