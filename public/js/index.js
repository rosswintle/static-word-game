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

        init() {
            this.player1 = new Player(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 0)
            this.player2 = new Player(['T', 'U', 'V', 'W', 'X', 'Y', 'Z'], 0)
            this.game = new Game(this.player1, this.player2, [])
            this.emptyBoard();
        },

        emptyBoard() {
            this.board = Array(15).fill([]);
            let emptyRow = Array(15).fill('');
            // Need to clone in the empty rows
            for (let i = 0; i < 15; i++) {
                this.board[i] = [...emptyRow];
            }
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
                        this.board[y][x + i] = word[i]
                    } else {
                        this.board[y + i][x] = word[i]
                    }
                }
            })
        }
    }))
})
