'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface VehicleCardProps {
  vehicle: {
    brand: string;
    model: string;
    year: string;
    km: string;
    color: string;
    price: string;
    imageUrl: string;
    link: string;
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={vehicle.imageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          className="object-contain object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate mb-2">
          {vehicle.brand} {vehicle.model}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Yıl</span>
            <span className="text-white">{vehicle.year}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">KM</span>
            <span className="text-white">{vehicle.km}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Renk</span>
            <span className="text-white">{vehicle.color}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">{vehicle.price}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => window.open(vehicle.link, '_blank')}
            >
              İncele
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
