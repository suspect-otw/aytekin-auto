'use client';
import { Suspense } from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import VehicleGrid from '../components/VehicleGrid';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <main>
          <Hero />
          <VehicleGrid />
          <About />
          <Contact />
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}
