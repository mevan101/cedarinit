import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-700">{description}</p>
        {link && (
          <a href={link} className="text-blue-500 hover:underline">
            Learn more
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;