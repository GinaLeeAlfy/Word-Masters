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

let inputs = Array.prototype.slice.call(document.querySelectorAll("input"));
let baseTextInput = document.querySelectorAll(".base-tester-input");
let finalTextInput = document.querySelectorAll(".final-tester-input");

for (let i = 0; i < baseTextInput.length; i++) {
  const element = baseTextInput[i];
  element.addEventListener("keydown", function (event) {
    if (event.key == "Backspace") {
      return;
    } else if (!isLetter(event.key)) {
      event.preventDefault();
    }
  });

  element.addEventListener("keyup", function (event) {
    if (isLetter(event.key)) {
      focusNext();
    }
  });
}

for (let i = 0; i < finalTextInput.length; i++) {
  const element = finalTextInput[i];
  element.addEventListener("keydown", function (event) {
    if (event.key == "Backspace") {
      return;
    } else if (event.key == "Enter") {
      return;
    } else if (!isLetter(event.key)) {
      event.preventDefault();
    }
  });
}
