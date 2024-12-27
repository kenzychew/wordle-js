class Wordle {
    constructor() {
        this.wordLength = 3;
        this.maxAttempts = 4;
        this.row = 0;
        this.col = 0;
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
        } else if (/^[A-Z]$/.test(key) && this.col < this.wordLength) {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.col < this.wordLength) {
            this.board[this.row][this.col].textContent = letter;
            this.col++;
        }
    }
    
    deleteLetter() {
        if (this.col > 0) {
            this.col--;
            this.board[this.row][this.col].textContent = "";
        }
    }

    checkWord() {
        console.log("Todo: Enter");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Wordle();
});