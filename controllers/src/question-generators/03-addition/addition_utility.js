module.exports = {
  generateObjectsContainer: function (iconName, count, eqnPart, showCount, startCount) {
    let imagesHtml = `<div class='countable-manipulatives countable-manipulatives-${eqnPart}' style='display: grid; grid-template-columns: repeat(5, auto); gap: 10px;'>`;
    let currentCount = startCount;

    for (let i = 1; i <= count; i++) {
      // Add the object
      imagesHtml += `<div class='object-image-container'><img src='/assets/count-objects/${iconName}' class='object-image' width='35' /></div>`;

      // Add empty divs if row has fewer than 5 objects
      if (i % 5 === 0 || i === count) {
        const objectsInRow = i % 5 === 0 ? 5 : i % 5;
        if (objectsInRow < 5) {
          for (let k = 0; k < 5 - objectsInRow; k++) {
            imagesHtml += `<div class='empty'></div>`;
          }
        }

        // Add corresponding numbers for this row
        if (showCount) {
          for (let j = i - objectsInRow + 1; j <= i; j++) {
            imagesHtml += `<div class='object-count-container'>${currentCount++}</div>`;
          }

          // Add empty divs if row of numbers has fewer than 5 items
          if (objectsInRow < 5) {
            for (let k = 0; k < 5 - objectsInRow; k++) {
              imagesHtml += `<div class='empty'></div>`;
            }
          }
        }
      }
    }

    imagesHtml += `</div>`;
    return imagesHtml;
  },

  generateObjectsContainerPartial: function (iconName, count, eqnPart, showCount, startCount) {
    let imagesHtml = `<div class='countable-manipulatives countable-manipulatives-${eqnPart}' style='display: grid; grid-template-columns: repeat(${count}, auto);'>`;

    for (let i = 1; i <= count; i++) {
      // Add the object
      imagesHtml += `<div class='object-image-container'><img src='/assets/count-objects/${iconName}' class='object-image' width='35' /></div>`;
    }
    if (showCount) {
      for (let i = startCount; i < startCount + count; i++) {
        imagesHtml += `<div class='object-count-container'>${i}</div>`;
      }
    }
    imagesHtml += `</div>`;
    return imagesHtml;
  },

  generateJointSentence: function (icons, numbers, showCount, isCountContinued) {
    let imagesHtml = `<div class='equation-container equation-container--joint'>`;
    let startCount = 1;
    for (let i = 0; i < numbers.length; ++i) {
      imagesHtml += this.generateObjectsContainerPartial(
        icons[i].iconName,
        numbers[i],
        i == 0 ? "left" : i + 1 == numbers.length ? "right" : "middle",
        showCount,
        startCount
      );
      startCount = isCountContinued ? numbers[i] + 1 : 1;
    }
    imagesHtml += "</div>";
    return imagesHtml;
  },

  generateDisjointSentence: function (icons, numbers, showCount, isCountContinued) {
    let imagesHtml = `<div class='equation-container equation-container--disjoint'>`;
    let startCount = 1;
    for (let i = 0; i < numbers.length; ++i) {
      imagesHtml += this.generateObjectsContainer(icons[i].iconName, numbers[i], "whole", showCount, startCount);
      startCount = isCountContinued ? numbers[i] + 1 : 1;
    }
    imagesHtml += "</div>";
    return imagesHtml;
  },

  generateUniqueOptions: function (totalOptions, correctOptions, sum, sumLimit) {
    const uniqueOptions = new Set();

    // Add correct options to uniqueOptions as a base
    correctOptions.forEach(([num1, num2]) => uniqueOptions.add(`${num1},${num2}`));

    // Helper function to generate a random pair as a string
    const getRandomPair = () => {
      const random1 = Math.floor(Math.random() * (sumLimit - 1)) + 1;
      const random2 = Math.floor(Math.random() * (sumLimit - 1)) + 1;
      return `${random1},${random2}`;
    };

    // Helper function to validate pair sum range
    const isValidSum = (pairSum) => !(sum >= 18 && (pairSum > sum + 15 || pairSum < sum - 15 || pairSum > sumLimit));

    // Generate random pairs until reaching the totalOptions limit
    while (uniqueOptions.size < totalOptions) {
      const randomPair = getRandomPair();
      const [num1, num2] = randomPair.split(",").map(Number);
      const pairSum = num1 + num2;

      if (isValidSum(pairSum) && !uniqueOptions.has(randomPair)) {
        uniqueOptions.add(randomPair);
      }
    }

    // Convert to array and shuffle
    const uniqueOptionsArray = Array.from(uniqueOptions).map((pair) => pair.split(",").map(Number));
    for (let i = uniqueOptionsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueOptionsArray[i], uniqueOptionsArray[j]] = [uniqueOptionsArray[j], uniqueOptionsArray[i]];
    }

    return uniqueOptionsArray;
  },

  getExerciseCustomCSS: function () {
    return `.basic-option {border:2px solid transparent;border-radius:8px} .basic-option:hover {border-color:lightgray} .basic-option.selected {border-color:darkgray} .equation-container { display: grid; grid-template-columns: repeat(4, auto); .equation-container--disjoint {gap:10px} width: fit-content; align-items: center } .equation-container > div {text-align:center} .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; } .countable-manipulatives-left {border-top-left-radius: 8px; border-bottom-left-radius: 8px; border-right:1px dotted right} .countable-manipulatives-right {border-top-right-radius: 8px; border-bottom-right-radius: 8px; border-left:1px dotted black } .countable-manipulatives-middle {border-left:1px dotted black;border-right:1px dotted black } .countable-manipulatives-whole {border-top-left-radius: 8px; border-bottom-left-radius: 8px; border-top-right-radius: 8px; border-bottom-right-radius: 8px;} .equation { display: grid; grid-template-columns: auto auto auto; gap: 10px; align-items: center;} .object-count-container {text-align: center}`;
  },

  VIadditionSteps: function (numbers, icons) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);

    let answerExplanation = `<p class='audio-enabled'>Draw ${numbers[0]} ${
      numbers[0] == 1 ? icons[0].singular : icons[0].plural
    }. `;
    for (let i = 1; i < numbers.length; ++i) {
      answerExplanation += `Draw ${numbers[i]} more ${numbers[i] == 1 ? icons[i].singular : icons[i].plural}. `;
    }
    answerExplanation += "</p>";
    // Extract unique plural names from icons
    const uniquePlurals = Array.from(new Set(icons.map((icon) => icon.plural)));
    const objectNames = uniquePlurals.join(", ").replace(/, ([^,]*)$/, " and $1");

    answerExplanation += `<p class='audio-enabled'>Count the ${objectNames}, like this:</p>
                              ${this.generateDisjointSentence(icons, numbers, true, true)}
                            <p></p>
                            <p class='audio-enabled'>There are ${sum} ${objectNames},
                            so ${numbers[0]} + ${numbers[1]} = ${sum}</p>`;

    return answerExplanation;
  },

  generateAnswerExplanation: function (numbers) {
    const icon = { iconName: "dot", singular: "dot", plural: "dots" };
    if (numbers[0] + numbers[1] <= 10) {
      return util.VIadditionSteps(numbers, [icon, icon]);
    }
    if (numbers[0] + numbers[1] <= 18) {
      return util.VIadditionSteps(numbers, [icon, icon]) + util.fingerCountSteps(numbers);
    }
    if (numbers[0] <= 9 || numbers[1] <= 9) {
      return util.fingerCountSteps(numbers);
    }
    return util.columnAdditionSteps(numbers);
  },
  
  generateConfusingOptions: function (a, b, numOptions) {
    const correctAnswer = a + b;
    const options = new Set();
    //options.add(correctAnswer);

    // Function to generate a close answer within a small range
    const generateCloseAnswer = (answer) => {
      const offset = Math.floor(Math.random() * 5) + 1; // Random offset between 1 and 5
      answer = Math.random() < 0.5 ? answer + offset : answer - offset;
      return answer;
    };

    const generateTwoDistinctRandomNumbers = (length) => {
      // Determine the upper bound of the range based on length
      const max = Math.floor((length - 1) / 2) + 1;

      // Generate the first random number within the range [1, max]
      const num1 = Math.floor(Math.random() * max) + 1;

      let num2;
      do {
        // Generate the second random number within the range [1, max]
        num2 = Math.floor(Math.random() * max) + 1;
      } while (num2 === num1); // Ensure num2 is different from num1

      return [num1, num2];
    };

    const switchDigits = (answer, i, j) => {
      let answerArr = answer.toString().split("");
      let temp = answerArr[j];
      answerArr[j] = answerArr[i];
      answerArr[i] = temp;
      answer = parseInt(answerArr.join(""));
      return answer;
    };

    const createCarryError = (num1, num2) => {
      let errorAnswer = correctAnswer;

      // Convert numbers to strings and reverse for easier place-by-place comparison
      const num1Str = num1.toString().split("").reverse();
      const num2Str = num2.toString().split("").reverse();

      // Check each place value (units, tens, hundreds, etc.) for carry errors
      for (let place = 0; place < Math.max(num1Str.length, num2Str.length); place++) {
        const digit1 = parseInt(num1Str[place] || "0", 10);
        const digit2 = parseInt(num2Str[place] || "0", 10);
        const sum = digit1 + digit2;

        // If sum >= 10, simulate carry error by subtracting the place value (10, 100, 1000, etc.)
        if (sum >= 10) {
          errorAnswer = Math.random() < 0.5 ? errorAnswer - 10 ** (place + 1) : errorAnswer;
        }
      }
      return errorAnswer;
    };

    let option;
    while (options.size < numOptions) {
      switch (Math.floor(Math.random() * 4)) {
        case 0: // Close to the correct answer
          option = generateCloseAnswer(correctAnswer);
          break;
        case 1: // Digit manipulation
          if (correctAnswer.toString().length >= 4) {
            let idxs = generateTwoDistinctRandomNumbers(correctAnswer.toString().length);
            option = switchDigits(correctAnswer, idxs[0], idxs[1]);
          } else {
            option = null;
          }
          break;
        case 2: // Common mental math error (no carry, etc.)
          option = createCarryError(a, b);
          break;
        case 3: // Random reasonable number
          option = Math.floor(Math.random() * 20) + (correctAnswer - 10);
          break;
      }

      // Ensure the option is unique and within a reasonable range
      if (option && option > 0 && option !== correctAnswer && option > a && option > b) {
        options.add(option);
      }
    }

    // Shuffle the options to ensure correct answer is not always in the same place
    return Array.from(options).sort(() => Math.random() - 0.5);
  },

  fingerCountSteps: function (numbers) {
    let stepsHTML = "";
    greaterNumber = Math.max(numbers[0], numbers[1]);
    smallerNumber = Math.min(numbers[0], numbers[1]);
    stepsHTML += `<p class='audio-enabled'>Start with your fists closed and say ${greaterNumber}</p>`;
    stepsHTML += `<p class='audio-enabled'>Extend one finger at a time and count up, like this</p>`;
    stepsHTML += this.showCorrectHandGesture(smallerNumber, greaterNumber);
    stepsHTML += `The sum is the last number you counted. ${numbers[0]} + ${numbers[1]} = ${numbers[0] + numbers[1]}`;
  },

  showCorrectHandGesture: function (smallerNumber, greaterNumber) {
    let fingerLeftCount = 0;
    let fingerRightCount = 0;
    let content = `<div style='display:grid;grid-template-columns:repeat(${greaterNumber - smallerNumber + 1}, auto)'>`;
    for (i = greaterNumber; i <= smallerNumber + greaterNumber; ++i) {
      content += `<div>
                    <div><img src='/assets/ux/hand/fingers-${fingerLeftCount}.svg' width='45'><img src='/assets/ux/hand/fingers-${fingerRightCount}.svg' width='45'></div>
                    <div>${i}</div>
                  </div>`;
    }
    content += `</div>`;
    return content;
  },

  columnAdditionSteps: function (numbers) {
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
          border-top: 1px solid black !important;
          border-bottom: 1px solid black !important;
        }
  
        .carry-forward {
          color: darkgray;
          font-style: italic;
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
      if (Math.floor(columnSum / 10) > 0) {
        stepsHTML += `Carry forward ${Math.floor(columnSum / 10)} to the ${carryFwdPlaceName} place`;
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
  },

  generateAnswerExplanation: function (numbers, icons, numericalEqn) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);

    if (sum <= 18 && icons) {
      // Join numbers and operator symbols for part1 and part2
      const part1 = numbers.join(", ").replace(/, ([^,]*)$/, " and $1");
      let part2;
      if (numericalEqn) {
        part2 = numbers.join(" + ") + " = ";
      } else {
        part2 = part1 + " make ";
      }

      // Extract unique plural names from icons
      const uniquePlurals = Array.from(new Set(icons.map((icon) => icon.plural)));
      const part3 = uniquePlurals.join(", ").replace(/, ([^,]*)$/, " and $1");
      // Set total
      const total = sum;
      return `<p class='audio-enabled'>To find the sum of ${part1}, count the ${part3}, like this:</p>
              ${this.generateDisjointSentence(icons, numbers, true, true)}
              <p class='audio-enabled'>There are ${total} ${part3}, so ${part2}${total}</p>`;
    }
  },

  requiresRegrouping(addend1, addend2) {
    do {
      lastDigit1 = addend1 % 10;
      lastDigit2 = addend2 % 10;
      if (lastDigit1 + lastDigit2 >= 10) return true;
      addend1 = addend1 / 10;
      addend2 = addend2 / 10;
    } while (addend1 > 0 || addend2 > 0);
    return false;
  },
};
