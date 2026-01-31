'use client';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg text-white shadow-md">
            <i className="fas fa-robot text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-gray-900 dark:text-white">
              BisDig Buddy
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Knowledge Base UNIKU
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
            title="API Status"
          >
            <i className="fas fa-circle text-green-500 mr-1"></i>
            <span>Live</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
