import React from 'react';
import { ITile } from '../classes/Tetrominos';
import { StyledCell } from './styles/StyledCell';
import { StyledStage } from './styles/StyledStage';

const Stage = ({ stage }: { stage: ITile[][] }) => {
    const width = stage[0].length
    const height = stage.length
    return <StyledStage width={width} height={height}>
        {
            stage.map(row =>
                row.map(tile => <StyledCell tile={tile} />)
            )
        }
    </StyledStage>;
}

export default Stage;