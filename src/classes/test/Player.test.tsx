import { Player } from '../Player';
import { TETROMINOS, TileStatus } from '../Tetrominos';

describe('Player', () => {
    test('test player rotation', () => {
        let player = new Player({ x: 0, y: 0 }, TETROMINOS["I"])
        expect(player.tetromino[0][1].status).toBe(TileStatus.Player)
        player.rotate(1)
        expect(player.tetromino[0][1].status).toBe(TileStatus.Empty)
    });
});
