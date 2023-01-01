import React, { useCallback, useEffect, useState } from 'react';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { StyledTetris, StyledTetrisWrapper } from './styles/StyledTetris';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { BASE_INTERVAL, KEYS, STAGE_HEIGHT, STAGE_WIDTH } from './Constants';
import { useGameStatus } from '../hooks/useGameStatus';
import { IPlayer } from '../classes/Player';
import { EMPTY_TILE, ITile, TileStatus } from '../classes/Tetrominos';


const createNewStage = (): ITile[][] => {
    const rows: ITile[][] = new Array(STAGE_HEIGHT).fill(null).map(() => new Array(STAGE_WIDTH))
    rows.forEach(row => row.fill(EMPTY_TILE));
    return rows
}

const Tetris = () => {

    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStatus, calculateGameStatus, resetGameStatus] = useGameStatus();
    const [stage, setStage, sweepRows] = useStage(setIsGameOver);
    const [drawing, setDrawing, _] = useStage(setIsGameOver);
    const [player, playerInput, resetPlayer] = usePlayer(setStage);

    useEffect(() => {
        setDrawing(draw(stage, player))
    }, [stage, player]);

    const resetStage = () => {
        setStage(createNewStage);
    }

    const startGame = () => {
        resetStage();
        resetPlayer(stage);
        resetGameStatus();
        setIsGameOver(false);
    };

    const dropTime = useCallback(() => (BASE_INTERVAL / (gameStatus.level + 1)), [gameStatus.level]);
    useInterval(() => {
        if (isGameOver) { return };
        playerInput(KEYS.DOWN, stage);
        let newRowsCleared = sweepRows(stage);
        calculateGameStatus(newRowsCleared);
    }, dropTime());


    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={(e: KeyboardEvent) => !isGameOver && playerInput(e.code, stage)}>
            <StyledTetris>
                <Stage stage={drawing} />
                <aside>
                    {isGameOver ? (
                        <Display gameOver={isGameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${gameStatus.score}`} />
                            <Display text={`rows: ${gameStatus.rows}`} />
                            <Display text={`Level: ${gameStatus.level}`} />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;

function draw(stage: ITile[][], player: IPlayer) {
    let newStage: ITile[][] = structuredClone(stage);
    player.tetromino.forEach((row, y) => row.forEach(
        (tile, x) => {
            if (tile.status == TileStatus.Player) {
                let pos_x = x + player.position.x
                let pos_y = y + player.position.y
                newStage[pos_y][pos_x] = tile
            }
        }
    ));
    return newStage;
}
