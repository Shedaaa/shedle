// Setting game option
let numbersOfTries = 6;

let currentTry = 1;
let numbersOfHints = 2;

// Manage Words

let wordToGuess = "";

wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

let messageArea = document.querySelector(".message");
let winGame = document.getElementById("win-game");
let loseGame = document.getElementById("lose-game");
let theAnswer = document.getElementById("the-answer");
let theAnswer2 = document.getElementById("the-answer2");

let numbersOfLetters = wordToGuess.length;

// Manage Hints
document.querySelector(".hint span").innerHTML = numbersOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

//
function generateInput() {
  const inputsContainer = document.querySelector(".inputs");
  inputsContainer.innerHTML = ""; // Clear existing inputs

  for (let i = 1; i <= numbersOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  // Fill dashes in the inputs on load and make them non-editable
  fillDashes();
  fillDots();
  fillSlash();

  // Focus on first input
  inputsContainer.children[0].children[1].focus();

  // Disable all input except the first one in the current try
  const inputsInDisableDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisableDiv.forEach((input) => (input.disabled = true));

  const inputs = Array.from(document.querySelectorAll("input")); // Convert NodeList to Array
  inputs.forEach((input, index) => {
    // Skip dash inputs automatically
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      let nextInput = inputs[index + 1];
      while (nextInput && nextInput.disabled) {
        nextInput = inputs[inputs.indexOf(nextInput) + 1];
      }
      if (nextInput) nextInput.focus();
    });

    // Skip dash inputs with arrow keys
    input.addEventListener("keydown", function (event) {
      const currentIndex = inputs.indexOf(event.target);
      if (event.key === "ArrowRight") {
        let nextInput = currentIndex + 1;
        while (nextInput < inputs.length && inputs[nextInput].disabled) {
          nextInput++;
        }
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        let prevInput = currentIndex - 1;
        while (prevInput >= 0 && inputs[prevInput].disabled) {
          prevInput--;
        }
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

function fillDashes() {
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryInputs = document.querySelectorAll(`.try-${i} input`);
    wordToGuess.split("").forEach((char, index) => {
      if (char === "-") {
        tryInputs[index].value = "-";
        tryInputs[index].disabled = true; // Disable inputs with dashes
      }
    });
  }
}

function fillDots() {
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryInputs = document.querySelectorAll(`.try-${i} input`);
    wordToGuess.split("").forEach((char, index) => {
      if (char === ".") {
        tryInputs[index].value = ".";
        tryInputs[index].disabled = true; // Disable inputs with dashes
      }
    });
  }
}
function fillSlash() {
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryInputs = document.querySelectorAll(`.try-${i} input`);
    wordToGuess.split("").forEach((char, index) => {
      if (char === "/") {
        tryInputs[index].value = "/";
        tryInputs[index].disabled = true; // Disable inputs with dashes
      }
    });
  }
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // check if user win or lose
  if (successGuess) {
    winGame.style.display = "flex";
    theAnswer.innerHTML = wordToGuess;
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    guessButton.disabled = true;
    getHintButton.disabled = true;
    let category = document.querySelector(".category");
    category.classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let element = document.querySelector(`.try-${currentTry}`);
    if (element) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      element.children[1].focus();
    } else {
      loseGame.style.display = "flex";
      theAnswer2.innerHTML = wordToGuess;
      guessButton.disabled = true;
      getHintButton.disabled = true;
      let category = document.querySelector(".category");
      category.classList.add("disabled-inputs");
    }
  }
}

function getHint() {
  if (numbersOfHints > 0) {
    numbersOfHints--;
    document.querySelector(".hint span").innerHTML = numbersOfHints;
  }
  if (numbersOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

// function showDashLetter() {
//   const enabledInputs = document.querySelectorAll("input");
//   const emptyEnabledInputs = wordToGuess.filter(
//     (letter) => letter.value === "-"
//   );
//   console.log(emptyEnabledInputs);
//   if (emptyEnabledInputs !== -1) {
//   }
// }

// Array.from(enabledInputs).filter(
//   (input) => input.value === ""
// )

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);

function handleEnter(event) {
  if (event.key === "Enter") {
    const inputEnter = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputEnter).indexOf(document.activeElement);
    if (currentIndex > 0) {
      guessButton.click();
    }
  }
}
document.addEventListener("keydown", handleEnter);

// console.log(wordToGuess);

window.onload = function () {
  generateInput();
  fillDots();
  fillDashes();
};
