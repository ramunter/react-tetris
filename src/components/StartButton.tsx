import React from 'react';
import { StyledStartButton } from './styles/StyledStartButton';

const StartButton = ({ callback }: {callback: Function}) => (
    <StyledStartButton onClick={callback}>Start Game</StyledStartButton>
)

export default StartButton;