// import { ray } from 'node-ray';
// import { Move } from './Move';
// import { Player } from './Player';
// import { Game } from './Game';

/**
 * Can use BigInts? These have bitwise operations?
 */

/**
 * Encodes a move. Construct it with letters on the left and length, x, y, and flag on
 * the right as decoding will require this.
 *
 * @param {Boolean} acrossFlag
 * @param {Number} x
 * @param {Number} y
 * @param {String} word
 *
 */
// function encodeMove(acrossFlag, x, y, word: string, score) {
//     let moveAsBigInt = 0n;

//     // The word!
//     word.split('').map((char) => {
//         moveAsBigInt = moveAsBigInt << 5n;
//         // We use 1-based indexing so that we don't end up with a zero value at the end
//         // when decoding (this would look like the end of the string!)
//         moveAsBigInt = moveAsBigInt | BigInt(char.charCodeAt(0) - 64);
//     });

//     // The word length
//     moveAsBigInt = moveAsBigInt << 4n;
//     moveAsBigInt = moveAsBigInt | BigInt(word.length);

//     // x and y - 4 bits each
//     moveAsBigInt = moveAsBigInt << 4n;
//     moveAsBigInt = moveAsBigInt | BigInt(x);
//     moveAsBigInt = moveAsBigInt << 4n;
//     moveAsBigInt = moveAsBigInt | BigInt(y);

//     // The across flag
//     moveAsBigInt = moveAsBigInt << 1n;
//     if (acrossFlag) {
//         moveAsBigInt = moveAsBigInt | 1n;
//     }

//     return moveAsBigInt;
// }

/**
 * Decodes a move from a BigInt.
 */
// function decodeMove(moveAsInt: bigint) {
//     let acrossFlag, y, x, length;

//     let remainingBits = moveAsInt;

//     acrossFlag = remainingBits & BigInt(0b1);
//     remainingBits = remainingBits >> 1n;

//     y = remainingBits & BigInt(0b1111);
//     remainingBits = remainingBits >> 4n;
//     x = remainingBits & BigInt(0b1111);
//     remainingBits = remainingBits >> 4n;

//     length = remainingBits & BigInt(0b1111);
//     remainingBits = remainingBits >> 4n;

//     let wordBits = remainingBits;
//     let wordString = '';

//     while (wordBits > 0n) {
//         let currentLetterBits = wordBits & BigInt(0b11111);
//         let currentLetter = String.fromCharCode(Number(currentLetterBits) + 64);
//         wordString = currentLetter + wordString;
//         wordBits = wordBits >> 5n;
//     }

//     return {
//         acrossFlag: Boolean(acrossFlag),
//         x,
//         y,
//         word: wordString,
//     };
// }

// function bigIntToAscii(x: bigint) {
//     // ray('Converting to Ascii');
//     let ascii = '';
//     while (x > 0) {
//         let thisChar = x & BigInt(0b1111111);
//         ascii = ascii + String.fromCharCode(Number(thisChar));
//         x = x >> 7n;
//     }
//     return ascii;
// }

// function asciiToBigint(s: string) {
//     let x = BigInt(0n);
//     for (let i = s.length - 1; i >= 0; i--) {
//         // ray('Here', i);
//         let thisCode = s.charCodeAt(i);
//         x = x << 7n;
//         x = x | BigInt(thisCode);
//     }
//     return x;
// }

// let m = encodeMove(true, 9, 6, 'HELLO', 23);
// ('Encoded move ');
// m;
// let d = decodeMove(m);
// ('Decoded move ');
// d;

// let a = bigIntToAscii(m);
// ('ASCII');
// a;
// let b = asciiToBigint(a);
// ('Int - should be same as encoded');
// b;

// let d2 = decodeMove(b);
// d2;

// ('BASE64:');
// btoa(a);

// decodeMove(asciiToBigint(bigIntToAscii(encodeMove(true, 9, 6, 'HELLO', 23))));

const fullLetterBag = [
    'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
    'B', 'B',
    'C', 'C',
    'D', 'D', 'D', 'D',
    'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
    'F', 'F',
    'G', 'G', 'G',
    'H', 'H',
    'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I',
    'J',
    'K',
    'L', 'L', 'L', 'L',
    'M', 'M',
    'N', 'N', 'N', 'N', 'N', 'N',
    'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
    'P', 'P',
    'Q',
    'R', 'R', 'R', 'R', 'R', 'R',
    'S', 'S', 'S', 'S',
    'T', 'T', 'T', 'T', 'T', 'T',
    'U', 'U', 'U', 'U',
    'V', 'V',
    'W', 'W',
    'X', 'Y', 'Y', 'Z'
];

const letterValues = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10
}

