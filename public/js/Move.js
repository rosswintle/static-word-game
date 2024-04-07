// import { CodedInt } from './CodedInt';

/**
 * A move is:
 * - 1 bit across/down (across is 1)
 * - XY - 4 bits * 2 = 8 bits
 * - LENGTH - 4 bits (can also be up to 15)
 * - The word (use lower case for blanks? or blank code followed by letter?) - max 9 *  5 = 45
 * - Score (maybe)?
 *
 * +-------+--------+---+---+-------------+
 * | TILES | LENGTH | Y | X | ACROSS/DOWN |
 * +-------+--------+---+---+-------------+
 *
 */

class Move {
    constructor(
        acrossFlag,
        x,
        y,
        word
    ) {
        this.acrossFlag = acrossFlag
        this.x = x
        this.y = y
        this.word = word
    }

    encodeAsBigint() {
        let moveAsBigInt = new CodedInt(0n);

        // The word!
        this.word.toUpperCase().split('').map((char) => {
            // We use 1-based indexing so that we don't end up with a zero value at the end
            // when decoding (this would look like the end of the string!)
            moveAsBigInt.pushBits(5, char.charCodeAt(0) - 64);
        });

        // The word length
        moveAsBigInt.pushBits(4, this.word.length);

        // x and y - 4 bits each
        moveAsBigInt.pushBits(4, this.x);
        moveAsBigInt.pushBits(4, this.y);

        // The across flag
        moveAsBigInt.pushBits(1, this.acrossFlag ? 1 : 0);

        return moveAsBigInt;
    }

    static decodeFromBigInt(codedSrc) {
        let acrossFlag, y, x, length;

        let coded = new CodedInt(codedSrc);
        // let remainingBits = moveAsInt;

        acrossFlag = coded.popBits(1);

        y = Number(coded.popBits(4));
        x = Number(coded.popBits(4));

        length = coded.popBits(4);

        let wordString = '';

        while (coded.getValue() > 0n && length > 0) {
            let currentLetterBits = coded.popBits(5);
            let currentLetter = String.fromCharCode(Number(currentLetterBits) + 64);
            wordString = currentLetter + wordString;
            length--;
        }

        return new Move(
            Boolean(acrossFlag),
            x,
            y,
            wordString
        );
    }

    getBitCount() {
        return 13 + this.word.length * 5;
    }
}
