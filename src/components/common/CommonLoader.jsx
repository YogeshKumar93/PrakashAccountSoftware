// CommonLoader.jsx
import React from "react";
import styled, { keyframes } from "styled-components";

// Keyframes for cube animation
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(28, 168, 149, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const CubeWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const Cube = styled.div`
  width: 20px;
  height: 20px;
  background-color: #1ca895;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const CommonLoader = ({ loading }) => {
  if (!loading) return null; // Hide loader if not loading
  return (
    <Overlay>
      <CubeWrapper>
        <Cube />
        <Cube />
        <Cube />
      </CubeWrapper>
    </Overlay>
  );
};

export default CommonLoader;
