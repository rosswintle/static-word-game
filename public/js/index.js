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

/**
 * This is a random number generator generator (!!) that is seeded with a number.
 *
 * From: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 *
 * @param {number} seed - the seed to use for the random number generator
 * @return {() => number} - a seeded random number generator function
 */
function mulberry32(seed) {
    return function () {
        var t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const seed = Math.floor(Math.random() * 10_000_000_000)
const getRandom = mulberry32(seed)

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(getRandom() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

document.addEventListener('alpine:init', () => {
    Alpine.data('scrabble', () => ({
        game: null,
        board: [],

        // Actual game stuff
        letterBag: [...fullLetterBag],
        // This needs to be set at the start for display purposes. It should not update once move is played.
        thisMovePlayerId: 1,
        thisMovePlayer: null,
        isStartSquareSelected: false,
        selectedStartSquare: {
            x: 0,
            y: 0
        },
        enterDirection: 'across',
        enterOffset: 0, // Offset from the selected tile for entering new letters
        // playerTileSelected: false, // Normally an index into player1.tiles
        playedTiles: [], // The tiles that have been played in this move. Will be like { x: 0, y: 0, tileIndex: 'A'}
        moveIsPlayed: false,
        copyButtonText: 'Copy link to clipboard',

        init() {
            window.addEventListener('hashchange', () => {
                window.location.reload();
            })

            if (window.location.hash) {
                this.decodeBase64(window.location.hash.substring(1));
                this.removePlayerTilesFromLetterBag();
                this.thisMovePlayerId = this.game.getCurrentPlayerId();
                this.thisMovePlayer = this.game.getCurrentPlayer();
                //
            } else {
                this.emptyBoard();
                const player1 = new Player([], 0)
                const player2 = new Player([], 0)
                this.game = new Game(player1, player2, [])
                this.thisMovePlayerId = 1;
                this.thisMovePlayer = this.game.player1
            }
            // TODO: Randomness needs to be predictable. Maybe based on the hash?
            shuffleArray(this.letterBag);
            this.game.player1.topUpTiles(this.letterBag);
            this.game.player2.topUpTiles(this.letterBag);
        },

        otherPlayerScore() {
            if (this.thisMovePlayerId === 1) {
                return this.game.player2.score;
            }
            return this.game.player1.score;
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
            this.game.player1.tiles.forEach((tile) => {
                this.removeFromLetterBag(tile);
            });
            this.game.player2.tiles.forEach((tile) => {
                this.removeFromLetterBag(tile);
            });
        },

        decodeBase64(base64code) {
            this.game = Game.decodeFromBigInt(CodedInt.fromBase64(base64code).getValue())
            this.game.moves = [...this.game.moves] // Force reactivity
            this.replayMovesToBoard();
        },

        replayMovesToBoard() {
            this.emptyBoard();
            this.game.moves.forEach((move) => {
                this.playMoveToBoard(move);
                // Remove the played tiles from the letter bag
                // TODO: This will remove already played tiles from the bag. This is not ideal.
                // Maybe tell playMoveToBoard to remove tiles from the bag when played?
                move.word.split('').forEach((letter) => {
                    this.removeFromLetterBag(letter);
                })
            })
        },

        /**
         * Plays a move to the board. This will update the board and return the score for the move.
         *
         * Does NOT affect the tile bag or the player's rack.
         *
         * @param {Move} move The move to play
         * @returns {number} The score for the move
         */
        playMoveToBoard(move) {
            let score = 0;

            let x = move.x
            let y = move.y
            let word = move.word
            let across = move.acrossFlag

            for (let i = 0; i < word.length; i++) {
                if (across) {
                    // Only score perpendicular words if we're playing the tile
                    scorePerpendicularWords = this.boardSquareIsPlayedTile(x + i, y)
                    score += this.playLetterToBoard(x + i, y, word[i], across, scorePerpendicularWords);
                } else {
                    // Only score perpendicular words if we're playing the tile
                    scorePerpendicularWords = this.boardSquareIsPlayedTile(x, y + i)
                    score += this.playLetterToBoard(x, y + i, word[i], across, scorePerpendicularWords);
                }
            }

            return score;
        },

        /**
         * Plays the letter to the board at the specified coordinates. Returns the score for playing the
         * letter, including any perpendicular words formed.
         *
         * @param {number} x The x coordinate
         * @param {number} y The y coordinate
         * @param {string} letter The letter to play
         * @param {boolean} across True if the word is across
         * @param {boolean} scorePerpendicularWords True if perpendicular words should be scored
         * @return {number} Score for playing the letter, including any perpendicular words
         */
        playLetterToBoard(x, y, letter, across, scorePerpendicularWords) {
            let score = letterValues[letter];

            this.board[y][x] = letter;

            if (scorePerpendicularWords) {
                if (across) {
                    score += this.maybeScoreVerticalWord(x, y);
                } else {
                    score += this.maybeScoreHorizontalWord(x, y);
                }
            }

            return score;
        },

        /**
         * Scores a word played vertically around the specified coordinates. Returns the score for the word.
         *
         * @param {number} x The x coordinate
         * @param {number} y The y coordinate
         * @return {number} Score for the word played
         */
        maybeScoreVerticalWord(x, y) {
            let score = 0;

            // Find the start of the word
            let start = y;
            while (start > 0 && this.board[start - 1][x] !== '') {
                start--;
            }

            // Find the end of the word
            let end = y;
            while (end < 14 && this.board[end + 1][x] !== '') {
                end++;
            }

            // Only score the word if it's more than one letter long
            if (start !== end) {
                for (let i = start; i <= end; i++) {
                    score += letterValues[this.board[i][x]];
                }
            }

            return score;
        },

        /**
         * Scores a word played horizontally around the specified coordinates. Returns the score for the word.
         *
         * @param {number} x The x coordinate
         * @param {number} y The y coordinate
         * @return {number} Score for the word played
         */
        maybeScoreHorizontalWord(x, y) {
            let score = 0;

            // Find the start of the word
            let start = x;
            while (start > 0 && this.board[y][start - 1] !== '') {
                start--;
            }

            // Find the end of the word
            let end = x;
            while (end < 14 && this.board[y][end + 1] !== '') {
                end++;
            }

            // Only score the word if it's more than one letter long
            if (start !== end) {
                for (let i = start; i <= end; i++) {
                    score += letterValues[this.board[y][i]];
                }
            }

            return score;
        },


        removeFromLetterBag(letter) {
            let index = this.letterBag.indexOf(letter)
            if (index > -1) {
                this.letterBag.splice(index, 1)
            }
        },

        tileHasLetter(x, y) {
            return this.board[y][x] !== '';
        },

        tileClick(x, y) {
            if (this.moveIsPlayed) {
                return;
            }

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

        boardSquareIsCenterSquare(x, y) {
            return x === 7 && y === 7;
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
            if (!this.isStartSquareSelected || this.moveIsPlayed) {
                return
            }

            if (this.tileIsPlayed(tile) || this.enterOffsetIsOffBoard()) {
                return;
            }

            if (this.enterDirection === 'across') {
                this.board[this.selectedStartSquare.y][this.selectedStartSquare.x + this.enterOffset] = this.game.getCurrentPlayer().tiles[tile];
                this.playedTiles = [...this.playedTiles, { x: this.selectedStartSquare.x + this.enterOffset, y: this.selectedStartSquare.y, tileIndex: tile }];
                // Increment the offset until we're at the next empty space
                while (
                    this.selectedStartSquare.x + this.enterOffset < 15 &&
                    this.board[this.selectedStartSquare.y][this.selectedStartSquare.x + this.enterOffset] !== ''
                ) {
                    this.enterOffset++;
                }

            }

            if (this.enterDirection === 'down') {
                this.board[this.selectedStartSquare.y + this.enterOffset][this.selectedStartSquare.x] = this.game.getCurrentPlayer().tiles[tile];
                this.playedTiles = [...this.playedTiles, { x: this.selectedStartSquare.x, y: this.selectedStartSquare.y + this.enterOffset, tileIndex: tile }];
                // Increment the offset until we're at the next empty space
                while (
                    this.selectedStartSquare.y + this.enterOffset < 15 &&
                    this.board[this.selectedStartSquare.y + this.enterOffset][this.selectedStartSquare.x] !== ''
                ) {
                    this.enterOffset++;
                }
            }
        },

        enterOffsetIsOffBoard() {
            if (this.enterDirection === 'across') {
                return this.selectedStartSquare.x + this.enterOffset >= 15;
            }
            return this.selectedStartSquare.y + this.enterOffset >= 15;
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

        /**
         * Returns the word played across with the current move. It will include any
         * adjacent tiles that the word was played against. It will also adjust the
         * start square to the start of the word if it was played against existing tiles.
         *
         * @returns {Move} A move object representing the played move
         */
        getWordPlayedAcross() {
            let x = this.selectedStartSquare.x;
            const y = this.selectedStartSquare.y;

            // Find the start of the word
            let start = x;
            while (start > 0 && this.board[y][start - 1] !== '') {
                start--;
            }

            // Find the end of the word
            let end = x;
            while (end < 14 && this.board[y][end + 1] !== '') {
                end++;
            }

            let wordPlayed = '';
            for (let i = start; i <= end; i++) {
                wordPlayed += this.board[y][i];
            }

            // Construct a move object
            return new Move(
                true,
                start,
                y,
                wordPlayed
            );
        },

        /**
         * Returns the word played down with the current move. It will include any
         * adjacent tiles that the word was played against. It will also adjust the
         * start square to the start of the word if it was played against existing tiles.
         *
         * @returns {Move} A move object representing the played move
         */
        getWordPlayedDown() {
            const x = this.selectedStartSquare.x;
            let y = this.selectedStartSquare.y;

            // Find the start of the word
            let start = y;
            while (start > 0 && this.board[start - 1][x] !== '') {
                start--;
            }

            // Find the end of the word
            let end = y;
            while (end < 14 && this.board[end + 1][x] !== '') {
                end++;
            }

            let wordPlayed = '';
            for (let i = start; i <= end; i++) {
                wordPlayed += this.board[i][x];
            }

            // Construct a move object
            return new Move(
                false,
                x,
                start,
                wordPlayed
            );
        },

        /**
         * This returns the word played with the currrent move. It will include any
         * adjacent tiles that the word was played against. It will also adjust the
         * start square to the start of the word if it was played against existing tiles.
         *
         * @returns {string} The word played with the current move
         */
        getWordPlayedAsMove() {
            if (this.enterDirection === 'across') {
                return this.getWordPlayedAcross();
            } else {
                return this.getWordPlayedDown();
            }
        },

        submitMove() {
            if (this.moveIsPlayed) {
                return;
            }

            // Use the start and the current enter offset to figure out the played word
            let x = this.selectedStartSquare.x;
            let y = this.selectedStartSquare.y;
            let across = this.enterDirection === 'across';

            // This will figure out the full word played and adjust the start square to the start of the word
            // if it was played against existing tiles
            const thisMove = this.getWordPlayedAsMove();

            // This will "replay" the move to the board, but re-uses that functionality to score the move
            const score = this.playMoveToBoard(thisMove);

            // Add the score to the player's total
            const player = this.game.getCurrentPlayer();
            player.score += score;

            // Remove the played tiles from the player's rack
            let playedTileIndexes = this.getPlayedTileIndexes();
            player.tiles = player.tiles.filter((tile, index) => !playedTileIndexes.includes(index));
            this.game.getCurrentPlayer().topUpTiles(this.letterBag);
            this.playedTiles = [];

            this.game.moves.push(thisMove);
            this.isStartSquareSelected = false;
            this.moveIsPlayed = true;
        },

        getGameUrl() {
            return window.location.origin + '/#' + this.game.encodeAsBigint().toBase64();
        },

        copyGameUrl() {
            this.$clipboard(this.getGameUrl());
            this.copyButtonText = 'Copied!';
            setTimeout(() => {
                this.copyButtonText = 'Copy link to clipboard';
            }, 3000);
        },

        browserHasShareApi() {
            return navigator.share !== undefined;
        },

        async shareGameUrl() {
            await navigator.share({ url: this.getGameUrl(), text: 'Your turn!' })
        }
    }))
})
