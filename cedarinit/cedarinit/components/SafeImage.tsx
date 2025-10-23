import React from 'react';

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const allowedSources = ['https://cdn.cedar-initiative.org'];

const isValidSource = (src: string) => {
  return allowedSources.some((source) => src.startsWith(source));
};

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className }) => {
  if (!isValidSource(src)) {
    console.error(`Blocked image source: ${src}`);
    return null; // or a placeholder image
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = '/path/to/placeholder/image.png'; // Fallback image
      }}
    />
  );
};

export default SafeImage;