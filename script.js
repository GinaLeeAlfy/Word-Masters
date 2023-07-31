const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";

let wordOfDay = null;
let guess = "";
let isGuessValid = Promise;
let guessValues;
let lastGuess = false;
let correctArray = [];
let partialArray = [];
let turn = 0;

const inputs = Array.prototype.slice.call(document.querySelectorAll("input"));
const startTextInput = Array.prototype.slice.call(
  document.querySelectorAll(".start-tester-input")
);
const baseTextInput = Array.prototype.slice.call(
  document.querySelectorAll(".base-tester-input")
);
const finalTextInput = Array.prototype.slice.call(
  document.querySelectorAll(".final-tester-input")
);

const spinner = document.querySelector(".spinner");
const header = document.querySelector("h1");

const firstGuessInputs = Array.prototype.slice.call(
  document.getElementById("firstGuess").children
);

const secondGuessInputs = Array.prototype.slice.call(
  document.getElementById("secondGuess").children
);
const thirdGuessInputs = Array.prototype.slice.call(
  document.getElementById("thirdGuess").children
);
const fourthGuessInputs = Array.prototype.slice.call(
  document.getElementById("fourthGuess").children
);
const fifthGuessInputs = Array.prototype.slice.call(
  document.getElementById("fifthGuess").children
);
const sixthGuessInputs = Array.prototype.slice.call(
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

async function validateGuess(guess, nextFieldset, currentFieldset, inputArray) {
  spinner.innerHTML = "🌀";
  const promise = await fetch(VALIDATE_WORD_URL, {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });
  const processedResponse = await promise.json();
  isGuessValid = await processedResponse.validWord;
  spinner.innerHTML = "";
  if (turn == 6 && isGuessValid == true) {
    lastGuess = true;
  }
  movement(nextFieldset, currentFieldset, inputArray);
}

function checkOrder() {
  let order = document.activeElement.form.id;
  switch (order) {
    case "first":
      turn = 1;
      grabGuess(firstGuessInputs);
      validateGuess(guess, secondFieldset, firstFieldset, firstGuessInputs);
      break;
    case "second":
      turn = 2;
      grabGuess(secondGuessInputs);
      validateGuess(guess, thirdFieldset, secondFieldset, secondGuessInputs);
      break;
    case "third":
      turn = 3;
      grabGuess(thirdGuessInputs);
      validateGuess(guess, fourthFieldset, thirdFieldset, thirdGuessInputs);
      break;
    case "fourth":
      turn = 4;
      grabGuess(fourthGuessInputs);
      validateGuess(guess, fifthFieldset, fourthFieldset, fourthGuessInputs);
      break;
    case "fifth":
      turn = 5;
      grabGuess(fifthGuessInputs);
      validateGuess(guess, sixthFieldset, fifthFieldset, fifthGuessInputs);
      break;
    case "sixth":
      turn = 6;
      grabGuess(sixthGuessInputs);
      validateGuess(guess, null, sixthFieldset, sixthGuessInputs);
      break;
    default:
      console.log(`messed up ${order}`);
  }
}

function winConditions() {
  if (guess == wordOfDay) {
    header.classList.add("rainbow");
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
  if (isGuessValid == true) {
    if (lastGuess == false) {
      nextFieldset.removeAttribute("disabled");
      compareCorrectLetters(guess, wordOfDay);
      colorCorrectLetters(inputArray, correctArray, partialArray);
      winConditions();
      currentFieldset.setAttribute("disabled", "");
    } else {
      compareCorrectLetters(guess, wordOfDay);
      colorCorrectLetters(inputArray, correctArray, partialArray);
      winConditions();
      currentFieldset.setAttribute("disabled", "");
    }
  } else if (isGuessValid == false) {
    inputArray.forEach((input) => {
      input.classList.add("invalid");
    });
    setTimeout(() => {
      inputArray.forEach((input) => {
        input.classList.remove("invalid");
      });
    }, 1000);
    guess = "";
    correctArray = [];
    partialArray = [];
  }
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
    } else if (key == "Tab") {
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
    } else if (key == "Tab") {
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
    } else if (key == "Tab") {
      return;
    } else if (event.key == "Enter") {
      correctArray = [];
      partialArray = [];
      checkOrder();
    } else if (isLetter(key) && input.value.length == 1) {
      input.value = key;
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
  });
});
