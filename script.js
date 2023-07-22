const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

let wordOfDay = null;
let guess = "";

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

let guessValues;
let lastGuess = false;

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
      movement(secondFieldset, firstFieldset);
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

function movement(nextFieldset, currentFieldset) {
  nextFieldset.removeAttribute("disabled");
  grabGuess(firstGuessInputs);
  winConditions();
  currentFieldset.setAttribute("disabled", "");
}

function compareAnswer(guess, answer) {
  let firstLetter = guess[0] == answer[0];
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
