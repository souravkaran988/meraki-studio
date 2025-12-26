import { Instagram, Twitter, Facebook, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Meraki
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              &copy; {new Date().getFullYear()} Art Haven. All rights reserved.
            </p>
          </div>

          {/* Made with Love */}
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Built with</span>
            <Heart size={14} className="text-red-500 fill-current" />
            <span>for Artists</span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition transform hover:scale-110">
              <Instagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
              <Twitter size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition transform hover:scale-110">
              <Facebook size={24} />
            </a>
            <a href="mailto:contact@meraki.com" className="text-gray-400 hover:text-white transition transform hover:scale-110">
              <Mail size={24} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;