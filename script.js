function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

let baseTextInput = document.querySelectorAll(".base-tester-input");
let finalTextInput = document.querySelectorAll(".final-tester-input");

for (let i = 0; i < baseTextInput.length; i++) {
  const element = baseTextInput[i];
  element.addEventListener("keydown", function (event) {
    console.log(event.key);
    if (!isLetter(event.key) && event.key != "Backspace") {
      event.preventDefault();
    }
  });
}

for (let i = 0; i < finalTextInput.length; i++) {
  const element = finalTextInput[i];
  element.addEventListener("keydown", function (event) {
    console.log(event.key);
    if (
      !isLetter(event.key) &&
      event.key != "Backspace" &&
      event.key != "Enter"
    ) {
      event.preventDefault();
    }
  });
}
