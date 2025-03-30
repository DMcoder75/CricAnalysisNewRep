import React from 'react';
import styled, { keyframes } from 'styled-components';
import theme from '../../utils/theme';

const Loader = ({ size = 'medium', color = theme.colors.primary }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '60px';
      case 'medium':
      default:
        return '40px';
    }
  };

  return (
    <LoaderContainer>
      <SpinnerContainer size={getSize()}>
        <Spinner color={color} />
      </SpinnerContainer>
      <LoadingText>Loading...</LoadingText>
    </LoaderContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SpinnerContainer = styled.div`
  width: ${props => props.size};
  height: ${props => props.size};
  position: relative;
  margin-bottom: 10px;
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.color};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export default Loader;
