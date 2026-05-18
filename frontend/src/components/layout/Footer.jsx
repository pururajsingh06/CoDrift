import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-1 rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">CoDrift</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Real-time collaborative coding platform for teams and students. Build together, anywhere.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Collaborative IDE</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} CoDrift Inc. All rights reserved. Made with ❤️ for developers.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-600 text-xs">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
