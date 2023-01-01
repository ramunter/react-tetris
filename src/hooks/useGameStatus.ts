import { useState } from "react";

interface IGameStatus {
    score: number,
    rows: number,
    level: number,
}

const NEW_GAME_STATUS = { score: 0, rows: 0, level: 0 };

export const useGameStatus = () => {

    const [gameStatus, setGameStatus] = useState<IGameStatus>(NEW_GAME_STATUS);

    const calculateGameStatus = (newRowsCleared:number) => {
        const linePoints = [0, 40, 100, 300, 1200];
        const updatedRows = gameStatus.rows + newRowsCleared;
        const level = Math.floor(updatedRows / 10);
        const updatedStatus = {
            score: gameStatus.score + linePoints[newRowsCleared] * (gameStatus.level + 1),
            rows: updatedRows,
            level: level
        };
        setGameStatus(updatedStatus);
    }

    const resetGameStatus = () => {
        setGameStatus(NEW_GAME_STATUS);
    }

    return [gameStatus, calculateGameStatus, resetGameStatus] as const;

}