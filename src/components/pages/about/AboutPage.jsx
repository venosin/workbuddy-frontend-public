import React from 'react';
import { Navbar } from '../../shared/navigation/Navbar';
import { Footer } from '../../shared/navigation/Footer';
import { AboutHero } from './AboutHero';
import { OurValues } from './OurValues';
import { OurTeam } from './OurTeam';
import { OurHistory } from './OurHistory';

export const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <OurHistory />
        <OurValues />
        <OurTeam />
      </main>
      <Footer />
    </div>
  );
};
