'use client';

import DashboardPage from './page'; // make sure the path is correct

export default function DashboardLayout() {
  return (
      <main className="p-6">
        {/* Render the actual DashboardPage here */}
        <DashboardPage />
      </main>
  );
}
