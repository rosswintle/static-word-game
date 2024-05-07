// import { CodedInt } from './CodedInt';

/**
 * A move is:
 * - 1 bit across/down (across is 1)
 * - XY - 4 bits * 2 = 8 bits
 * - LENGTH - 4 bits (can also be up to 15)
 * - The word (use lower case for blanks? or blank code followed by letter?) - max 9 *  5 = 45
 * - Score - will be derived by the move being played to the board
 *
 * +-------+--------+---+---+-------------+
 * | TILES | LENGTH | Y | X | ACROSS/DOWN |
 * +-------+--------+---+---+-------------+
 *
 */

class Move {
    /**
     * Construct a move
     *
     * @param {Boolean} acrossFlag True if the move is across, false if down
     * @param {number} x The x coordinate (column) of the start of the move
     * @param {number} y The y coordinate (row) of the start of the move
     * @param {string} word The word played
     */
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
        // The score will be calculated when the move is played
        this.score = 0;
    }

    /**
     * Encodes the move as a coded BigInt
     *
     * @returns {CodedInt} The move encoded as a BigInt (wrapped in a CodedInt)
     */
    encodeAsBigint() {
        let moveAsBigInt = new CodedInt(0n);

        // An empty move should be encoded as 13 1's!
        if (this.word === '') {
            moveAsBigInt.pushBits(13, 0b1111111111111);
            return moveAsBigInt;
        }

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

    /**
     * Static method to decode a Move from a BigInt
     *
     * @param {BigInt} codedSrc The BigInt to decode from
     * @returns {Move} The move decoded from the BigInt
     */
    static decodeFromBigInt(codedSrc) {
        let acrossFlag, y, x, length;

        let coded = new CodedInt(codedSrc);
        // let remainingBits = moveAsInt;

        // Get the first 13 bits. If these are 13 1s then this is an empty move
        let moveMeta = coded.popBits(13);
        if (moveMeta === 0b1111111111111) {
            return new Move(false, 0, 0, '');
        }

        let codedMeta = new CodedInt(moveMeta);

        acrossFlag = codedMeta.popBits(1);

        y = Number(codedMeta.popBits(4));
        x = Number(codedMeta.popBits(4));

        length = codedMeta.popBits(4);

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

    /**
     * Gets the number of bits required to encode this move.
     *
     * Across flag - 1 bit, x - 4 bits, y - 4 bits, length - 4 bits,
     * word - 5 bits per letter
     *
     * @returns {Number} The number of bits required to encode this move
     */
    getBitCount() {
        return 13 + this.word.length * 5;
    }
}