document.addEventListener('alpine:init', () => {
    Alpine.data('scrabble', () => ({
        newAcrossFlag: false,
        newX: 0,
        newY: 0,
        newWord: '',
        game: null,
        player1: null,
        player2: null,
        base64code: '',
        p1Score: 0,
        p1Tiles: '',
        p2Score: 0,
        p2Tiles: '',
        board: [],

        // Actual game stuff
        letterBag: [...fullLetterBag],
        // TODO: This needs to be set at the start for display purposes. It should not update once move is played.
        currentPlayer: 1,
        isStartSquareSelected: false,
        selectedStartSquare: {
            x: 0,
            y: 0
        },
        enterDirection: 'across',
        enterOffset: 0, // Offset from the selected tile for entering new letters
        // playerTileSelected: false, // Normally an index into player1.tiles
        playedTiles: [], // The tiles that have been played in this move. Will be like { x: 0, y: 0, tileIndex: 'A'}

        init() {
            if (window.location.hash) {
                this.base64code = window.location.hash.substring(1);
                this.decodeBase64();
                this.removePlayerTilesFromLetterBag();
                //
            } else {
                this.emptyBoard();
                this.player1 = new Player([], 0)
                this.player2 = new Player([], 0)
                this.currentPlayer = 1;
                this.game = new Game(this.player1, this.player2, [])
            }
            // TODO: Randomness needs to be predictable. Maybe based on the hash?
            this.player1.topUpTiles(this.letterBag);
            this.player2.topUpTiles(this.letterBag);
        },

        emptyBoard() {
            this.board = Array(15).fill([]);
            let emptyRow = Array(15).fill('');
            // Need to clone in the empty rows
            for (let i = 0; i < 15; i++) {
                this.board[i] = [...emptyRow];
            }
        },

        removePlayerTilesFromLetterBag() {
            this.player1.tiles.forEach((tile) => {
                this.removeFromLetterBag(tile);
            });
            this.player2.tiles.forEach((tile) => {
                this.removeFromLetterBag(tile);
            });
        },

        addNewWord() {
            this.game.moves.push(
                new Move(
                    this.newAcrossFlag === '1' || this.newAcrossFlag === 'true',
                    this.newX,
                    this.newY,
                    this.newWord,
                )
            );
            this.newWord = '';
            this.newX = 0;
            this.newY = 0;
        },

        decodeBase64() {
            this.game = Game.decodeFromBigInt(CodedInt.fromBase64(this.base64code).getValue())
            this.player1 = this.game.player1
            this.player2 = this.game.player2
            this.p1Score = this.player1.score
            this.p1Tiles = this.player1.tiles.join('')
            this.p2Score = this.player2.score
            this.p2Tiles = this.player2.tiles.join('')
            console.log(this.game.moves)
            this.game.moves = [...this.game.moves] // Force reactivity
            this.replayMovesToBoard();
        },

        updateP1() {
            this.player1 = new Player(this.p1Tiles.split(''), this.p1Score)
            this.game.player1 = this.player1
        },

        updateP2() {
            this.player2 = new Player(this.p2Tiles.split(''), this.p2Score)
            this.game.player2 = this.player2
        },

        replayMovesToBoard() {
            this.emptyBoard();
            this.game.moves.forEach((move) => {
                let x = move.x
                let y = move.y
                let word = move.word
                let across = move.acrossFlag
                for (let i = 0; i < word.length; i++) {
                    if (across) {
                        if (this.board[y][x + i] === '') {
                            this.board[y][x + i] = word[i]
                            this.removeFromLetterBag(word[i])
                        }
                    } else {
                        if (this.board[y + i][x] === '') {
                            this.board[y + i][x] = word[i]
                            this.removeFromLetterBag(word[i])
                        }
                    }
                }
                this.toggleCurrentPlayer();
            })
        },

        removeFromLetterBag(letter) {
            let index = this.letterBag.indexOf(letter)
            if (index > -1) {
                this.letterBag.splice(index, 1)
            }
        },

        toggleCurrentPlayer() {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        },

        tileHasLetter(x, y) {
            return this.board[y][x] !== '';
        },

        tileClick(x, y) {
            // Set or toggle tile direction first
            if (!this.isStartSquareSelected) {
                this.enterDirection = 'across';
            } else if (x === this.selectedStartSquare.x && y === this.selectedStartSquare.y) {
                this.enterOffset = 0;
                this.enterDirection = this.enterDirection === 'across' ? 'down' : 'across';
            }

            this.isStartSquareSelected = true;
            this.clearPlayedTiles();
            this.selectedStartSquare = { 'x': x, 'y': y };

            this.updateEnterOffsetToSkipPlacedTiles(x, y);

        },

        updateEnterOffsetToSkipPlacedTiles(x, y) {
            // Move the offset if needed
            if (this.enterDirection === 'across') {
                while (this.tileHasLetter(x + this.enterOffset, y)) {
                    this.enterOffset++;
                }
            } else {
                while (this.tileHasLetter(x, y + this.enterOffset)) {
                    this.enterOffset++;
                }
            }
        },

        boardSquareIsCurrentEnterPoint(x, y) {
            if (!this.isStartSquareSelected) {
                return false;
            }

            if (this.enterDirection === 'across') {
                return y === this.selectedStartSquare.y && x === this.selectedStartSquare.x + this.enterOffset;
            }

            return x === this.selectedStartSquare.x && y === this.selectedStartSquare.y + this.enterOffset;
        },

        boardSquareIsInEnterLine(x, y) {
            if (!this.isStartSquareSelected) {
                return false;
            }
            if (this.enterDirection === 'across') {
                return y === this.selectedStartSquare.y && x >= this.selectedStartSquare.x;
            }
            if (this.enterDirection === 'down') {
                return x === this.selectedStartSquare.x && y >= this.selectedStartSquare.y;
            }
        },

        /**
         * If a board tile is selected and we are in "enter" mode then add to the board
         *
         * @param {number} tile Index to tile
         */
        selectPlayerTile(tile) {
            if (!this.isStartSquareSelected) {
                return
            }

            if (this.tileIsPlayed(tile)) {
                return;
            }

            if (this.enterDirection === 'across') {
                this.board[this.selectedStartSquare.y][this.selectedStartSquare.x + this.enterOffset] = this.game.getCurrentPlayer().tiles[tile];
                this.playedTiles = [...this.playedTiles, { x: this.selectedStartSquare.x + this.enterOffset, y: this.selectedStartSquare.y, tileIndex: tile }];
                // Increment the offset until we're at the next empty space
                while (this.board[this.selectedStartSquare.y][this.selectedStartSquare.x + this.enterOffset] !== '') {
                    this.enterOffset++;
                }

            }

            if (this.enterDirection === 'down') {
                this.board[this.selectedStartSquare.y + this.enterOffset][this.selectedStartSquare.x] = this.game.getCurrentPlayer().tiles[tile];
                this.playedTiles = [...this.playedTiles, { x: this.selectedStartSquare.x, y: this.selectedStartSquare.y + this.enterOffset, tileIndex: tile }];
                // Increment the offset until we're at the next empty space
                while (this.board[this.selectedStartSquare.y + this.enterOffset][this.selectedStartSquare.x] !== '') {
                    this.enterOffset++;
                }
            }
        },

        /**
         * Returns the indexes into the player1 tiles of the tiles that have been played
         * on the board in this move.
         *
         * @returns {number[]} Indexes of tiles played
         */
        getPlayedTileIndexes() {
            return this.playedTiles.map((tile) => tile.tileIndex);
        },

        /**
         * Returns true if the tile at the specified index in the player's rack has been played
         * in this move.
         *
         * @param {number} tileIndex Index of the tile in the player's rack
         * @returns {boolean} True if the tile has been played
         */
        tileIsPlayed(tileIndex) {
            return this.getPlayedTileIndexes().includes(tileIndex);
        },

        /**
         * Returns true if the specified square on the board has a tile from the current move
         * played on it.
         *
         * @param {number} x x-coordinate of board square to check
         * @param {number} y y-coordinate of board square to check
         * @returns {boolean} True if the square has a played tile on it
         */
        boardSquareIsPlayedTile(x, y) {
            return this.playedTiles.some((tile) => tile.x === x && tile.y === y);
        },

        clearPlayedTiles() {
            this.playedTiles.map((tile) => {
                this.board[tile.y][tile.x] = '';
            })
            this.playedTiles = [];
            this.enterOffset = 0;
        },

        clearMove() {
            this.clearPlayedTiles();
            this.isStartSquareSelected = false;
        },

        submitMove() {
            let x = this.selectedStartSquare.x;
            let y = this.selectedStartSquare.y;
            let across = this.enterDirection === 'across';
            let wordPlayed = '';

            for (let i = 0; i < this.enterOffset; i++) {
                if (across) {
                    wordPlayed += this.board[y][x + i];
                } else {
                    wordPlayed += this.board[y + i][x];
                }
            }

            // TODO: Score the word
            this.game.moves.push(new Move(across, x, y, wordPlayed));
            this.isStartSquareSelected = false;
            const player = this.game.getCurrentPlayer();
            player.tiles = player.tiles.filter((tile, index) => !this.getPlayedTileIndexes().includes(index));
        }
    }))
})
