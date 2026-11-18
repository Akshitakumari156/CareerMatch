import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenHowItWorks?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHowItWorks }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">CareerMatch</span>
            <span>— Intelligent Career Matching &amp; Recommendations</span>
          </div>

          <div className="flex items-center space-x-4">
            {onOpenHowItWorks && (
              <button
                onClick={onOpenHowItWorks}
                className="hover:text-slate-800 font-medium transition-colors"
              >
                System Architecture
              </button>
            )}
            <span>•</span>
            <div className="flex items-center space-x-1">
              <span>Jobs sourced via</span>
              <a
                href="https://remotive.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-900 inline-flex items-center font-medium ml-1"
              >
                Remotive <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
              </a>
              <span>&amp;</span>
              <a
                href="https://www.arbeitnow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-900 inline-flex items-center font-medium ml-1"
              >
                Arbeitnow <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
