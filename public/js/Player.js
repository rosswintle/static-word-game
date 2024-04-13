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
     * @param {String[]} tiles Array of tiles that player has
     * @param {Number} score   The player's score
     */
    constructor(
        tiles,
        score
    ) {
        this.tiles = tiles
        this.score = score
    }

    /**
     * Encodes the player as a coded BigInt
     *
     * @returns {CodedInt} The player encoded as a BigInt (wrapped in a CodedInt)
     */
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

    /**
     * Static method to create a Player from a BigInt
     *
     * @param {BigInt} codedSrc The BigInt to decode from
     * @returns {Player} The player decoded from the BigInt
     */
    static decodeFromBigInt(codedSrc) {
        let coded = new CodedInt(codedSrc);
        let tileCount = coded.popBits(3)
        // debugger;
        let tiles = []

        for (let i = 0; i < tileCount; i++) {
            let tile = String.fromCharCode(Number(coded.popBits(5)) + 65)
            tiles.push(tile)
        }

        let score = Number(coded.popBits(10))

        return new Player(tiles, score)
    }

    /**
     * Returns the number of bits required to encode this player.
     *
     * Score is 10 bits. Tiles are 5 bits each. Tile count is 3 bits.
     *
     * @returns {Number} The number of bits required to encode this player
     */
    getBitCount() {
        return 13 + (this.tiles.length * 5)
    }

    /**
     * Tops up the player's tiles from the provided letter bag
     *
     * @param {String[]} letterBag The letter bag to top up from
     */
    topUpTiles(letterBag) {
        let tilesNeeded = 7 - this.tiles.length
        // Shuffle the letter bag
        letterBag.sort(() => Math.random() - 0.5)
        for (let i = 0; i < tilesNeeded; i++) {
            this.tiles.push(letterBag.pop())
        }
    }
}
