import { ICoordinate } from "./Coordinate";
import { ITile } from "./Tetrominos";


export interface IPlayer {
    collided: boolean;
    tetromino: ITile[][];
    position: ICoordinate;
}

export class Player implements IPlayer {
    
    collided: boolean;
    tetromino: ITile[][];
    position: ICoordinate;

    constructor(position: ICoordinate, tetromino: ITile[][]){
        this.position = position;
        this.tetromino = tetromino;
        this.collided = false;
    }

    rotate = (direction:number) => {
        const matrix = this.tetromino
        if (direction > 0) {
            this.tetromino = matrix[0].map((_val, index) => matrix.map(row => row[index]).reverse());
        } else if (direction < 0) {
            this.tetromino = matrix[0].map((_val, index) => matrix.map(row => row[row.length-1-index])); 
        }
        return this; // TODO: Figure out why scope means we have to return a value here. React stuff?
    }
}