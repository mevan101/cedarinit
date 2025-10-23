import React from 'react';

interface KPIProps {
  title: string;
  value: number | string;
  description: string;
}

const KPI: React.FC<KPIProps> = ({ title, value, description }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="text-4xl font-semibold text-green-600">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default KPI;