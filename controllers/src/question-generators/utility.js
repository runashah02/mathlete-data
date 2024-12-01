const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * Generates a random 4-character code using a mix of alphanumeric and special characters.
   *
   * @returns {string} A unique 4-character random string.
   *
   * @description
   * - Creates a 4-character code from a set of characters including:
   *   - Lowercase and uppercase letters (`a-z`, `A-Z`),
   *   - Digits (`0-9`),
   *   - Special characters (`!@$%^*`). Do not use chars that conflict with utf-code for e.g., &
   * - The generated code can be used to uniquely identify:
   *   - Blanks in `FILL_IN_THE_BLANKS` type questions,
   *   - Options in `MULTIPLE_CHOICE` questions,
   *   - Dropzones and draggable elements in `DRAG_AND_DROP` interactions.
   * - This ensures each blank, option, or element has a distinct identifier across the application.
   * - The code must be unique for a blank or option to avoid conflicts.
   *
   */

  generateRandom4: function () {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$%^*";
    let optionId = "";
    for (let i = 0; i < 4; i++) {
      optionId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return optionId;
  },

  /**
   * Saves an array of questions to a JSON file in a specified directory.
   *
   * @param {Array<Object>} questions - An array of question objects to be saved.
   * @param {string} fileNameWithoutExt - The base name (without extension) for the JSON file to be created.
   *
   * @description
   * - Function to save an array of questions to a JSON file
   * - If file does not exist, this function will create a file
   * - If file exists, this function will overwrite it's contents
   *
   */

  saveQuestionsToJSONFile: function (questions, folderName, fileNameWithoutExt) {
    const directoryPath = path.join(folderName, "json-data");
    const targetFilePath = path.join(directoryPath, `${fileNameWithoutExt}.json`);
    fs.writeFileSync(targetFilePath, JSON.stringify(questions, null, 2));
    console.log(`${questions.length} questions written to ${targetFilePath}`);
  },

  numberToHTML: function (number) {
    return number <= 9999 ? `${number}` : `<large-number>${number}</large-number>`;
  },

  /**
   * Generates a specified number of unique random numbers within a given range, ensuring no duplicates.
   *
   * @param {Array<number>} existingNumbers - An array of numbers that must be included in the result.
   * @param {number} totalNumbersRequired - The total number of unique numbers required, including existing numbers.
   * @param {number} minNum - The minimum value (inclusive) for the random number range.
   * @param {number} maxNum - The maximum value (inclusive) for the random number range.
   * @returns {Array<number>} An array containing the specified number of unique numbers.
   *
   * @description
   * - Ensures that all numbers in `existingNumbers` are part of the result.
   * - Randomly generates additional unique numbers within the range [minNum, maxNum] until the total count is met.
   * - Uses a Set to guarantee uniqueness of numbers.
   * - Returns an array of the required size, even if `existingNumbers` already contains duplicates.
   */

  generateUniqueNumbers: function (existingNumbers, totalNumbersRequired, minNum, maxNum) {
    const uniqueNumbers = new Set();
    for (let i = 0; i < existingNumbers.length; ++i) {
      uniqueNumbers.add(existingNumbers[i]);
    }
    while (uniqueNumbers.size < totalNumbersRequired) {
      const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      uniqueNumbers.add(randomNum); // Ensure uniqueness using a Set
    }
    return Array.from(uniqueNumbers).slice(0, totalNumbersRequired);
  },

  /**
   * Generates a list of "confusing numbers" based on the provided existing numbers,
   * ensuring the total returned array contains the specified number of elements.
   *
   * @param {Array<number>} existingNumbers - The initial list of numbers to include.
   * @param {number} totalNumbersRequired - The total number of numbers to return.
   * @param {number} maxNum - The maximum allowed number in the range (inclusive).
   *
   * @returns {Array<number>} A shuffled array containing the existing numbers and
   * confusing numbers, up to the required total count.
   *
   * @description
   * - For each number in `existingNumbers`, generates variants by:
   *   - Adding 1 and subtracting 1.
   *   - Switching two random digits (if the number has at least two digits).
   *   - Changing one random digit to another.
   *   - Dropping one zero (if present).
   *   - Dropping one digit from the number.
   *   - Shuffles the final array to mix existing numbers with confusing numbers.
   *
   */

  generateConfusingNumbers: function (existingNumbers, totalNumbersRequired, minNum, maxNum) {
    const confusingNumbersSet = new Set(existingNumbers); // Ensure existing numbers are included

    existingNumbers.forEach((num) => {
      const numStr = String(num);

      // Swap any two digits randomly
      if (numStr.length >= 2) {
        for (let attempt = 0; attempt < 2; attempt++) {
          const digits = numStr.split("");
          let [i, j] = [Math.floor(Math.random() * digits.length), Math.floor(Math.random() * digits.length)];
          while (i === j) j = Math.floor(Math.random() * digits.length); // Ensure different indices
          [digits[i], digits[j]] = [digits[j], digits[i]];
          const swappedNum = parseInt(digits.join(""), 10);
          if (swappedNum <= maxNum && swappedNum >= minNum) confusingNumbersSet.add(swappedNum);
        }
      }

      // Change any one digit randomly
      if (numStr.length > 0) {
        const digits = numStr.split("");
        const randomIndex = Math.floor(Math.random() * digits.length);
        const originalDigit = digits[randomIndex];
        let newDigit;
        do {
          newDigit = String(Math.floor(Math.random() * 10));
        } while (newDigit === originalDigit); // Ensure a different digit
        digits[randomIndex] = newDigit;
        const changedNum = parseInt(digits.join(""), 10);
        if (changedNum <= maxNum && changedNum >= minNum) confusingNumbersSet.add(changedNum);
      }

      // Drop a digit (last or any random digit)
      if (numStr.length > 1) {
        // Drop the last digit
        const numWithoutLastDigit = parseInt(numStr.slice(0, -1), 10);
        if (numWithoutLastDigit <= maxNum && numWithoutLastDigit >= minNum)
          confusingNumbersSet.add(numWithoutLastDigit);

        // Drop a random digit
        const randomIndex = Math.floor(Math.random() * numStr.length);
        const numWithoutRandomDigit = parseInt(numStr.slice(0, randomIndex) + numStr.slice(randomIndex + 1), 10);
        if (numWithoutRandomDigit <= maxNum && numWithoutRandomDigit >= minNum)
          confusingNumbersSet.add(numWithoutRandomDigit);
      }

      // Add or subtract 1
      if (num + 1 <= maxNum) confusingNumbersSet.add(num + 1);
      if (num - 1 >= minNum) confusingNumbersSet.add(num - 1);
    });

    // Ensure the set has enough unique numbers
    while (confusingNumbersSet.size < totalNumbersRequired) {
      const randomNum = this.getRandomNumber(minNum, maxNum);
      if (!confusingNumbersSet.has(randomNum)) confusingNumbersSet.add(randomNum);
    }

    // Convert to array, filter out existing numbers, and shuffle
    let confusingNumbersArray = Array.from(confusingNumbersSet);
    confusingNumbersArray = confusingNumbersArray.filter((number) => !existingNumbers.includes(number));
    confusingNumbersArray = this.shuffleArray(confusingNumbersArray);

    // Select the required numbers
    const requiredNumbers = totalNumbersRequired - existingNumbers.length;
    confusingNumbersArray = confusingNumbersArray.slice(0, requiredNumbers);

    // Combine with existing numbers and shuffle again
    const finalArray = [...existingNumbers, ...confusingNumbersArray];
    return this.shuffleArray(finalArray);
  },

  /**
   * Saves an array of questions to a JSON file in a specified directory.
   *
   * @param {Array<Object>} questions - An array of question objects to be saved.
   * @param {string} fileNameWithoutExt - The base name (without extension) for the JSON file to be created.
   *
   * @description
   * - Function to save an array of questions to a JSON file
   * - If file does not exist, this function will create a file
   * - If file exists, this function will append questions to it's contents
   *
   */

  appendQuestionToJSONFile: function (question, fileNameWithoutExt) {
    const directoryPath = path.join("C:", "mathlete", "controllers", "src", "json_data");
    const targetFilePath = path.join(directoryPath, `${fileNameWithoutExt}.json`);

    // Write to the file in the specified directory (overwriting if it exists)
    fs.appendFileSync(targetFilePath, JSON.stringify(question, null, 2) + "\n", "utf-8");
  },

  /**
   * Randomly shuffles the elements of an array using the Fisher-Yates algorithm.
   *
   * @param {Array} array - The array to be shuffled.
   * @returns {Array} The same array, shuffled in place.
   *
   * @description
   * - The Fisher-Yates algorithm ensures a uniform random distribution of elements in the array.
   * - Iterates through the array from the last element to the first:
   *   - For each element at index `i`, swaps it with a randomly chosen element at an index `j` where `0 <= j <= i`.
   *   - Uses `Math.random()` to generate the random index `j`.
   * - The original array is shuffled in place (modifies the input array directly).
   * - Returns the shuffled array for chaining or convenience.
   *
   * @example
   * const myArray = [1, 2, 3, 4, 5];
   * shuffleArray(myArray);
   * console.log(myArray); // e.g., [4, 1, 5, 2, 3] (random order)
   */

  shuffleArray: function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  generateObjectsContainerWhole: function (icon, number, showCount, startCount) {
    /*
      CSS Comments:
      .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
      .countable-manipulatives-whole { border-radius: 8px; }
      .object-count-container { text-align: center; }
    */

    const cols = Math.min(number, 5); // Max 5 columns
    const rows = Math.ceil(number / cols); // Calculate total rows

    let imagesHtml = `<div class='countable-manipulatives countable-manipulatives-whole' 
        style='display: grid; grid-template-columns: repeat(${cols}, auto); gap: 10px;'>`;

    let currentCount = startCount;
    let remainingCount = number;

    for (let row = 0; row < rows; ++row) {
      let itemsInRow = Math.min(remainingCount, cols); // Items for this row

      // Add pictures for the current row
      for (let picCol = 0; picCol < itemsInRow; ++picCol) {
        imagesHtml += `<div class='object-image-container'>
        <img src='/assets/count-objects/${icon.iconName}' class='object-image' width='35' />
        </div>`;
      }

      let emptySlots = cols - itemsInRow;

      for (let emptyCol = 0; emptyCol < emptySlots; ++emptyCol) {
        imagesHtml += `<div class='empty'></div>`;
      }

      // Add numbers for the current row if showCount is true
      if (showCount) {
        for (let numCol = 0; numCol < itemsInRow; ++numCol) {
          imagesHtml += `<div class='object-count-container'>${currentCount++}</div>`;
        }

        emptySlots = cols - itemsInRow;

        for (let emptyCol = 0; emptyCol < emptySlots; ++emptyCol) {
          imagesHtml += `<div class='empty'></div>`;
        }
      }

      remainingCount -= itemsInRow; // Reduce remaining count
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

  generateObjectsContainerPartitioned: function (icons, numbers, showCount, isCountContinued) {
    /*
`  .equation-container {display: grid; grid-template-columns: repeat(4, auto); width: fit-content; align-items: center }
   .equation-container > div {text-align:center}
   .countable-manipulatives { display: grid; border: 2px solid #e7eef5; background-color: #e7eef5; gap: 5px; padding: 5px; }
   .countable-manipulatives-left {border-top-left-radius: 8px; border-bottom-left-radius: 8px; border-right:1px dotted black}
   .countable-manipulatives-right {border-top-right-radius: 8px; border-bottom-right-radius: 8px; border-left:1px dotted black}
   .object-count-container {text-align: center}
    */

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

  getRandomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  convertToDigitArray: function (number) {
    let numString = String(number).padStart(12, "0");
    let digitArray = numString
      .split("")
      .reverse()
      .map((digit) => parseInt(digit, 10));
    return digitArray;
  },

  placeValueChart: function (numbers, system, highlightCol, showHeader) {
    if (system === "Indian" && Math.max(...numbers) > 999999999) return "";
    if (system === "International" && Math.max(...numbers) > 999999999999) return "";

    /* Include in questions that call this function:
    .place-chart-header-cell {border: 1px solid black; text-align:center; background-color:#b7e7fb;padding:10px;}
    .place-chart-digit-cell {border: 1px solid black; text-align:center; padding:10px; min-width:50px}
    .highlight-cell {background-color: #f0fafe }
    */

    const indianHeaders = [
      "Ten Crores",
      "Crores",
      "Ten Lakhs",
      "Lakhs",
      "Ten Thousands",
      "Thousands",
      "Hundreds",
      "Tens",
      "Ones",
    ];
    const internationalHeaders = [
      "Hundred Billions",
      "Ten Billions",
      "Billions",
      "Hundred Millions",
      "Ten Millions",
      "Millions",
      "Hundred Thousands",
      "Ten Thousands",
      "Thousands",
      "Hundreds",
      "Tens",
      "Ones",
    ];

    const headers = system === "International" ? internationalHeaders : indianHeaders;

    const maxDigits = Math.max(...numbers).toString().length;
    const relevantHeaders = headers.slice(-maxDigits);

    let chart = `<table class='tbl tbl-bordered'>`;

    if (showHeader) {
      chart += `<tr>`;
      relevantHeaders.forEach((header) => {
        chart += `<th class='place-chart-header-cell'>${header}</th>`;
      });
      chart += `</tr>`;
    }

    // Add digit rows
    numbers.forEach((number) => {
      const digitArray = this.convertToDigitArray(number).slice(0, maxDigits).reverse();
      chart += `<tr>`;
      digitArray.forEach((digit, index) => {
        const highlight = highlightCol.includes(index) ? "highlight-cell" : "";
        chart += `<td class='place-chart-digit-cell ${highlight}'>${digit}</td>`;
      });
      chart += `</tr>`;
    });

    chart += `</table>`;
    return chart;
  },

  addCommasToNumber: function (number, system = "Indian") {
    if (number <= 9999) {
      return number.toString(); // No formatting needed for numbers <= 9999
    }

    let numStr = number.toString();
    let formattedNumber = "";

    if (system === "Indian") {
      // Split the last three digits
      const lastThreeDigits = numStr.slice(-3);
      const otherDigits = numStr.slice(0, -3);

      // Add commas to the remaining digits in pairs
      formattedNumber = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThreeDigits;
    } else {
      // For International system, add commas after every three digits
      formattedNumber = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return formattedNumber;
  },

  /**
   * Generates an HTML table to display a grid of numbers with customizable rows, clickable cells, and highlighted numbers.
   *
   * @param {number} minNum - The starting number of the grid.
   * @param {number} maxNum - The ending number of the grid.
   * @param {number} numbersInARow - The number of cells (columns) in each row of the grid.
   * @param {number[]} highlight - An array of numbers to highlight in the grid.
   * @param {boolean} clickable - If true, cells will be rendered as clickable with an `answer-code` attribute.
   * @param {string[]} answerCodes - An array of `answer-code` values corresponding to each number in the grid.
   *
   * @returns {string} - The generated HTML content for the number grid.
   *
   * @example
   * // Generate a 5x3 grid of numbers from 1 to 12, highlight 2 and 8, and make cells clickable
   * const grid = numberChart(1, 12, 5, [2, 8], true, ["code1", "code2", ..., "code12"]);
   * document.body.innerHTML = grid;
   *
   * // Output:
   * <table class='tbl number-grid'>
   *   <tr>
   *     <td class='answer-option clickable' answer-code='code1'>1</td>
   *     <td class='answer-option clickable' answer-code='code2'><span class="em-answer">2</span></td>
   *     <td class='answer-option clickable' answer-code='code3'>3</td>
   *     <td class='answer-option clickable' answer-code='code4'>4</td>
   *     <td class='answer-option clickable' answer-code='code5'>5</td>
   *   </tr>
   *   <tr>
   *     <td class='answer-option clickable' answer-code='code6'>6</td>
   *     <td class='answer-option clickable' answer-code='code7'>7</td>
   *     <td class='answer-option clickable' answer-code='code8'><span class="em-answer">8</span></td>
   *     <td class='answer-option clickable' answer-code='code9'>9</td>
   *     <td class='answer-option clickable' answer-code='code10'>10</td>
   *   </tr>
   *   <tr>
   *     <td class='answer-option clickable' answer-code='code11'>11</td>
   *     <td class='answer-option clickable' answer-code='code12'>12</td>
   *     <td></td>
   *     <td></td>
   *     <td></td>
   *   </tr>
   * </table>
   */

  numberChart: function (minNum, maxNum, numbersInARow, highlight, clickable, answerCodes) {
    /*
    .number-grid {border: 2px solid #b7e7fb; width: auto;}
    .number-grid td {border: 2px solid #b7e7fb; padding: 10px;}   
    .clickable {cursor: pointer; transition: background-color 0.3s, border-color 0.3s; background-color: #ffffff; text-align: center;} 
    .clickable:hover {background-color: #b7e7fb;} 
    .clickable.selected {background-color: #b7e7fb;} tbl {border-collapse:collapse;}     
    */
    let content = `<table class='tbl number-grid'>`;
    let currentCount = minNum;

    for (let row = 0; row < Math.ceil((maxNum - minNum + 1) / numbersInARow); row++) {
      content += "<tr>";
      for (let col = 0; col < numbersInARow; col++) {
        if (currentCount <= maxNum) {
          if (clickable) {
            content += `<td class='answer-option clickable' answer-code='${answerCodes[currentCount - 1]}'>`;
          } else {
            content += `<td>`;
          }
          if (highlight.includes(currentCount)) {
            content += `<span class="em-answer">${currentCount}</span>`;
          } else {
            content += currentCount;
          }
          content += `</td>`;
          currentCount++;
        } else {
          // Add empty cell if we've exhausted numbers
          content += `<td></td>`;
        }
      }
      content += "</tr>";
    }

    content += `</table>`;
    return content;
  },

  /**
   * Generates an HTML representation of a stack of cubes in grid format to visualize place-value models.
   *
   * @param {number} count - The number of cubes to represent (10 or 100).
   * @returns {string} - The generated HTML content for the stack of cubes.
   *
   * @example
   * // Generate a stack of 100 cubes (10x10 grid)
   * const stack = stackOfCubes(100);
   * document.body.innerHTML = stack;
   *
   * // Generate a stack of 10 cubes (1x10 grid)
   * const stack = stackOfCubes(10);
   * document.body.innerHTML = stack;
   */

  stackOfCubes: function (count) {
    /*
      .cube-grid {border-collapse: collapse;}
      .cube-grid td {width: 8px; height: 8px; border: 1px solid #b7e7fb; background-color: transparent;}
    */

    if (count !== 10 && count !== 100) {
      throw new Error("Invalid count. Only 10 or 100 cubes are allowed.");
    }

    let rows, cols;
    if (count === 100) {
      rows = 10;
      cols = 10;
    } else if (count === 10) {
      rows = 10;
      cols = 1;
    }

    let grid = `<table class="cube-grid">`;

    for (let row = 0; row < rows; row++) {
      grid += "<tr>";
      for (let col = 0; col < cols; col++) {
        grid += `
        <td></td>`;
      }
      grid += "</tr>";
    }

    grid += "</table>";

    return grid;
  },

  generateNumberName: function (number, system = "Indian") {
    // A dictionary to convert numbers to their respective number names
    const numberNames = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty",
      "twenty-one",
      "twenty-two",
      "twenty-three",
      "twenty-four",
      "twenty-five",
      "twenty-six",
      "twenty-seven",
      "twenty-eight",
      "twenty-nine",
      "thirty",
      "thirty-one",
      "thirty-two",
      "thirty-three",
      "thirty-four",
      "thirty-five",
      "thirty-six",
      "thirty-seven",
      "thirty-eight",
      "thirty-nine",
      "forty",
      "forty-one",
      "forty-two",
      "forty-three",
      "forty-four",
      "forty-five",
      "forty-six",
      "forty-seven",
      "forty-eight",
      "forty-nine",
      "fifty",
      "fifty-one",
      "fifty-two",
      "fifty-three",
      "fifty-four",
      "fifty-five",
      "fifty-six",
      "fifty-seven",
      "fifty-eight",
      "fifty-nine",
      "sixty",
      "sixty-one",
      "sixty-two",
      "sixty-three",
      "sixty-four",
      "sixty-five",
      "sixty-six",
      "sixty-seven",
      "sixty-eight",
      "sixty-nine",
      "seventy",
      "seventy-one",
      "seventy-two",
      "seventy-three",
      "seventy-four",
      "seventy-five",
      "seventy-six",
      "seventy-seven",
      "seventy-eight",
      "seventy-nine",
      "eighty",
      "eighty-one",
      "eighty-two",
      "eighty-three",
      "eighty-four",
      "eighty-five",
      "eighty-six",
      "eighty-seven",
      "eighty-eight",
      "eighty-nine",
      "ninety",
      "ninety-one",
      "ninety-two",
      "ninety-three",
      "ninety-four",
      "ninety-five",
      "ninety-six",
      "ninety-seven",
      "ninety-eight",
      "ninety-nine",
    ];

    if (number <= 99) {
      return numberNames[number];
    }

    // Define scales for Indian and International systems
    const scales = system === "Indian" ? ["", "crore", "lakh", "thousand"] : ["", "billion", "million", "thousand"];

    const divisors =
      system === "Indian"
        ? [10000000, 100000, 1000] // Divisors for Indian system
        : [1000000000, 1000000, 1000]; // Divisors for International system

    let name = "";

    // Loop through scales
    for (let i = 0; i < divisors.length; i++) {
      const divisor = divisors[i];
      if (number >= divisor) {
        const chunk = Math.floor(number / divisor);
        if (chunk > 0) {
          name += `${this.generateNumberName(chunk)} ${scales[i + 1]} `; // Use `i + 1` to match scale index
        }
        number %= divisor; // Reduce the number for the next scale
      }
    }

    // Process hundreds
    if (number >= 100) {
      const hundreds = Math.floor(number / 100);
      name += `${numberNames[hundreds]} hundred `;
      number %= 100;
    }

    // Process the remainder (below 100)
    if (number > 0) {
      name += numberNames[number];
    }

    return name.trim();
  },
};


