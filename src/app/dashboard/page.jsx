'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../../views/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-[#070714] text-white">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-xs">Loading Dashboard...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return <Dashboard />;
}
