/*
 * A game is:
 * - Player 1
 * - Player 2
 * - [ MOVES ]
 *
 * Originally I stored the 'bag of tiles' here too, but this is not necessary. It can be
 * derived from the moves.
 *
 * All data is encoded right to left. So "tiles in bag/bag count" is the right-most
 * bits.
 * We don't need to state the number of moves on the left. We just keep reading until
 * the end.
 *
 * +-------+----------+----------+
 * | MOVES | PLAYER 1 | PLAYER 2 |
 * +-------+----------+----------+
 */

class Game {
    /**
     * Construct a game
     *
     * @param {Player} player2
     * @param {Player} player1
     * @param {Move[]} moves
     */
    constructor(player1, player2, moves) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = moves;
    }

    /**
     * Encodes the game as a coded BigInt
     *
     * @returns {CodedInt} The game encoded as a BigInt (wrapped in a CodedInt)
     */
    encodeAsBigint() {
        // debugger;
        let gameAsBigInt = new CodedInt(0n);

        // The moves - Reverse them first, so that the most recent move is the last one pushed
        // So that when we decode and unstack, the first move is first
        this.moves.toReversed().map((move) => {
            gameAsBigInt.pushBits(move.getBitCount(), move.encodeAsBigint().getValue());
        });

        // The players
        gameAsBigInt.pushBits(this.player1.getBitCount(), this.player1.encodeAsBigint().getValue());
        gameAsBigInt.pushBits(this.player2.getBitCount(), this.player2.encodeAsBigint().getValue());

        return gameAsBigInt;
    }

    /**
     * Static method to create a Game from a BigInt
     *
     * @param {BigInt} coded The BigInt to decode from
     * @returns {Game}
     */
    static decodeFromBigInt(coded) {
        // debugger;
        let player2 = Player.decodeFromBigInt(coded);
        coded = coded >> BigInt(player2.getBitCount());

        let player1 = Player.decodeFromBigInt(coded);
        coded = coded >> BigInt(player1.getBitCount());

        let moves = [];
        while (coded > 0n) {
            let move = Move.decodeFromBigInt(coded)
            moves.push(move);
            coded = coded >> BigInt(move.getBitCount());
        }

        return new Game(player1, player2, moves);
    }

    /**
     * This returns 1 if the current player is player 1, and 2 if the current player is player 2.
     *
     * This is determined by the number of moves played.
     *
     * @returns {Number}
     */
    getCurrentPlayerId() {
        return this.moves.length % 2 === 0 ? 1 : 2;
    }

    /**
     * Returns the current player object.
     *
     * This is determined by the number of moves played.
     *
     * @returns {Player} The current player
     */
    getCurrentPlayer() {
        return this.getCurrentPlayerId() === 1 ? this.player1 : this.player2;
    }
}
