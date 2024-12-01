'use client';
import { motion } from 'framer-motion';
import { HeroBackground } from './ui/hero-background';

const Hero = () => {
  return (
    <HeroBackground>
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="auto-title">AYTEKİN AUTO</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-200 max-w-3xl mx-auto px-4">
            Hayalinizdeki araca ulaşmanın en güvenilir yolu
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12"
        >
          <a
            href="#vehicles"
            className="discover-button relative px-12 py-4 text-xl text-white font-bold rounded-2xl
                     bg-gradient-to-r from-white/10 to-white/5
                     hover:from-white/20 hover:to-white/10
                     border border-white/20
                     transition-all duration-300 ease-out
                     shadow-[0_0_20px_rgba(255,255,255,0.1)]
                     hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                     backdrop-blur-sm
                     w-[280px] md:w-[320px]"
          >
            <span className="relative z-10">Araçları Keşfet</span>
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="glow-effect" />
            </div>
          </a>
        </motion.div>
      </div>
    </HeroBackground>
  );
};

export default Hero;
