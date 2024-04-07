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
        acrossFlag: false,
        x: 0,
        y: 0,
        word: '',
        move: null,

        init() {
            this.move = new Move(this.acrossFlag, this.x, this.y, this.word);
        }
    }))
})
