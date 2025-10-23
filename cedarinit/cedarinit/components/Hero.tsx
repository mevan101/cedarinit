import React from 'react';
import { motion } from 'framer-motion';
import { SafeImage } from './SafeImage';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ y: 0 }}
        whileInView={{ y: -50 }}
        transition={{ duration: 1.5 }}
      >
        <SafeImage
          src="https://cdn.cedar-initiative.org/hero-image.jpg"
          alt="Cedar Initiative Hero"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white">
        <h1 className="text-5xl font-bold">Empowering Youth for a Brighter Future</h1>
        <p className="mt-4 text-lg">Join us in making a difference in the lives of young people.</p>
        <a href="#actions" className="mt-6 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
          Take Action
        </a>
      </div>
    </div>
  );
};

export default Hero;