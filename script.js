const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
const ANSWER_LENGTH = 5;

let wordOfDay = null;
let guess = "";
let processingGuess = "";
let isGuessValid = Promise;
let guessValues;
let lastGuess = false;
let correctArray = [];
let partialArray = [];
let turn = 0;
let currentRow = 0;

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

const spinner = document.querySelector(".loading-bar");
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

const fieldsets = Array.prototype.slice.call(
  document.querySelectorAll("fieldset")
);

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function focusNext(key) {
  const currInput = document.activeElement;
  const currInputIndex = inputs.indexOf(currInput);
  const nextInputIndex = (currInputIndex + 1) % inputs.length;
  const input = inputs[nextInputIndex];
  input.focus();
  if (isLetter(key)) {
    input.value = key;
  }
}

function focusBack() {
  const currInput = document.activeElement;
  const currInputIndex = inputs.indexOf(currInput);
  const nextInputIndex = (currInputIndex - 1) % inputs.length;
  const input = inputs[nextInputIndex];
  input.focus();
  //put cursor at end of input
  setTimeout(function () {
    input.selectionStart = input.selectionEnd = 10000;
  }, 0);
}

async function getWordOfDay() {
  const promise = await fetch(WORD_URL);
  const processedResponse = await promise.json();
  wordOfDay = processedResponse.word;
  setLoading(false);
}

function grabGuess(whichGuess) {
  whichGuess.forEach((element) => {
    guess = guess + element.value;
  });
  guess = guess.toLowerCase();
  return guess;
}

async function validateGuess(guess, inputArray) {
  setLoading(true);
  const promise = await fetch(VALIDATE_WORD_URL, {
    method: "POST",
    body: JSON.stringify({ word: guess }),
  });
  const processedResponse = await promise.json();
  isGuessValid = await processedResponse.validWord;
  if (turn == 6 && isGuessValid == true) {
    lastGuess = true;
  }
  movement(inputArray);
  setLoading(false);
}

function checkOrder() {
  let order = document.activeElement.form.id;
  switch (order) {
    case "first":
      turn = 1;
      grabGuess(firstGuessInputs);
      validateGuess(guess, firstGuessInputs);
      break;
    case "second":
      turn = 2;
      grabGuess(secondGuessInputs);
      validateGuess(guess, secondGuessInputs);
      break;
    case "third":
      turn = 3;
      grabGuess(thirdGuessInputs);
      validateGuess(guess, thirdGuessInputs);
      break;
    case "fourth":
      turn = 4;
      grabGuess(fourthGuessInputs);
      validateGuess(guess, fourthGuessInputs);
      break;
    case "fifth":
      turn = 5;
      grabGuess(fifthGuessInputs);
      validateGuess(guess, fifthGuessInputs);
      break;
    case "sixth":
      turn = 6;
      grabGuess(sixthGuessInputs);
      validateGuess(guess, sixthGuessInputs);
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

function movement(inputArray) {
  if (isGuessValid == true) {
    if (lastGuess == false) {
      fieldsets[currentRow + 1].removeAttribute("disabled");
      compareCorrectLetters(guess, wordOfDay);
      winConditions();
      fieldsets[currentRow].setAttribute("disabled", "");
    } else {
      compareCorrectLetters(guess, wordOfDay);
      winConditions();
      fieldsets[currentRow].setAttribute("disabled", "");
    }
    currentRow++;
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
      inputs[currentRow * ANSWER_LENGTH + index].classList.add("correct");
      tempAnswer[index] = -1;
      tempGuess[index] = 5;
    } else {
      inputs[currentRow * ANSWER_LENGTH + index].classList.add("wrong");
    }
  }
  for (let index = 0; index < answer.length; index++) {
    if (tempAnswer.includes(tempGuess[index])) {
      inputs[currentRow * ANSWER_LENGTH + index].classList.add("partial");
      tempAnswer[tempAnswer.indexOf(tempGuess[index])] = -1;
    }
  }
}

function setLoading(isLoading) {
  spinner.classList.toggle("show", isLoading);
}

getWordOfDay();

startTextInput.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key == "Backspace" || key == "Tab") {
      return;
    } else if (key == "ArrowRight") {
      focusNext();
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
    if (isLetter(key) && input.value.length >= input.maxLength) {
      focusNext(key);
    }
  });
});

baseTextInput.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const key = event.key;
    if ((key == "Backspace" && input.value.length == 0) || key == "ArrowLeft") {
      focusBack();
    } else if (key == "Backspace" || key == "Tab") {
      return;
    } else if (key == "ArrowRight") {
      focusNext();
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
    if (isLetter(key) && input.value.length >= input.maxLength) {
      focusNext(key);
    }
  });
});

finalTextInput.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    const key = event.key;
    if ((key == "Backspace" && input.value.length == 0) || key == "ArrowLeft") {
      focusBack();
    } else if (key == "Backspace" || key == "Tab") {
      return;
    } else if (key == "ArrowRight") {
      focusNext();
    } else if (event.key == "Enter") {
      correctArray = [];
      partialArray = [];
      checkOrder();
    } else if (isLetter(key) && input.value.length == input.maxLength) {
      input.value = key;
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
  });
});
