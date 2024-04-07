class CodedInt {
    constructor(x) {
        this.x = BigInt(x);
    }

    getValue() {
        return this.x;
    }

    toString() {
        return this.x.toString();
    }

    pushBits(bits, value) {
        this.x = (this.x << BigInt(bits)) | BigInt(value);
    }

    popBits(bits) {
        let value = this.x & ((1n << BigInt(bits)) - 1n);
        this.x = this.x >> BigInt(bits);
        return value;
    }

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

    static fromAscii(ascii) {
        let x = 0n;
        for (let i = 0; i < ascii.length; i++) {
            x = (x << 7n) | BigInt(ascii.charCodeAt(i));
        }
        return new CodedInt(x);
    }

    toBase64() {
        return btoa(this.toAscii());
    }

    static fromBase64(base64) {
        return CodedInt.fromAscii(atob(base64));
    }
}
