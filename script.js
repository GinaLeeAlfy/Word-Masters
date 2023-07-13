function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

document
  .querySelector(".tester-input")
  .addEventListener("keydown", function (event) {
    // uses the isLetter function from above
    if (!isLetter(event.key)) {
      event.preventDefault();
    }
  });
