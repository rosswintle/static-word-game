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

    encodeAsBigint() {
        let gameAsBigInt = new CodedInt(0n);

        // The moves
        this.moves.map((move) => {
            gameAsBigInt.pushBits(move.getBitCount(), move.encodeAsBigint().getValue());
        });

        // The players
        gameAsBigInt.pushBits(this.player1.getBitCount(), this.player1.encodeAsBigint().getValue());
        gameAsBigInt.pushBits(this.player2.getBitCount(), this.player2.encodeAsBigint().getValue());

        return gameAsBigInt;
    }

    /**
     *
     * @param {BigInt} coded
     * @returns {Game}
     */
    static decodeFromBigInt(coded) {
        debugger;
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
}
