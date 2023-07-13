function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

let textInput = document.querySelectorAll(".tester-input");

for (let i = 0; i < textInput.length; i++) {
  const element = textInput[i];
  element.addEventListener("keydown", function (event) {
    if (!isLetter(event.key)) {
      event.preventDefault();
    }
  });
}
