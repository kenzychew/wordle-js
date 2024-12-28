class Wordle {
    constructor() {
        this.wordLength = 3;
        this.maxAttempts = 4;
        this.currentAttempt = 0;
        this.currentPosition = 0;
        this.gameOver = false;
        this.word = "ACE"; // sample word, planning to include a wordlist

        this.board = [];
        this.initializeBoard();
        this.initializeKeyboardListeners();
    }

    initializeBoard() {
        const boardEl = document.getElementById("board");

        for (let i = 0; i < this.maxAttempts; i++) {
            const rowEl  = document.createElement("div");
            rowEl.className = "board-row";
            const rowTiles = [];

            for (let j = 0; j < this.wordLength; j++) {
                const tileEl = document.createElement("div");
                tileEl.className = "tile";
                rowEl.appendChild(tileEl);
                rowTiles.push(tileEl);
            }

            boardEl.appendChild(rowEl);
            this.board.push(rowTiles);
        }
    }

    initializeKeyboardListeners() {
        document.addEventListener("keydown", (e) => this.handleKeyPress(e));

        const buttonEl = document.querySelectorAll("#keyboard button");
        buttonEl.forEach(button => {
            button.addEventListener("click", () => {
                const key = button.getAttribute("data-key");
                this.handleInput(key);
            });
        });
    }

    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.handleInput("ENTER");
        } else if (e.key === "Backspace") {
            this.handleInput("BACKSPACE");
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            this.handleInput(e.key.toUpperCase());
        }
    }

    handleInput(key) {
        if (this.gameOver) return;
        
        if (key === "ENTER") {
            this.checkWord();
        } else if (key === "BACKSPACE") {
            this.deleteLetter();
        } else if (/^[A-Z]$/.test(key) && this.currentPosition < this.wordLength) {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.currentPosition < this.wordLength) {
            this.board[this.currentAttempt][this.currentPosition].textContent = letter;
            this.currentPosition++;
        }
    }
    
    deleteLetter() {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            this.board[this.currentAttempt][this.currentPosition].textContent = "";
        }
    }

    // Check user's guess
    checkWord() {
        if (this.currentPosition !== this.wordLength) return; // ensures full word entered

        const guess = this.secretWord();
        if (guess.length !== this.wordLength) return; // ignores invalid attempts

        this.updateTileColors(guess); // update tiles based on guess

        // check if guess was correct
        if (guess === this.word) {
            this.showMessage("Congratulations, you won!");
            this.gameOver = true;
            return;
        }

        // check if game over
        if (this.currentAttempt === this.maxAttempts -1) {
            this.showMessage(`Better luck next time! The word was ${this.word}`);
            this.gameOver = true;
            return;
        }
        
        // if incorrect, moves to next attempt
        this.currentAttempt++;
        this.currentPosition = 0;
    }

    // get current guess word
    secretWord() {
        return this.board[this.currentAttempt]
            .map(tileEl => tileEl.textContent)
            .join("");
    }

    // Update tile colors based on guess
    updateTileColors(attempt) {
        const tiles = this.board[this.currentAttempt];
        const letterCount = {};

        // count letters in target word
        for (let letter of this.word) {
            letterCount[letter] = (letterCount[letter] || 0) +1;
        }

        // first pass: mark correct letters green
        for (let i = 0; i < this.wordLength; i++) {
            if (attempt[i] === this.word[i]) {
                tiles[i].className = "tile correct"; // Correct letter, correct position
                letterCount[attempt[i]]--; // Decrement letter count
            }
        }
        
        // second pass: mark present letters yellow and absent letters gray
        for (let i = 0; i < this.wordLength; i++) {
            if (attempt[i] === this.word[i]) continue; // skips already correct letters
            
            if (letterCount[attempt[i]] >0) {
                tiles[i].className = "tile present"; // present letter, wrong position
                letterCount[attempt[i]]--; // Decrement letter count
            } else {
                tiles[i].className = "tile absent"; // absent letter
            }
        }

    }

    showMessage(msg) {
        const displayMessage = document.getElementById("message");
        displayMessage.textContent = msg;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Wordle();
});