import { WORD_LIST, GUESS_LIST } from "./words.js";

/*-------------------------------- Constants --------------------------------*/
const WORD_LENGTH = 5; // Length of word to guess
const MAX_ATTEMPTS = 6; // Maximum number of attempts
const wordList = WORD_LIST; // Correct words
const guessList = GUESS_LIST; // Valid but incorrect words


/*---------------------------- Variables (state) ----------------------------*/
let currentAttempt; // Tracks how many guesses the player has made
let currentPosition; // Tracks current position (index) in the current word guess
let gameOver; // Indicates if game is over
let word; // The word selected from wordList
let usedLetters; // Tracks keyboard letters that have been used
let board; // Representation of game board with 2D array to hold tiles


/*------------------------ Cached Element References ------------------------*/
const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
const resetButtonEl = document.getElementById("reset-button");


/*-------------------------------- Functions --------------------------------*/

function initializeGame() {
    initializeState(); // Initializes game state variables
    initializeBoard(); // Sets up game board UI and add event listeners
    initializeKeyboardListeners(); // Adds event listeners for physical keyboard and on-screen buttons
    initializeResetButton();
}

// Initialize game state
function initializeState() {
    currentAttempt = 0;
    currentPosition = 0;
    gameOver = false;
    word = getRandomWord();
    usedLetters = new Set();
    board = [];
}

// Get a random word from the word list
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

// Initialize the game board with 6 rows
function initializeBoard() {
    boardEl.innerHTML = ''; // Clear existing board

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const rowEl = document.createElement("div");
        rowEl.className = "board-row";
        const rowTiles = [];
        // create # tiles depending on WORD_LENGTH
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tileEl = document.createElement("div");
            tileEl.className = "tile"; // default tile class
            rowEl.appendChild(tileEl); 
            rowTiles.push(tileEl);
        }

        boardEl.appendChild(rowEl); // add row to board
        board.push(rowTiles); // add row to board array
    }
}

// Handles physical key presses (Enter, Backspace and alphabetic keys)
function handleKeyPress(e) {
    if (e.key === "Enter") {
        handleInput("ENTER");
    } else if (e.key === "Backspace") {
        handleInput("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(e.key)) { // Handles only alphabets
        handleInput(e.key.toUpperCase()); // Converts to uppercase and handle
    }
}

// Handle user input (both physical keyboard and on-screen keyboard)
function handleInput(key) {
    if (gameOver) return; // Ignores input if game is over

    if (key === "ENTER") { // Processes only valid guesses
        const guess = getCurrentGuess();
        if (!isValidGuess(guess)) {
            showMessage("Invalid word, please try again!");
            return;
        }
        checkWord();
    } else if (key === "BACKSPACE") {
        deleteLetter(); // Deletes the last entered letter
    } else if (/^[A-Z]$/.test(key) && currentPosition < WORD_LENGTH) {
        addLetter(key); // Adds letter to current guess
    }
}

// Validates guess, must be in wordList or guessList to be valid
function isValidGuess(guess) {
    return wordList.includes(guess) || guessList.includes(guess);
}

// Get current guess
function getCurrentGuess() { 
    return board[currentAttempt] // -> [<div>H</div>, <div>E</div>, <div>L</div>, <div>L</div>, <div>O</div>]
        .map(tileEl => tileEl.textContent) // -> ["H", "E", "L", "L", "O"]
        .join(""); // -> "HELLO"
}

// Add a letter to the current guess
function addLetter(letter) {
    if (currentPosition < WORD_LENGTH) {
        board[currentAttempt][currentPosition].textContent = letter;
        currentPosition++;
    }
}

// Delete the last letter
function deleteLetter() {
    if (currentPosition > 0) {
        currentPosition--;
        board[currentAttempt][currentPosition].textContent = "";
    }
}

// Check the word against the target
function checkWord() {
    if (currentPosition !== WORD_LENGTH) return; // Ensures full word is entered

    const guess = getCurrentGuess();
    if (guess.length !== WORD_LENGTH) return; // Prevents invalid guesses

    updateTileColors(guess); // Update tile colors based on guess

    if (guess === word) { // If guess equal to word, win
        showMessage(`Congratulations, you won! The word was ${word}`);
        gameOver = true;
        return;
    }
    // If guess is incorrect but valid, continue game
    showMessage(`Close but no banana, lets try again!`);
    // If max attempts reached, show word and end game
    if (currentAttempt === MAX_ATTEMPTS - 1) {
        showMessage(`Better luck next time! The word was ${word}`);
        gameOver = true;
        return;
    }

    currentAttempt++;
    currentPosition = 0;
}

// Update tile colors based on guess
function updateTileColors(guess) {
    const tiles = board[currentAttempt];
    const letterCount = {}; // Empty object to track letter counts

    // Iterates through the word and gives a letter count
    for (let letter of word) { // Undefined or zero
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    // First pass: marks correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === word[i]) {
            tiles[i].className = "tile correct"; // Mark letter in correct position green
            letterCount[guess[i]]--; // Decrements letter count
        }
    }

    // Second pass: mark present and absent letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === word[i]) continue; // Ignores already matched letters from first pass

        if (letterCount[guess[i]] > 0) {
            tiles[i].className = "tile present"; // Mark letter in wrong position yellow if there is still instance of the letter in word
            letterCount[guess[i]]--; // Decrements letter count
        } else {
            tiles[i].className = "tile absent"; // Marks absent letters gray
        }
    }
    updateKeyboardColors(guess);
}

// Update keyboard colors
function updateKeyboardColors(guess) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess[i];
        const button = document.querySelector(`button[data-key="${letter}"]`);
        if (!button) continue; // Skip if no button exists for the letter

        if (guess[i] === word[i]) {
            button.style.backgroundColor = '#6ca965';
            button.style.color = 'white';
        } else if (word.includes(letter)) {
            button.style.backgroundColor = '#c8b653';
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '#787c7f';
            button.style.color = 'white';
            usedLetters.add(letter); // Tracks used letters
        }
    }
}

// Reset keyboard colors
function resetKeyboardColors() {
    const buttons = document.querySelectorAll("#keyboard button");
    buttons.forEach(button => {
        button.style.backgroundColor = "";
        button.style.color = "";
    });
}

// Displays a message to the player (win, lose, feedback)
function showMessage(msg) {
    messageEl.textContent = msg;
}

/*----------------------------- Event Listeners -----------------------------*/
// Initializes event listeners for keyboard input (physical and on-screen buttons)
function initializeKeyboardListeners() { // Listens for keypresses on KB
    document.addEventListener("keydown", handleKeyPress);

    const buttonEl = document.querySelectorAll("#keyboard button");
    buttonEl.forEach(button => {
        button.addEventListener("click", () => {
            const key = button.getAttribute("data-key");
            handleInput(key); // Handles on-screen KB button clicks
        });
    });
}

// Initializes reset button
function initializeResetButton() {
    resetButtonEl.addEventListener("click", initializeGame);
}

// Initializes game when DOM content is loaded
document.addEventListener("DOMContentLoaded", initializeGame);