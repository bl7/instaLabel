import React from 'react';
import { Features, Hero, FeaturesScroll, Services, Download, CTA } from '.';

export const Homepage = () => {
  return (
    <>
      <Hero />
      <FeaturesScroll />
      <Features />
      <Download/>
      <Services/>
      <CTA/>
    </>
  );
};
