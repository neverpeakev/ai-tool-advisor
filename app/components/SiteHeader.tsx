import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AiToolAdvisor
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/#roles" className="hover:text-purple-400 transition-colors">
            By Profession
          </Link>
          <Link href="/#comparison" className="hover:text-blue-400 transition-colors">
            Comparisons
          </Link>
          <Link href="/#directory" className="hover:text-white transition-colors">
            All Tools
          </Link>
        </nav>

        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all"
        >
          Browse Tools
        </Link>
      </div>
    </header>
  );
}
