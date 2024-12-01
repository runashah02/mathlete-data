function generateAdditionStepsHTML(numbers) {
  const total = numbers.reduce((acc, num) => acc + num, 0);
  const maxDigits = total.toString().length;

  // Pad each number with leading zeros to align by max digits
  const paddedNumbers = numbers.map((num) => num.toString().padStart(maxDigits, " ").split(""));
  let carryForward = Array(maxDigits).fill("0"); // Carry array for each digit column
  const result = Array(maxDigits).fill(" ");

  let stepsHTML = `<style>
  .highlighted-digit {
    color: #7a0bd1;
  }
  
  .op-grid {
        width: fit-content;
        border:1px solid #b7e7fb;
        gap: 0px;
        display: grid;
        grid-template-columns: repeat(${maxDigits + 1}, min-content);
      }

      .op-grid > div {
        border: 1px solid #b7e7fb;
        border-collapse: collapse;
        height: 4ch;
        width: 4ch;
        line-height: 4ch;
        vertical-align: middle;
        text-align: center;
      }

      .result {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
      }

      .carry-forward {
        color: darkgray;
        font-style: italic;
      }

      body {
        font-family: "Lato", sans-serif;
        font-size: 12pt !important;
        margin: 0;
        padding: 20px;
      }

      .place-name {
        background-color: #b7e7fb;
      }

    </style>
`;
  stepsHTML += `<div style="margin-bottom: 30px">Place the addends in columns as shown</div>`;

  // Create initial setup grid with numbers aligned by place value
  stepsHTML += `<div class="op-grid">`;
  stepsHTML += `<div class="place-name"></div>`;
  for (let i = maxDigits - 1; i >= 0; i--) {
    stepsHTML += `<div class="place-name">${["O", "T", "H", "Th", "TTh"][i]}</div>`;
  }
  stepsHTML += `<div></div>`;
  for (let i = maxDigits - 1; i >= 0; i--) {
    stepsHTML += `<div class="carry-forward">${carryForward[i] == "0" ? "" : carryForward[i]}</div>`;
  }

  for (let i = 0; i < paddedNumbers.length; ++i) {
    let paddedNumber = paddedNumbers[i];
    if (i > 0) {
      stepsHTML += `<div>+</div>`;
    } else {
      stepsHTML += `<div></div>`;
    }
    for (let j = 0; j < paddedNumber.length; ++j) {
      stepsHTML += `<div>${paddedNumber[j]}</div>`;
    }
  }
  stepsHTML += `<div class="result"></div>`;

  for (let i = maxDigits - 1; i >= 0; i--) {
    stepsHTML += `<div class="result">${result[i]}</div>`;
  }
  stepsHTML += `</div>`;

  // Step-by-step addition from rightmost (ones) place to leftmost
  for (let i = maxDigits - 1; i >= 0; i--) {
    const placeName = ["ones", "tens", "hundreds", "thousands", "ten thousands"][maxDigits - 1 - i];
    const carryFwdPlaceName = ["ones", "tens", "hundreds", "thousands", "ten thousands"][maxDigits - i];
    let columnSum = parseInt(carryForward[i] || 0);
    let columnSumArr = [];
    if (columnSum > 0) {
      columnSumArr.push(columnSum);
    }
    for (let j = 0; j < paddedNumbers.length; ++j) {
      if (paddedNumbers[j][i] != " ") {
        columnSum += parseInt(paddedNumbers[j][i] || 0);
        columnSumArr.push(parseInt(paddedNumbers[j][i] || 0));
      }
    }
    let columnSumText = "";
    if (columnSumArr.length > 1) {
      columnSumText = columnSumArr.join(" + ") + " = " + columnSum;
    }
    stepsHTML += `<p style="margin-top: 30px">Add the ${placeName} digits. ${columnSumText}</p>`;
    stepsHTML += `<p>Write ${columnSum % 10} in the ${placeName} place. `;
    if (Math.floor (columnSum / 10) > 0) {
      stepsHTML += `Carry forward ${Math.floor (columnSum / 10)} to the ${carryFwdPlaceName} place`;
    }
    stepsHTML += `</p>`;

    result[i] = columnSum % 10; // Place result digit in the current position
    carryForward[i - 1] = Math.floor(columnSum / 10); // Update carry-forward

    // Generate instructions and display carry and result for each step
    stepsHTML += `<div class="op-grid">`;
    stepsHTML += `<div class="place-name"></div>`;
    for (let j = maxDigits - 1; j >= 0; j--) {
      stepsHTML += `<div class="place-name">${["O", "T", "H", "Th", "TTh"][j]}</div>`;
    }

    // Display carry-forward for the current step
    stepsHTML += `<div></div>`;
    for (let j = 0; j < maxDigits; j++) {
      if (j == i) {
        stepsHTML += `<div class="carry-forward highlighted-digit">${
          carryForward[j] == "0" ? "" : carryForward[j]
        }</div>`;
      } else {
        stepsHTML += `<div class="carry-forward">${carryForward[j] == "0" ? "" : carryForward[j]}</div>`;
      }
    }

    for (let k = 0; k < paddedNumbers.length; ++k) {
      let paddedNumber = paddedNumbers[k];
      if (k > 0) {
        stepsHTML += `<div>+</div>`;
      } else {
        stepsHTML += `<div></div>`;
      }
      for (let j = 0; j < paddedNumber.length; ++j) {
        if (j == i) {
          stepsHTML += `<div class="highlighted-digit">${paddedNumber[j]}</div>`;
        } else {
          stepsHTML += `<div>${paddedNumber[j]}</div>`;
        }
      }
    }
    stepsHTML += `<div class="result"></div>`;
    for (let j = 0; j < maxDigits; j++) {
      if (j == i) {
        stepsHTML += `<div class="highlighted-digit result">${result[j]}</div>`;
      } else {
        stepsHTML += `<div class="result">${result[j]}</div>`;
      }
    }

    stepsHTML += `</div>`;
  }

  // Final result display
  stepsHTML += `<p>${numbers.join(" + ")} = ${total}</p>`;

  return stepsHTML;
}

// Example usage
const numbers = [54779, 6814]; // Example numbers
console.log(generateAdditionStepsHTML(numbers));
