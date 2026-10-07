import React from 'react';
import { Leaf, Heart, Shield, Globe, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 shadow-md">
                <Leaf className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">Eco Guardian</span>
            </div>
            <p className="text-lg font-medium text-emerald-300">
              "Small actions. Cleaner communities. A healthier planet."
            </p>
            <p className="text-sm text-emerald-200/70 max-w-md leading-relaxed">
              Built as an environmental awareness and community action platform. Empowering students, neighborhood groups, and civic leaders to identify ecological hazards, adopt zero-waste habits, and mobilize community stewardship.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-300" />
                <span>Verified Cloud Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-300" />
                <span>Open Community Access</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Navigation</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="hover:text-white transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('explore')}
                  className="hover:text-white transition-colors"
                >
                  Explore Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('report')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300 font-semibold"
                >
                  Report Pollution
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('community-reports')}
                  className="hover:text-white transition-colors"
                >
                  Community Reports Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('waste-guide')}
                  className="hover:text-white transition-colors"
                >
                  Waste Guide & AI Identifier
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('challenges')}
                  className="hover:text-white transition-colors"
                >
                  Eco Challenges
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Platform</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-white transition-colors"
                >
                  About the Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy & Ethics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-white transition-colors"
                >
                  Contact Wardens & Teams
                </button>
              </li>
              <li className="pt-2 text-xs text-emerald-300/80 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>support@ecoguardian.org</span>
              </li>
              <li className="text-xs text-emerald-300/80 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Civic Green Tech Initiative</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400 gap-4">
          <p>© {new Date().getFullYear()} Eco Guardian. College Community Environmental Platform (CEP).</p>
          <p className="flex items-center gap-1.5 text-emerald-300">
            <span>Built with care for a sustainable tomorrow</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
