import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text}:{gameOver?:boolean, text?:string}) => (
    <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
)

export default Display;