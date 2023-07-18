function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

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

  // element.addEventListener("keyup", function (event) {
  //   if (isLetter(event.key)) {
  //     function simulateKeyPress(key) {
  //       const event = new KeyboardEvent("keyup", { key });
  //       element.dispatchEvent(event);
  //     }
  //     simulateKeyPress("Tab");
  //   }
  // });
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
