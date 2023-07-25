const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

let wordOfDay = null;
let guess = "";
let guessValues;
let lastGuess = false;
let correctArray = [];
let partialArray = [];
let turn = 0;

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
      turn = 1;
      movement(secondFieldset, firstFieldset, firstGuessInputs);
      break;
    case "second":
      turn = 2;
      movement(thirdFieldset, secondFieldset, secondGuessInputs);
      break;
    case "third":
      turn = 3;
      movement(fourthFieldset, thirdFieldset, thirdGuessInputs);
      break;
    case "fourth":
      turn = 4;
      movement(fifthFieldset, fourthFieldset, fourthGuessInputs);
      break;
    case "fifth":
      turn = 5;
      movement(sixthFieldset, fifthFieldset, fifthGuessInputs);
      break;
    case "sixth":
      turn = 6;
      grabGuess(sixthGuessInputs);
      lastGuess = true;
      compareCorrectLetters(guess, wordOfDay);
      colorCorrectLetters(sixthGuessInputs, correctArray, partialArray);
      winConditions();
      sixthFieldset.setAttribute("disabled", "");
      break;
    default:
      console.log(`messed up ${order}`);
  }
}

function winConditions() {
  if (guess == wordOfDay) {
    if (turn >= 2) {
      alert(`Congratulations, you won in ${turn} turns!!`);
    } else {
      alert(`Amazing! You won in ${turn} turn!!`);
    }
    return;
  } else if (guess != wordOfDay && lastGuess == true) {
    alert(`Better luck tomorrow. The answer was ${wordOfDay}.`);
  } else if (lastGuess != true) {
    guess = "";
    correctArray = [];
    partialArray = [];
    focusNext();
  }
}

function movement(nextFieldset, currentFieldset, inputArray) {
  nextFieldset.removeAttribute("disabled");
  grabGuess(inputArray);
  compareCorrectLetters(guess, wordOfDay);
  colorCorrectLetters(inputArray, correctArray, partialArray);
  winConditions();
  currentFieldset.setAttribute("disabled", "");
}

function compareCorrectLetters(guess, answer) {
  let tempAnswer = answer.split("");
  let tempGuess = guess.split("");
  for (let index = 0; index < answer.length; index++) {
    //matches
    if (tempGuess[index] == tempAnswer[index]) {
      correctArray[index] = true;
      tempAnswer[index] = -1;
      tempGuess[index] = 5;
    } else {
      correctArray[index] = false;
    }
  }
  for (let index = 0; index < answer.length; index++) {
    if (tempAnswer.includes(tempGuess[index])) {
      partialArray[index] = true;
      tempAnswer[tempAnswer.indexOf(tempGuess[index])] = -1;
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
