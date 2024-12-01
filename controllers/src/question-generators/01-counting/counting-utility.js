const util = require("../utility.js");

module.exports = {
  imageGrid: function (icon, number, showCount, numberName) {
    /* `
      .image-grid {display: grid; grid-template-columns: repeat(auto-fit, 80px); gap: 20px; max-width: 550px; }
      .counting-object-container {position: relative; }
      .counting-object-image {width: 80px; }
      @media (max-width: 550px) {.image-grid {max-width: 100%;}}
      .counting-number {width: 30px; height: 30px; background-color: blue; border-radius: 50%; color: white; text-align: center; line-height: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
      .counting-number-name {height:30px; background-color: blue; 50%; color: white; text-align: center; line-height: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }
      .image-overlay {opacity: 0.5;}
    ` */

    let html = ``;
    html += `<div class='image-grid'>`;
    for (let i = 1; i <= number; i++) {
      html += `<div class='counting-object-container'>
      <img class='counting-object-image ${showCount ? "image-overlay" : ""}' src='/assets/count-objects/${
        icon.iconName
      }'/>`;
      if (showCount) {
        if (numberName) {
          html += `<div class='counting-number-name'>${util.generateNumberName(i)}</div>`;
        } else {
          html += `<div class='counting-number'>${util.numberToHTML(i)}</div>`;
        }
      }
      html += `</div>`;
    }
    html += `</div>`;
    return html;
  },
};
