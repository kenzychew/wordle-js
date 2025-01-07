# Browser-Based Wordle Game

A web-based implementation of the popular word-guessing game Wordle, built using vanilla JavaScript, HTML, and CSS.

## Description

This project is a clone of the popular word game Wordle, where players attempt to guess a five-letter word within six attempts. After each guess, the game provides feedback using color-coded tiles:

- 🟩 Green: Letter is correct and in the right position
- 🟨 Yellow: Letter is in the word but in the wrong position
- ⬜ Gray: Letter is not in the word

## Features

- Responsive design that works on both desktop and mobile devices
- Virtual keyboard with color feedback
- Support for physical keyboard input
- Valid word checking against a comprehensive word list
- Visual feedback for correct/incorrect letters
- Game state tracking (attempts remaining, game over conditions)
- Reset functionality to start a new game

## Installation

1. Clone the repository:

   ```bash
   git clone [your-repository-url]
   ```

2. Navigate to the project directory:

   ```bash
   cd wordle-game
   ```

3. Open `index.html` in your preferred web browser.

## How to Play

1. Start typing or use the on-screen keyboard to enter your guess
2. Press 'Enter' to submit your guess
3. The tiles will change color to provide feedback:
   - Green: Correct letter in correct position
   - Yellow: Correct letter in wrong position
   - Gray: Letter not in the word
4. Use the feedback to inform your next guess
5. Try to guess the word in six attempts or fewer
6. Click the 'Reset Game' button to start a new game at any time

## Technical Details

### Project Structure

```
wordle-game/
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

### Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

### Key Components

- `Wordle` class: Main game logic
- Board initialization and management
- Keyboard input handling (virtual and physical)
- Word validation and checking
- Color feedback system
- Game state management

## Development

The game is built using vanilla JavaScript without any external dependencies, making it easy to modify and extend. The code is organized into a single `Wordle` class that handles all game logic and UI interactions.

### Key Methods

- `initializeBoard()`: Sets up the game board
- `handleInput()`: Processes user input
- `checkWord()`: Validates guesses and updates the game state
- `updateTileColors()`: Provides visual feedback for guesses
- `resetGame()`: Resets the game state for a new round

## Future Improvements

- Add statistics tracking
- Implement local storage for game state persistence
- Add animations for tile flips and reveals
- Include a dark mode theme
- Add sharing functionality
- Implement a daily word feature

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original Wordle game by Josh Wardle https://www.powerlanguage.co.uk/
- Word list sourced from https://web.archive.org/web/20220210034340id_/https://www.powerlanguage.co.uk/wordle/main.e65ce0a5.js
- Color scheme inspired by the original Wordle game sourced from https://www.color-hex.com/color-palette/1012607 */
