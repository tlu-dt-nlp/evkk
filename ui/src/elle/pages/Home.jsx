import * as React from 'react';
import { Box } from '@mui/material';
import './styles/Home.css';
import HeroElement from '../components/home/HeroElement';
import ServicesElement from '../components/home/ServicesElement';
import InfoElement from '../components/home/InfoElement';
import StatisticsElement from '../components/home/StatisticsElement';
import ScrollArrow from '../components/ScrollArrow';

export default function Home() {
  return (
    <div>
      <Box className="home-root-box">
        <Box className="hero-element-and-scroll-wrapper">
          <HeroElement />
          <ScrollArrow />
        </Box>
        <Box id="services" />
        <ServicesElement />
        <Box id="tools" />
        <InfoElement />
        <StatisticsElement />
      </Box>
    </div>
  );
}
