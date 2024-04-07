/*
 * A player is:
 * - Tiles in rack: 3 bits
 * - [ TILES ]: 5 bits each
 * - Score: 10 bits
 *
 * +-------+-------+------------+
 * | SCORE | TILES | TILE COUNT |
 * +-------+-------+------------+
 */
class Player {
    /**
     *
     * @param {String[]} tiles
     * @param {Number} score
     */
    constructor(
        tiles,
        score
    ) {
        this.tiles = tiles
        this.score = score
    }

    encodeAsBigint() {
        let playerAsBigInt = new CodedInt(0n);

        // The score
        playerAsBigInt.pushBits(10, this.score);
        // debugger;
        // The tiles
        this.tiles.map((tile) => {
            playerAsBigInt.pushBits(5, tile.toUpperCase().charCodeAt(0) - 65);
        });

        // The tile count
        playerAsBigInt.pushBits(3, this.tiles.length);

        return playerAsBigInt
    }

    static decodeFromBigInt(codedSrc) {
        let coded = new CodedInt(codedSrc);
        let tileCount = coded.popBits(3)
        // debugger;
        let tiles = []

        for (let i = 0; i < tileCount; i++) {
            let tile = String.fromCharCode(Number(coded.popBits(5)) + 65)
            tiles.push(tile)
        }

        let score = coded.popBits(10)

        return new Player(tiles, score)
    }

    getBitCount() {
        return 13 + (this.tiles.length * 5)
    }
}
