import React, { useState } from 'react';
import { Dialog } from './ui/(shadcn)/Dialog';

interface LightboxProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="relative">
        <button onClick={handlePrev} className="absolute left-4 top-1/2 transform -translate-y-1/2">
          &lt;
        </button>
        <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="w-full h-auto" />
        <button onClick={handleNext} className="absolute right-4 top-1/2 transform -translate-y-1/2">
          &gt;
        </button>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4">
        Close
      </button>
    </Dialog>
  );
};

export default Lightbox;