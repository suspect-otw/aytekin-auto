'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/logo.png"
              alt="Aytekin Auto Logo"
              width={150}
              height={40}
              className="mb-4"
            />
            <p className="text-gray-400 mt-4 max-w-md">
              Your trusted partner in finding the perfect vehicle. Quality service and customer satisfaction guaranteed.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#vehicles" className="text-gray-400 hover:text-white transition-colors">Vehicles</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="block">Phone:</span>
                +90 (XXX) XXX XX XX
              </li>
              <li className="text-gray-400">
                <span className="block">Email:</span>
                info@aytekina.com
              </li>
              <li className="text-gray-400">
                <span className="block">Address:</span>
                Istanbul, Turkey
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Aytekin Auto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
