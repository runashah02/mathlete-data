convertToDigitArray: function (number) {
    let numString = String(number).padStart(12, "0");
    let digitArray = numString
      .split("")
      .reverse()
      .map((digit) => parseInt(digit, 10));
    return digitArray;
  },

  placeValueChart: function (numbers, system, highlightCol) {
    if (system == "Indian" && Math.max (...numbers) > 999999999) return "";
    if (system == "International" && Math.max (...numbers) > 999999999999) return "";

    /* Include in questions that call this function
    .place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
    .span2 {grid-column: span 2}
    .span3 {grid-column: span 3}
    .place-chart-subheader-cell {border: 1px solid black; text-align:center; background-color:#e0f7ff; padding:10px;}
    .place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px;}
    */

    let digitsArr = [];
    for (i = 0; i < numbers.length; ++i) {
      digitsArr.push(this.convertToDigitArray (numbers[i]));
    }
    let maxDigits = Math.max (...numbers).toString ().length;
    let chart = `<table class='tbl tbl-bordered>`;
    if (showHeader) {
      if (system == "International") {
        headerLabels = ["ones", "tens", "hundreds", "thousands", "ten thousands", "lakhs", "ten lakhs", "crores", "ten crores"];

      }
      else {

      }
    }
    chart += `</table>`
    return chart;    

    /*
    // Generate HTML
    let headerRow = ``;
    let subHeaderRow = ``;
    let digitRows = [];
    let numCols;
    if (system == "Indian") {
      if (number > 9999999) {
        headerRow += `<div class="place-chart-header-cell span2">Crores</div>`;
        subHeaderRow += `<div class="place-chart-subheader-cell">Ten Crores</div><div class="place-chart-subheader-cell">Crores</div>`;
        for (let j = 0; j < digitsArr.length; ++j) {
          let digits = digitsArr[j];
          let digitRow = `<div class="place-chart-digit-cell">${digits[8]}</div><div class="place-chart-digit-cell">${digits[7]}</div>`;
          digitRows.push (digitRow);
        }
      }
      if (number > 99999) {
        headerRow += `<div class="place-chart-header-cell span2">Lakhs</div>`;
        subHeaderRow += `<div  class="place-chart-subheader-cell">Ten Lakhs</div><div class="place-chart-subheader-cell">Lakhs</div>`;
        for (let j = 0; j < digitsArr.length; ++j) {
          let digits = digitsArr[j];
          let digitRow = `<div class="place-chart-digit-cell">${digits[6]}</div><div class="place-chart-digit-cell">${digits[5]}</div>`;
          digitRows.push (digitRow);
        }
      }
      if (number > 9999) {
        headerRow += `<div class="place-chart-header-cell span2">Thousands</div>`;
        subHeaderRow += `<div class="place-chart-subheader-cell">Ten Thousands</div><div class="place-chart-subheader-cell">Thousands</div>`;
        for (let j = 0; j < digitsArr.length; ++j) {
          let digits = digitsArr[j];
          let digitRow = `<div class="place-chart-digit-cell">${digits[4]}</div><div class="place-chart-digit-cell">${digits[3]}</div>`;
          digitRows.push (digitRow);
        }
      } else {
        if (number > 999) {
          headerRow += `<div class="place-chart-header-cell">Thousands</div>`;
          for (let j = 0; j < digitsArr.length; ++j) {
            let digits = digitsArr[j];
            let digitRow = `<div class="place-chart-digit-cell">${digits[6]}</div><div class="place-chart-digit-cell">${digits[5]}</div>`;
            digitRows.push (digitRow);
          }
          }
      }
      numCols = number > 9999999 ? 9 : number > 99999 ? 7 : number > 9999 ? 5 : number > 999 ? 4 : 3;
      headerRow += `   
          <div class="place-chart-header-cell">Hundreds</div>
          <div class="place-chart-header-cell">Tens</div>
          <div class="place-chart-header-cell">Units</div>
        `;
      if (number > 9999) {
        subHeaderRow += `
            <div class="place-chart-subheader-cell"></div>
            <div class="place-chart-subheader-cell"></div>
            <div class="place-chart-subheader-cell"></div>
            `;
      }

      digitRow += `
          <div class="place-chart-digit-cell">${digits[9]}</div>
          <div class="place-chart-digit-cell">${digits[10]}</div>
          <div class="place-chart-digit-cell">${digits[11]}</div>
    `;
    } else {
      if (number > 999999999) {
        headerRow += `<div class="place-chart-header-cell span3">Billions</div>`;
        subHeaderRow += `<div class="place-chart-subheader-cell">Hundred Billions</div><div class="place-chart-subheader-cell">Ten Billions</div><div class="place-chart-subheader-cell">Billions</div>`;
        digitRow += `<div class="place-chart-digit-cell">${digits[0]}</div><div class="place-chart-digit-cell">${digits[1]}</div><div class="place-chart-digit-cell">${digits[2]}</div>`;
      }
      if (number > 999999) {
        headerRow += `<div class="place-chart-header-cell span3">Millions</div>`;
        subHeaderRow += `<div  class="place-chart-subheader-cell">Hundred Millions</div><div class="place-chart-subheader-cell">Ten Millions</div><div class="place-chart-subheader-cell">Millions</div>`;
        digitRow += `<div class="place-chart-digit-cell">${digits[3]}</div><div class="place-chart-digit-cell">${digits[4]}</div><div class="place-chart-digit-cell">${digits[5]}</div>`;
      }
      if (number > 9999) {
        headerRow += `<div class="place-chart-header-cell span3">Thousands</div>`;
        subHeaderRow += `<div class="place-chart-subheader-cell">Hundred Thousands</div><div class="place-chart-subheader-cell">Ten Thousands</div><div class="place-chart-subheader-cell">Thousands</div>`;
        digitRow += `<div class="place-chart-digit-cell">${digits[6]}</div><div class="place-chart-digit-cell">${digits[7]}</div><div class="place-chart-digit-cell">${digits[8]}</div>`;
      } else {
        if (number > 999) {
          headerRow += `<div class="place-chart-header-cell">Thousands</div>`;
          digitRow += `<div class="place-chart-digit-cell">${digits[8]}</div>`;
        }
      }
      numCols = number > 999999999 ? 12 : number > 999999 ? 9 : number > 9999 ? 6 : number > 999 ? 4 : 3;
      headerRow += `   
          <div class="place-chart-header-cell">Hundreds</div>
          <div class="place-chart-header-cell">Tens</div>
          <div class="place-chart-header-cell">Units</div>
        `;
      if (number > 9999) {
        subHeaderRow += `
            <div class="place-chart-subheader-cell"></div>
            <div class="place-chart-subheader-cell"></div>
            <div class="place-chart-subheader-cell"></div>
            `;
      }

      digitRow += `
          <div class="place-chart-digit-cell">${digits[9]}</div>
          <div class="place-chart-digit-cell">${digits[10]}</div>
          <div class="place-chart-digit-cell">${digits[11]}</div>
    `;
    }

    return `
          <div style="display: grid; grid-template-columns: repeat(${numCols}, auto); border: 1px solid #ddd; width: fit-content; text-align: center;">
            ${headerRow}
            ${subHeaderRow}
            ${digitRow}
          </div>
        `; */

  },
