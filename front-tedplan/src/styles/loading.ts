import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 16px;
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #1CAECC;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

export const LoadingText = styled.div`
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
  
  span {
    width: 8px;
    height: 8px;
    background-color: #1CAECC;
    border-radius: 50%;
    animation: ${pulseAnimation} 1s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;