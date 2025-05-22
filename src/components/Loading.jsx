import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useDarkMode } from './DarkModeContext';

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    background-color: var(--dot-color);
    box-shadow: 0 0 0 0 var(--dot-shadow);
  }
  50% {
    transform: scale(1.2);
    background-color: var(--dot-color-active);
    box-shadow: 0 0 0 10px var(--dot-shadow-transparent);
  }
  100% {
    transform: scale(0.8);
    background-color: var(--dot-color);
    box-shadow: 0 0 0 0 var(--dot-shadow);
  }
`;

const DotsContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: var(--loading-bg, #fff);
`;

const Dot = styled.div`
  height: 20px;
  width: 20px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: var(--dot-color, #b3d4fc);
  animation: ${pulse} 1.5s infinite ease-in-out;

  &:last-child {
    margin-right: 0;
  }

  &:nth-child(1) {
    animation-delay: -0.3s;
  }

  &:nth-child(2) {
    animation-delay: -0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.1s;
  }
`;


const Loading = () => {
  const { darkMode } = useDarkMode();

  // Set CSS variables for dark/light mode
  const styleVars = darkMode
    ? {
        '--loading-bg': '#18191A',
        '--dot-color': '#444e5a',
        '--dot-color-active': '#a435f0',
        '--dot-shadow': 'rgba(178,212,252,0.7)',
        '--dot-shadow-transparent': 'rgba(164,53,240,0)',
      }
    : {
        '--loading-bg': '#fff',
        '--dot-color': '#b3d4fc',
        '--dot-color-active': '#6793fb',
        '--dot-shadow': 'rgba(178,212,252,0.7)',
        '--dot-shadow-transparent': 'rgba(178,212,252,0)',
      };

  return (
    <DotsContainer style={styleVars}>
      <Dot />
      <Dot />
      <Dot />
      <Dot />
      <Dot />
    </DotsContainer>
  );
};

export default Loading; 