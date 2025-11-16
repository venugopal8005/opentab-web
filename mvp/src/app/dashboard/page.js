import Link from 'next/link';

// Mock servers - only IDs and names for navigation
const mockServers = [
  { id: 'server-1', name: 'AI Collaboration Hub' },
  { id: 'server-2', name: 'Helmet Design Team' },
  { id: 'server-3', name: 'Open Source Projects' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h2 className="text-xl font-semibold">Select a Server</h2>
      <div className="space-y-4 w-full max-w-md">
        {mockServers.map((server) => (
          <Link
            key={server.id}
            href={`/dashboard/${server.id}`} // Go to server overview
            className="block w-full bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white py-4 px-6 rounded-lg text-center font-medium transition cursor-pointer border border-gray-600"
          >
            Enter {server.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
