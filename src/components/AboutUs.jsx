import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="about-us">
      <footer className="bg-[#1F2937] text-gray-300 py-10 px-12 md:px-24 scroll-mt-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          
          {/* Brand Info */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-white mb-3">PutraLib</h3>
            <p className="leading-relaxed text-gray-400">
              Your go-to digital library platform. We connect readers with books, ideas, and learning —
              anytime, anywhere.
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-red-400 mt-1" />
                <span>Sultan Abdul Samad Library, Jalan Upm, 43400 Seri Kembangan, Selangor Darul Ehsan</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-red-400 mt-1" />
                <span>03-9769 8642</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-red-400 mt-1" />
                <span>lib@upm.edu.my</span>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="text-left md:text-right">
            <h4 className="text-lg font-semibold text-white mb-4">Stay Connected</h4>
            <p className="text-gray-400">
              © {new Date().getFullYear()} PutraLib. All rights reserved.
            </p>
            <p className="text-gray-400 mt-1">Made with ❤️ for book lovers.</p>
          </div>
          
        </div>
      </footer>
    </section>
  );
};

export default AboutUs;
