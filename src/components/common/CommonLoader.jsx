// CommonLoader.jsx
import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for animations
const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(28, 168, 149, 0.15);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${float} 3s ease-in-out infinite;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(28, 168, 149, 0.2);
  border-top: 3px solid #1ca895;
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
  margin-bottom: 20px;
`;

const CubeWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 25px;
`;

const Cube = styled.div`
  width: 16px;
  height: 16px;
  background-color: #1ca895;
  border-radius: 3px;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  &:nth-child(3) {
    animation-delay: 0s;
  }
`;

const LoadingText = styled.p`
  color: #1ca895;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  letter-spacing: 1px;
  animation: ${pulse} 2s ease-in-out infinite;
  text-align: center;
`;

const Dots = styled.span`
  &::after {
    content: '';
    animation: dots 1.5s steps(5, end) infinite;
  }

  @keyframes dots {
    0%, 20% {
      content: '.';
    }
    40% {
      content: '..';
    }
    60%, 100% {
      content: '...';
    }
  }
`;

const CommonLoader = ({ loading, text = "Loading" }) => {
  if (!loading) return null;

  return (
    <Overlay>
      <LoaderContainer>
        <Spinner />
        <CubeWrapper>
          <Cube />
          <Cube />
          <Cube />
        </CubeWrapper>
        <LoadingText>
          {text}
          <Dots />
        </LoadingText>
      </LoaderContainer>
    </Overlay>
  );
};

export default CommonLoader;