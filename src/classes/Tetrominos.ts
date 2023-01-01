export enum TileStatus {
  Empty = 0,
  Player = 1,
  Locked = 2
}

export interface ITile {
  status: TileStatus; 
  color: string;
}

export const EMPTY_TILE: ITile = { status: TileStatus.Empty, color:'0,0,0' };

function createTetromino(shape: number[][], color: string): ITile[][]{ 
  return shape.map(row =>
    row.map(tile => {
      return {status:tile, color:color};
    }));
}

export const TETROMINOS: Record<string, ITile[][]> = {
    "I": createTetromino(  [
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0],
              [0, 1, 0]
            ],
      '80, 227, 230'),
    "J": createTetromino([
               [0, 1, 0],
               [0, 1, 0],
               [1, 1, 0]
             ],
      '36, 95, 223'),
    "L": createTetromino([
               [0, 1, 0],
               [0, 1, 0],
               [0, 1, 1]
             ],
      '223, 173, 36'),
    "O": createTetromino([
               [1, 1],
               [1, 1],
             ],
      '223, 217, 36'),
    "S": createTetromino([
               [0, 1, 1],
               [1, 1, 0],
               [0, 0, 0]
             ],
      '48, 211, 56'),
    "T": createTetromino([
               [0, 0, 0],
               [1, 1, 1],
               [0, 1, 0]
             ],
      '132, 61, 198'),
    "Z": createTetromino([
               [1, 1, 0],
               [0, 1, 1],
               [0, 0, 0]
             ],
      '227, 78, 78')
};
