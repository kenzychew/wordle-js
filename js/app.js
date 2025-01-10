import { WORD_LIST, GUESS_LIST } from "./words.js";

class Wordle {
    constructor() {
        this.wordLength = 5; // Length of word to guess
        this.maxAttempts = 6; // Maximum number of attempts
        this.currentAttempt = 0; // Track how many guesses the player has made
        this.currentPosition = 0; // Tracks current position (index) in the current word guess
        this.gameOver = false; // Indicates if game is over
        this.wordList = WORD_LIST;
        this.guessList = GUESS_LIST;
        this.word = this.getRandomWord(); // The actual target word selected randomly from wordList
        this.usedLetters = new Set(); // Keeps track of letters that have already been used (for keyboard feedback)
        this.board = []; // represents the gameboard (with 2D array to hold tiles)
        this.initializeBoard(); // set up game board UI and add event listeners
        this.initializeKeyboardListeners(); // adds event listeners for physical keyboard and on-screen buttons
        this.initializeResetButton(); 
    }
    // Initializes game board with 6 rows for 6 guesses
    initializeBoard() {
        const boardEl = document.getElementById("board");

        for (let i = 0; i < this.maxAttempts; i++) {
            const rowEl  = document.createElement("div");
            rowEl.className = "board-row";
            const rowTiles = [];
            // create 5 tiles
            for (let j = 0; j < this.wordLength; j++) {
                const tileEl = document.createElement("div");
                tileEl.className = "tile"; // default tile class
                rowEl.appendChild(tileEl);
                rowTiles.push(tileEl);
            }

            boardEl.appendChild(rowEl); // add row to board
            this.board.push(rowTiles); // add row to board array
        }
    }
    // sets up event listeners for keyboard input (physical and on-screen buttons)
    initializeKeyboardListeners() { // listen for key presses on keyboard
        document.addEventListener("keydown", (e) => this.handleKeyPress(e));

        const buttonEl = document.querySelectorAll("#keyboard button");
        buttonEl.forEach(button => {
            button.addEventListener("click", () => {
                const key = button.getAttribute("data-key");
                this.handleInput(key); // handle button clicks
            });
        });
    }
    // initializes reset button
    initializeResetButton() {
        const resetButton = document.getElementById("reset-button");
        resetButton.addEventListener("click", () => this.resetGame());
    }
    // Handles physical key presses (Enter, Backspace and alphabetic keys)
    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.handleInput("ENTER");
        } else if (e.key === "Backspace") {
            this.handleInput("BACKSPACE");
        } else if (/^[a-zA-Z]$/.test(e.key)) { // only handles alphabetic keys 
            this.handleInput(e.key.toUpperCase()); // convert to uppercase and handle
        }
    }
    // Handles user input (whether from physical keyboard or on-screen buttons)
    handleInput(key) {
        if (this.gameOver) return; // ignore input if game over
        
        if (key === "ENTER") {
            const guess = this.getCurrentGuess();
            // Checks if guess is valid
            if (!this.isValidGuess(guess)) {
                this.showMessage("Invalid word, please try again!");
                return; // prevents invalid guesses from being processed
            }
            this.checkWord(); // process valid guess
        } else if (key === "BACKSPACE") {
            this.deleteLetter();
        } else if (/^[A-Z]$/.test(key) && this.currentPosition < this.wordLength) {
                this.addLetter(key); // add a letter to the current guess
        }
    }
    // Validates whether the guessed word is in the word list
    isValidGuess(guess) {
        return this.wordList.includes(guess) || this.guessList.includes(guess);
    }

    // Adds a letter to the current guess (on the board)
    addLetter(letter) {
        if (this.currentPosition < this.wordLength) {
            this.board[this.currentAttempt][this.currentPosition].textContent = letter;
            this.currentPosition++; // move to next position
        }
    }
    // Deletes the last entered letter
    deleteLetter() {
        if (this.currentPosition > 0) {
            this.currentPosition--; // move to previous position
            this.board[this.currentAttempt][this.currentPosition].textContent = "";
        }
    }

    // Check user's guess
    checkWord() {
        if (this.currentPosition !== this.wordLength) return; // ensures full word entered

        const guess = this.getCurrentGuess();
        if (guess.length !== this.wordLength) return; // prevent invalid guesses

        this.updateTileColors(guess); // update tile colors based on guess

        // check if guess was correct
        if (guess === this.word) {
            this.showMessage(`Congratulations, you won! The word was ${this.word}`);
            this.gameOver = true;
            return;
        }

        // if guess is incorrect but valid, continue game
        this.showMessage(`Close but no banana, lets try again!`);

        // if max attempts reached, show answer and end game
        if (this.currentAttempt === this.maxAttempts -1) {
            this.showMessage(`Better luck next time! The word was ${this.word}`);
            this.gameOver = true;
            return;
        }
        
        // if guess was incorrect, move on to next attempt
        this.currentAttempt++;
        this.currentPosition = 0;
    }

    // get current guess word
    getCurrentGuess() {
        return this.board[this.currentAttempt] // -> [<div>H</div>, <div>E</div>, <div>L</div>, <div>L</div>, <div>O</div>]
            .map(tileEl => tileEl.textContent) // -> ["H", "E", "L", "L", "O"]
            .join(""); // -> "HELLO"
    }

    // Update tile colors based on guess
    updateTileColors(guess) {
        const tiles = this.board[this.currentAttempt];
        const letterCount = {}; 

        // count letters in target word
        for (let letter of this.word) {
            letterCount[letter] = (letterCount[letter] || 0) +1;
        }

        // first pass: mark correct letters green
        for (let i = 0; i < this.wordLength; i++) {
            if (guess[i] === this.word[i]) {
                tiles[i].className = "tile correct"; // Correct letter, correct position
                letterCount[guess[i]]--; // decrement letter count
            }
        }
        
        // second pass: mark present letters yellow and absent letters gray
        for (let i = 0; i < this.wordLength; i++) {
            if (guess[i] === this.word[i]) continue; // skips already correct letters
            
            if (letterCount[guess[i]] >0) {
                tiles[i].className = "tile present"; // present letter, wrong position
                letterCount[guess[i]]--; // decrement letter count
            } else {
                tiles[i].className = "tile absent"; // absent letter
            }
        }
        this.updateKeyboardColors(guess);
    }
    // Update on-screen keyboard button colors based on guessed letters
    updateKeyboardColors(guess) {
        for (let i = 0; i < this.wordLength; i++) {
            const letter = guess[i];
            const button = document.querySelector(`button[data-key="${letter}"]`);
            if (!button) continue; // skip if no button exists for the letter

            if (guess[i] === this.word[i]) {
                button.style.backgroundColor = '#6ca965';
                button.style.color = 'white';
            } else if (this.word.includes(letter)) {
                button.style.backgroundColor = '#c8b653';
                button.style.color = 'white';
            } else {
                button.style.backgroundColor = '#787c7f';
                button.style.color = 'white';
                this.usedLetters.add(letter); // track used letters
            }
        }
    }
    // Displays a message to the player (win, lose, feedback)
    showMessage(msg) {
        const displayMessage = document.getElementById("message");
        displayMessage.textContent = msg;
    }
    // Randomly picks a word from the word list
    getRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.wordList.length);
        return this.wordList[randomIndex];
    }
    
    // Resets game state
    resetGame() {
        this.currentAttempt = 0; // reset attempts
        this.currentPosition = 0; // reset position on board
        this.gameOver = false; // reset game over flag
        this.word = this.getRandomWord();
        this.usedLetters.clear();
        this.board.forEach(row => {
            row.forEach(tile => {
                tile.textContent = ""; // clear tile content
                tile.className = "tile"; // reset tile class
            });
        });
        this.showMessage(""); // clears any messages
        this.resetKeyboardColors(); // resets keyboard colors
    }
    // Reset keyboard button colors to default
    resetKeyboardColors() {
        const buttons = document.querySelectorAll("#keyboard button");
        buttons.forEach(button => {
            button.style.backgroundColor = "";
            button.style.color = "";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Wordle();
});



