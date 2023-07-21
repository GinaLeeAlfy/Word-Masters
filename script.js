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

let firstGuess = Array.prototype.slice.call(
  document.getElementById("firstGuess").children
);

let secondGuess = Array.prototype.slice.call(
  document.getElementById("secondGuess").children
);
let thirdGuess = Array.prototype.slice.call(
  document.getElementById("thirdGuess").children
);
let fourthGuess = Array.prototype.slice.call(
  document.getElementById("fourthGuess").children
);
let fifthGuess = Array.prototype.slice.call(
  document.getElementById("fifthGuess").children
);
let sixthGuess = Array.prototype.slice.call(
  document.getElementById("sixthGuess").children
);

let firstGuessValues = [];

let secondGuessValues = [];

let thirdGuessValues = [];

let fourthGuessValues = [];

let fifthGuessValues = [];

let sixthGuessValues = [];

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

function checkAnswer() {}

async function getWordOfDay() {
  const promise = await fetch(WORD_URL);
  const processedResponse = await promise.json();
  wordOfDay = processedResponse.word;
}

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
      if (answer == wordOfDay) {
        focusNext();
      }
    } else if (!isLetter(key)) {
      event.preventDefault();
    }
  });
});

getWordOfDay();

function grabGuess(whichGuess, whichGuessValues) {
  whichGuess.forEach((element) => {
    guess = guess + element.value;
    whichGuessValues = whichGuess.map((x) => x.value);
    console.log(guess);
    return guess;
  });
}

function checkOrder() {
  let order = document.activeElement.form.id;
  switch (order) {
    case "firstGuess":
      grabGuess(firstGuess, firstGuessValues);
      break;
    case "secondGuess":
      grabGuess(secondGuess, secondGuessValues);
      break;
    case "thirdGuess":
      grabGuess(thirdGuess, thirdGuessValues);
      break;
    case "fourthGuess":
      grabGuess(fourthGuess, fourthGuessValues);
      break;
    case "fifthGuess":
      grabGuess(fifthGuess, fifthGuessValues);
      break;
    case "sixthGuess":
      grabGuess(sixthGuess, sixthGuessValues);
      break;
      default:
        console.log(`messed up ${order}``)
  }
}
