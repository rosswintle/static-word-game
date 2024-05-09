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

const bonusSquares = [
    ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW',],
    ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', '',],
    ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', '',],
    ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL',],
    ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', '',],
    ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', '',],
    ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', '',],
    ['TW', '', '', 'DL', '', '', '', 'DW', '', '', '', 'DL', '', '', 'TW',],
    ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', '',],
    ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', '',],
    ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', '',],
    ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL',],
    ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', '',],
    ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', '',],
    ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW',],
]

/**
 * This generates a 32-bit hash of a string. It's used to seed the random number generator.
 *
 * A 32-bit number can be up to 4,294,967,296 so we can use this to seed the random number.
 * (Originally the random number generator was seeded with a random number between 0 and 10,000,000,000)
 *
 * This is from: https://stackoverflow.com/a/22429679
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false */
    var i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
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

// Start with a random seed. If we have a game hash, use the hash of the game hash instead!
let seed = Math.floor(Math.random() * 10_000_000_000)
const gameHash = document.location.hash.substring(1)

if (gameHash.length > 0) {
    seed = hashFnv32a(gameHash)
}

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
        playedTiles: [], // The tiles that have been played in this move. Will be like { x: 0, y: 0, tileIndex: 'A'}
        moveIsPlayed: false,
        copyButtonText: 'Copy link to clipboard',
        swapModalOpen: false,
        swapTiles: [],

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
                if (move.word === '') {
                    move.score = 0;
                    return;
                }

                let score = this.playMoveToBoard(move, removeTilesFromBag = true);
                // Update the score for the move
                move.score = score;
            })
        },

        /**
         * Plays a move to the board. This will update the board and return the score for the move.
         *
         * If we are replaying moves, we also want to remove the tiles from the tile bag when new tiles
         * are played.
         *
         * We do this here rather than higher up because it's here that we check if the tile is played by
         * this move, or if it's an existing/adjoining tile.
         *
         * @param {Move} move The move to play
         * @param {boolean} [removeTilesFromBag=false] If true, the tiles will be removed from the letter bag
         * @returns {number} The score for the move
         */
        playMoveToBoard(move, removeTilesFromBag = false) {
            // This will be the total score for the move including any perpendicular words and bonuses
            let score = 0;
            // This will be just the score for the tiles played - no word bonuses (these are calculated at the end),
            // only letter bonuses.
            let thisWordScore = 0;

            let wordBonusMultiplier = 1;

            let x = move.x
            let y = move.y
            let word = move.word
            let across = move.acrossFlag
            for (let i = 0; i < word.length; i++) {
                console.log('Playing ' + word[i] + ' worth ' + letterValues[word[i]] + ' at ' + (x + i) + ', ' + y)
                let thisTilePoints = letterValues[word[i]];
                let otherWordScore = 0;
                letterBonusMultiplier = 1;

                if (across) {
                    // Only score perpendicular words if we're playing the tile
                    tilePlayedThisMove = this.board[y][x + i] === '' || this.boardSquareIsPlayedTile(x + i, y)

                    if (tilePlayedThisMove) {
                        this.board[y][x + i] = word[i];
                        otherWordScore = this.maybeScoreVerticalWord(x + i, y);
                    }

                    if (bonusSquares[y][x + i] === 'TW' && tilePlayedThisMove) {
                        console.log('TW detected for word ' + word + ' at ' + (x + i) + ', ' + y)
                        wordBonusMultiplier *= 3;
                        // Add triple the score of the perpendicular word
                        if (otherWordScore > 0) {
                            score += otherWordScore * 3;
                        }
                        // Add the tile points to the word score
                        thisWordScore += thisTilePoints;
                    }
                    if (bonusSquares[y][x + i] === 'DW' && tilePlayedThisMove) {
                        console.log('DW detected for word ' + word + ' at ' + (x + i) + ', ' + y)
                        wordBonusMultiplier *= 2;
                        // Add double the score of the perpendicular word
                        if (otherWordScore > 0) {
                            score += otherWordScore * 2;
                        }
                        // Add the tile points to the word score
                        thisWordScore += thisTilePoints;
                    }
                    if (bonusSquares[y][x + i] === 'TL' && tilePlayedThisMove) {
                        console.log('TL detected for word ' + word + ' at ' + (x + i) + ', ' + y)
                        // Add the score of the perpendicular word plus bonus points for the
                        // perpendicular word. This is only adding * 2 because the tile in the
                        // perpendicular word has already been added to the score once.
                        if (otherWordScore > 0) {
                            score += otherWordScore + (thisTilePoints * 2);
                        }
                        thisWordScore += thisTilePoints * 3;
                    }
                    if (bonusSquares[y][x + i] === 'DL' && tilePlayedThisMove) {
                        console.log('DL detected for word ' + word + ' at ' + (x + i) + ', ' + y)
                        // Add the score of the perpendicular word plus bonus points for the
                        // perpendicular word. This is only adding * 1 because the tile in the
                        // perpendicular word has already been added to the score once.
                        if (otherWordScore > 0) {
                            score += otherWordScore + thisTilePoints;
                        }
                        thisWordScore += thisTilePoints * 2;
                    }

                    // NO BONUSES!
                    if (bonusSquares[y][x + i] === '') {
                        thisWordScore += thisTilePoints;

                        if (tilePlayedThisMove) {
                            score += otherWordScore;
                        }
                    }
                } else {
                    // Only score perpendicular words if we're playing the tile
                    tilePlayedThisMove = this.board[y + i][x] === '' || this.boardSquareIsPlayedTile(x, y + i)

                    if (tilePlayedThisMove) {
                        this.board[y + i][x] = word[i];
                        otherWordScore = this.maybeScoreHorizontalWord(x, y + i);
                    }

                    if (bonusSquares[y + i][x] === 'TW' && tilePlayedThisMove) {
                        wordBonusMultiplier *= 3;
                        // Add triple the score of the perpendicular word
                        if (otherWordScore > 0) {
                            score += otherWordScore * 3;
                        }
                        // Add the tile points to the word score
                        thisWordScore += thisTilePoints;
                    }
                    if (bonusSquares[y + i][x] === 'DW' && tilePlayedThisMove) {
                        wordBonusMultiplier *= 2;
                        // Add double the score of the perpendicular word
                        if (otherWordScore > 0) {
                            score += otherWordScore * 2;
                        }
                        // Add the tile points to the word score
                        thisWordScore += thisTilePoints;
                    }
                    if (bonusSquares[y + i][x] === 'TL' && tilePlayedThisMove) {
                        // Add the score of the perpendicular word plus bonus points for the
                        // perpendicular word. This is only adding * 2 because the tile in the
                        // perpendicular word has already been added to the score once.
                        if (otherWordScore > 0) {
                            score += otherWordScore + (thisTilePoints * 2);
                        }
                        thisWordScore += thisTilePoints * 3;
                    }
                    if (bonusSquares[y + i][x] === 'DL' && tilePlayedThisMove) {
                        // Add the score of the perpendicular word plus bonus points for the
                        // perpendicular word. This is only adding * 1 because the tile in the
                        // perpendicular word has already been added to the score once.
                        if (otherWordScore > 0) {
                            score += otherWordScore + thisTilePoints;
                        }
                        thisWordScore += thisTilePoints * 2;
                    }

                    // NO BONUSES!
                    if (bonusSquares[y + i][x] === '') {
                        thisWordScore += thisTilePoints;

                        if (tilePlayedThisMove) {
                            score += otherWordScore;
                        }
                    }

                }


                if (tilePlayedThisMove && removeTilesFromBag) {
                    this.removeFromLetterBag(word[i]);
                }

            }

            console.log('Word score: ' + thisWordScore + ', word bonus: ' + wordBonusMultiplier + ', total: ' + thisWordScore * wordBonusMultiplier)
            score += (thisWordScore * wordBonusMultiplier);

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
                    if (this.enterOffsetIsOffBoard()) {
                        return;
                    }
                }
            } else {
                while (this.tileHasLetter(x, y + this.enterOffset)) {
                    this.enterOffset++;
                    if (this.enterOffsetIsOffBoard()) {
                        return;
                    }
                }
            }
        },

        boardSquareIsCenterSquare(x, y) {
            return x === 7 && y === 7;
        },

        boardSquareIsTripleWord(x, y) {
            return (bonusSquares[y][x] === 'TW');
        },

        boardSquareIsDoubleWord(x, y) {
            return (bonusSquares[y][x] === 'DW');
        },

        boardSquareIsTripleLetter(x, y) {
            return (bonusSquares[y][x] === 'TL');
        },

        boardSquareIsDoubleLetter(x, y) {
            return (bonusSquares[y][x] === 'DL');
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

        boardSquareIsLastMoveTile(x, y) {
            if (this.game.moves.length === 0) {
                return false;
            }

            const lastMove = this.game.moves.at(-1);

            if (lastMove.acrossFlag) {
                return y === lastMove.y && x >= lastMove.x && x < lastMove.x + lastMove.word.length;
            } else {
                return x === lastMove.x && y >= lastMove.y && y < lastMove.y + lastMove.word.length;
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
         * Returns true if tiles have been played and they constitute a valid move. This says we are
         * ready for the move to be submitted.
         */
        playedTilesAreValidMove() {
            return (this.playedTiles.length > 0) && (this.getWordPlayedAsMove().word.length >= 2)
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
         * @returns {Move} The word played with the current move
         */
        getWordPlayedAsMove() {
            if (this.enterDirection === 'across') {
                return this.getWordPlayedAcross();
            } else {
                return this.getWordPlayedDown();
            }
        },

        submitMove() {
            if (this.moveIsPlayed || !this.playedTilesAreValidMove()) {
                return;
            }

            // Use the start and the current enter offset to figure out the played word
            let x = this.selectedStartSquare.x;
            let y = this.selectedStartSquare.y;
            let across = this.enterDirection === 'across';

            // This will figure out the full word played and adjust the start square to the start of the word
            // if it was played against existing tiles
            const thisMove = this.getWordPlayedAsMove();

            // Words must be 2 letters or more
            if (thisMove.word.length < 2) {
                return;
            }

            // This will "replay" the move to the board, but re-uses that functionality to score the move
            const score = this.playMoveToBoard(thisMove);
            // Update the move's score
            thisMove.score = score;

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
        },

        openSwapModal() {
            this.swapModalOpen = true;
        },

        closeSwapModal() {
            this.swapModalOpen = false;
            this.swapTiles = [];
        },

        tileIsSelectedForSwap(tileIndex) {
            return this.swapTiles.includes(tileIndex);
        },

        togglePlayerTileForSwap(tileIndex) {
            if (this.tileIsSelectedForSwap(tileIndex)) {
                this.swapTiles = this.swapTiles.filter((index) => index !== tileIndex);
            } else {
                this.swapTiles.push(tileIndex);
            }
        },

        swapTilesAndSkip() {
            this.game.getCurrentPlayer().swapTiles(this.swapTiles, this.letterBag);
            const newMove = new Move(false, 0, 0, '');

            // Force reactivity
            const newMoves = [...this.game.moves];
            newMoves.push(newMove);
            this.game.moves = newMoves;

            this.moveIsPlayed = true;
            this.closeSwapModal();
        }

    }))
})
