/**
 * A class for encoding and decoding information to and from BigInts
 */
class CodedInt {
    /**
     * Construct a CodedInt
     *
     * @param {string|number|BigInt|Boolean} x
     */
    constructor(x) {
        this.x = BigInt(x);
    }

    /**
     * Get's the BigInt value.
     *
     * @returns {BigInt} The value of the CodedInt
     */
    getValue() {
        return this.x;
    }

    /**
     * Gets the string representation of the CodedInt
     *
     * @returns {String} The string representation of the CodedInt
     */
    toString() {
        return this.x.toString();
    }

    /**
     * Pushes a value onto the end of the BigInt (including shifting
     * the BigInt to the left by the number of bits)
     *
     * @param {Number} bits  The number of bits to shift
     * @param {BigInt} value The value to push
     */
    pushBits(bits, value) {
        this.x = (this.x << BigInt(bits)) | BigInt(value);
    }

    /**
     * Pops a value from the end of the BigInt (including shifting
     * the BigInt to the right by the number of bits)
     *
     * @param {Number} bits The number of bits to pop
     * @returns {BigInt} The value popped
     */
    popBits(bits) {
        let value = this.x & ((1n << BigInt(bits)) - 1n);
        this.x = this.x >> BigInt(bits);
        return value;
    }

    /**
     * Returns an ASCII representation of the BigInt. This is done by
     * getting 7 bits at a time from the BigInt and converting them to
     * a character.
     *
     * @returns {String} The ASCII representation of the BigInt
     */
    toAscii() {
        let result = '';
        let x = this.x;
        while (x > 0n) {
            let currentLetterBits = x & 0b1111111n;
            let currentLetter = String.fromCharCode(Number(currentLetterBits));
            result = currentLetter + result;
            x = x >> 7n;
        }
        return result;
    }

    /**
     * Static method to create a CodedInt from an ASCII string
     * by converting each character to a 7-bit BigInt and pushing it
     * onto the BigInt.
     *
     * @param {String} ascii
     * @returns {CodedInt}
     */
    static fromAscii(ascii) {
        let x = 0n;
        for (let i = 0; i < ascii.length; i++) {
            x = (x << 7n) | BigInt(ascii.charCodeAt(i));
        }
        return new CodedInt(x);
    }

    /**
     * Gets a Base64 representation of the BigInt by converting it to
     * ASCII and then converting the ASCII to Base64.
     *
     * @returns {String} The base64 representation of the BigInt
     */
    toBase64() {
        return btoa(this.toAscii());
    }

    /**
     * Static method to create a CodedInt from a Base64 string by converting
     * the Base64 to ASCII and then converting the ASCII to a BigInt.
     *
     * @param {String} base64
     * @returns {CodedInt}
     */
    static fromBase64(base64) {
        return CodedInt.fromAscii(atob(base64));
    }
}
