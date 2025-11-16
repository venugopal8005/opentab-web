export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white pt-20"> {/* pt-20 for fixed navbar */}
      <header className="p-4 bg-[#1F1F1F] border-b border-gray-800">
        <h1 className="text-2xl font-bold">Home Dashboard</h1>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
