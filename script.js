const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

let wordOfDay = null;
let guess = "";
let guessValues;
let lastGuess = false;
let correctArray = [];
let partialArray = [];
let repeats = [];
let wordOfDayRepeats = hasRepeats(wordOfDay);

let inputs = Array.prototype.slice.call(document.querySelectorAll("input"));
let startTextInput = Array.prototype.slice.call(
  document.querySelectorAll(".start-tester-input")
);
let baseTextInput = Array.prototype.slice.call(
  document.querySelectorAll(".base-tester-input")
);
let finalTextInput = Array.prototype.slice.call(
  document.querySelectorAll(".final-tester-input")
);

let firstGuessInputs = Array.prototype.slice.call(
  document.getElementById("firstGuess").children
);

let secondGuessInputs = Array.prototype.slice.call(
  document.getElementById("secondGuess").children
);
let thirdGuessInputs = Array.prototype.slice.call(
  document.getElementById("thirdGuess").children
);
let fourthGuessInputs = Array.prototype.slice.call(
  document.getElementById("fourthGuess").children
);
let fifthGuessInputs = Array.prototype.slice.call(
  document.getElementById("fifthGuess").children
);
let sixthGuessInputs = Array.prototype.slice.call(
  document.getElementById("sixthGuess").children
);

const firstFieldset = document.getElementById("firstGuess");
const secondFieldset = document.getElementById("secondGuess");
const thirdFieldset = document.getElementById("thirdGuess");
const fourthFieldset = document.getElementById("fourthGuess");
const fifthFieldset = document.getElementById("fifthGuess");
const sixthFieldset = document.getElementById("sixthGuess");

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function focusNext() {
  const currInput = document.activeElement;
  const currInputIndex = inputs.indexOf(currInput);
  const nextInputIndex = (currInputIndex + 1) % inputs.length;
  const input = inputs[nextInputIndex];
  input.focus();
}

function focusBack() {
  const currInput = document.activeElement;
  const currInputIndex = inputs.indexOf(currInput);
  const nextInputIndex = (currInputIndex - 1) % inputs.length;
  const input = inputs[nextInputIndex];
  input.focus();
}

async function getWordOfDay() {
  const promise = await fetch(WORD_URL);
  const processedResponse = await promise.json();
  wordOfDay = processedResponse.word;
}

function grabGuess(whichGuess) {
  whichGuess.forEach((element) => {
    guess = guess + element.value;
    guessValues = whichGuess.map((x) => x.value);
    return guess, guessValues;
  });
}

function checkOrder() {
  let order = document.activeElement.form.id;
  switch (order) {
    case "first":
      movement(secondFieldset, firstFieldset, firstGuessInputs);
      break;
    case "second":
      movement(thirdFieldset, secondFieldset);
      break;
    case "third":
      movement(fourthFieldset, thirdFieldset);
      break;
    case "fourth":
      movement(fifthFieldset, fourthFieldset);
      break;
    case "fifth":
      movement(sixthFieldset, fifthFieldset);
      break;
    case "sixth":
      grabGuess(sixthGuessInputs);
      lastGuess = true;
      winConditions();
      sixthFieldset.setAttribute("disabled", "");
      break;
    default:
      console.log(`messed up ${order}`);
  }
}

function winConditions() {
  if (guess == wordOfDay) {
    alert("You Win!!!");
    return;
  } else if (guess != wordOfDay && lastGuess == true) {
    alert(`Better luck tomorrow. The answer was ${wordOfDay}.`);
  } else if (lastGuess != true) {
    guess = "";
    focusNext();
  }
}

function movement(nextFieldset, currentFieldset, inputArray) {
  nextFieldset.removeAttribute("disabled");
  grabGuess(firstGuessInputs);
  compareCorrectLetters(guess, wordOfDay);
  colorCorrectLetters(inputArray, correctArray, partialArray);
  winConditions();
  currentFieldset.setAttribute("disabled", "");
}

function compareCorrectLetters(guess, answer) {
  if (hasRepeats(guess)) {
    let guessLetters = {};
    for (const letter of guess) {
      guessLetters[letter] = guessLetters.hasOwnProperty(letter)
        ? guessLetters[letter] + 1
        : 1;
    }
    for (const letter of guessLetters) {
      if (guessLetters.hasOwnProperty(letter) && guessLetters[letter] > 1) {
        repeats.push(letter);
      }
    }
    console.log(guessLetters);
  }
  for (let index = 0; index < answer.length; index++) {
    const element = answer[index];
    correctArray.push(guess[index] == answer[index]);
    if (!hasRepeats(guess)) {
      partialArray.push(answer.includes(guess[index]));
    }
  }
  return correctArray, partialArray;
}

function colorCorrectLetters(inputArray, correctArray, partialArray) {
  for (let index = 0; index < inputArray.length; index++) {
    const element = inputArray[index];
    if (correctArray[index] === true) {
      inputArray[index].classList.add("correct");
    } else if (partialArray[index] === true) {
      inputArray[index].classList.add("partial");
    } else if (correctArray[index] === false) {
      inputArray[index].classList.add("wrong");
    }
  }
}

function hasRepeats(str) {
  return /(.).*\1/.test(str);
}

getWordOfDay();

startTextInput.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key == "Backspace") {
      return;
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
    if (isLetter(key) && input.value.length >= input.maxLength) {
      focusNext();
    }
  });
});

baseTextInput.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key == "Backspace" && input.value.length == 0) {
      focusBack();
    } else if (key == "Backspace") {
      return;
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
    if (isLetter(key) && input.value.length >= input.maxLength) {
      focusNext();
    }
  });
});

finalTextInput.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key == "Backspace" && input.value.length == 0) {
      focusBack();
    } else if (key == "Backspace") {
      return;
    } else if (event.key == "Enter") {
      checkOrder();
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
  });
});
