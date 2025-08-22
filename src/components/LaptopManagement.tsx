import React, { useState } from 'react';
import { Laptop } from '../types';
import LaptopCard from './LaptopCard';

interface LaptopManagementProps {
  laptops: Laptop[];
  setLaptops: React.Dispatch<React.SetStateAction<Laptop[]>>;
  onDataChange: () => void;
}

export default function LaptopManagement({ laptops, setLaptops, onDataChange }: LaptopManagementProps) {
  const totalLaptops = laptops.length;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Laptops</p>
              <p className="text-3xl font-bold text-blue-700">{totalLaptops}</p>
            </div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Laptops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {laptops.map((laptop) => (
          <LaptopCard
            key={laptop.id}
            laptop={laptop}
          />
        ))}
      </div>
    </div>
  );
}