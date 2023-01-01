import { useState, useCallback } from 'react';

import { EMPTY_TILE, ITile, TETROMINOS, TileStatus} from '../classes/Tetrominos';
import { Player } from '../classes/Player';
import { sample } from 'lodash';
import { ICoordinate } from '../classes/Coordinate';
import { KEYS, STAGE_HEIGHT, STAGE_WIDTH } from '../components/Constants';
import Stage from '../components/Stage';

const START_COORDINATE = { x: STAGE_WIDTH / 2 - 2, y: 0 };
const EMPTY_PLAYER = new Player({ x: 0, y: 0 }, [[EMPTY_TILE]])

// TODO: Clean this
const isValidMove = (player: Player, delta:ICoordinate, stage: ITile[][]) => {
  const tetromino: ITile[][] = player.tetromino;
  for (let y = 0; y < tetromino.length; y += 1) {
      for (let x = 0; x < tetromino[y].length; x += 1) {
        if (tetromino[y][x].status === TileStatus.Empty) {
          continue;
        }
        const new_y = y + player.position.y + delta.y;
        const new_x = x + player.position.x + delta.x;
        if (new_y >= STAGE_HEIGHT || new_y < 0 || new_x < 0 || new_x >= STAGE_WIDTH)  {
          return false;
        }
        if (stage[new_y][new_x].status == TileStatus.Locked) {
          return false;
        }
    }
  }
  return true;
}

const addPlayerToStage = (stage:  ITile[][], player: Player) => {
  const tetromino: ITile[][] = player.tetromino;
  for (let y = 0; y < tetromino.length; y += 1) {
      for (let x = 0; x < tetromino[y].length; x += 1) {
        if (tetromino[y][x].status == TileStatus.Empty) {
          continue;
        }
        const new_y = y + player.position.y;
        const new_x = x + player.position.x;
        stage[new_y][new_x] = tetromino[y][x];
        stage[new_y][new_x].status = TileStatus.Locked;
    }
  }
  return stage
}

export const usePlayer = (setStage:any) => {

  const [player, setPlayer] = useState(EMPTY_PLAYER);

  const rotatePlayer = (direction: number, stage: ITile[][]) => {
    let updatedPlayer = player.rotate(direction);
    if(!isValidMove(player, { x: 0, y: 0 }, stage)) {
      updatedPlayer = updatedPlayer.rotate(-direction);
    }

    setPlayer((prev: Player) => ({
      ...prev,
      tetromino: updatedPlayer.tetromino,
    }))
    // setPlayer(updatedPlayer);
  };

  const movePlayer = (direction: number, stage: ITile[][]) => {
    const delta = { x: direction, y: 0 };
    if (isValidMove(player, delta, stage)) {
        updatePlayerPos(delta, false);
    } 
  };

  const drop = (stage: ITile[][]) => {
    const delta = { x: 0, y: 1 };
    if (isValidMove(player, delta, stage)) {
      updatePlayerPos(delta, false)
    } else { 
      stage = addPlayerToStage(stage, player)
      setStage(stage)
      resetPlayer(stage)
    }
  };

  // TODO: DRY
  const hardDrop = (stage: ITile[][]) => {
    let delta_y = 0;
    while (isValidMove(player, {x:0, y: delta_y}, stage)) {
      delta_y += 1;
    }
    player.position.y += delta_y - 1;
    stage = addPlayerToStage(stage, player)
    setStage(stage)
    resetPlayer(stage)
  }

  const playerInput = (keyCode: string, stage: ITile[][]): void => {
    switch (keyCode) {
        case KEYS.LEFT:
            movePlayer(-1, stage);
            break;
        case KEYS.RIGHT:
            movePlayer(1, stage);
            break;
        case KEYS.DOWN:
            drop(stage);
            break;
        case KEYS.UP:
            rotatePlayer(1, stage);
            break;
        // TODO: Add hard drop
        case KEYS.SPACE:
            hardDrop(stage);
            break;
        default:
            break;
    }
}

  const updatePlayerPos = (delta:ICoordinate, collision: boolean) => {
    setPlayer((prev: Player) => ({
      ...prev,
      position: { x: (prev.position.x += delta.x), y: (prev.position.y += delta.y)},
      collision: collision
    }))
  }

  const resetPlayer = useCallback((stage: ITile[][]) => {
    const new_tetrimino = structuredClone(sample(Object.values(TETROMINOS)))!
    const resetPlayer = new Player({...START_COORDINATE}, new_tetrimino);
    setPlayer(resetPlayer);
  }, [])

  return [player, playerInput, resetPlayer] as const;
}


