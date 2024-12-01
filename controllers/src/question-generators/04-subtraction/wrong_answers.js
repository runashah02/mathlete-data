function generateConfusingOptions(a, b, numOptions) {
  const correctAnswer = a + b;
  const options = new Set();
  options.add(correctAnswer);

  // Function to generate a close answer within a small range
  const generateCloseAnswer = (answer) => {
    const offset = Math.floor(Math.random() * 5) + 1; // Random offset between 1 and 5
    answer = Math.random() < 0.5 ? answer + offset : answer - offset;
    console.log("close answer", answer);
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

  // Example usage
  console.log(generateTwoDistinctRandomNumbers(4)); // Should produce two distinct numbers between 1 and 2
  console.log(generateTwoDistinctRandomNumbers(5)); // Should produce two distinct numbers between 1 and 3
  console.log(generateTwoDistinctRandomNumbers(6)); // Should produce two distinct numbers between 1 and 3

  const switchDigits = (answer, i, j) => {
    let answerArr = answer.toString().split("");
    let temp = answerArr[j];
    answerArr[j] = answerArr[i];
    answerArr[i] = temp;
    answer = parseInt(answerArr.join(""));
    console.log(i, j);
    console.log("switch digits", answer);
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
    console.log("carry error", errorAnswer);
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
}

console.log(generateConfusingOptions(526, 999, 4));
