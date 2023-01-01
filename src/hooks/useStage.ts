import { useState, useEffect } from 'react';
import { Player } from '../classes/Player';
import { EMPTY_TILE, ITile, TileStatus } from '../classes/Tetrominos';
import { STAGE_HEIGHT, STAGE_WIDTH } from '../components/Constants';

const createNewStage = ():  ITile[][] => {
    const rows:  ITile[][] = new Array(STAGE_HEIGHT).fill(new Array(STAGE_WIDTH))
    rows.forEach(row => row.fill(EMPTY_TILE));
    return rows
}

export const useStage = (setIsGameOver:any) => {

    const init_stage = createNewStage()

    const [stage, setStage] = useState(init_stage)
    let newRowsClear = 0

    const noEmptyTilesInRow = (row: ITile[]) => row.findIndex((tile: ITile) => tile.status === TileStatus.Empty) === -1;
    const lockedTileInRow = (row: ITile[]) => row.findIndex((tile: ITile) => tile.status === TileStatus.Locked) !== -1;

    const sweepRows = (stage:  ITile[][]): number => {
        let newStage = stage.reduce((newStage:  ITile[][], row:  ITile[]) => {
            if (noEmptyTilesInRow(row)) {
                newRowsClear += 1;
                newStage.unshift(new Array(stage[0].length).fill(EMPTY_TILE));
                return newStage;
            }
            newStage.push(row);
            return newStage;
        }, []);
        setStage(newStage);
        return newRowsClear;
    }
    
    useEffect(()=> setIsGameOver(lockedTileInRow(stage[4])), [stage]);

    return [stage, setStage, sweepRows] as const;
};

