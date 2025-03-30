import React from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 31, 63, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BannerText = styled.h1`
  color: white;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeaderBanner = () => {
  return (
    <BannerContainer>
      <BannerImage src="/assets/images/banner.png" alt="IPL 2025 Banner" />
      <BannerOverlay>
        <BannerText>IPL 2025 - Cricket Analytics</BannerText>
      </BannerOverlay>
    </BannerContainer>
  );
};

export default HeaderBanner;
