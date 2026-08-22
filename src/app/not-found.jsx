import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found | Tawhid Hasan Bejoy',
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-4xl font-black text-indigo-400 mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-gray-400 max-w-md mb-8 text-sm sm:text-base">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
