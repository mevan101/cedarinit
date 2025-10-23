import { Lightbox } from '@/components/Lightbox';
import { SafeImage } from '@/components/SafeImage';
import { SiteContent } from '@/lib/types';
import content from '@/lib/content';

const GalleryPage = () => {
  const images = [
    { src: 'https://cdn.cedar-initiative.org/image1.jpg', alt: 'Description of image 1' },
    { src: 'https://cdn.cedar-initiative.org/image2.jpg', alt: 'Description of image 2' },
    { src: 'https://cdn.cedar-initiative.org/image3.jpg', alt: 'Description of image 3' },
    // Add more images as needed
  ];

  return (
    <div className="gallery">
      <h1 className="text-3xl font-bold mb-4">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <SafeImage src={image.src} alt={image.alt} className="w-full h-auto cursor-pointer" />
            <Lightbox image={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;