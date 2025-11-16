import Link from 'next/link';

const mockChannels = ['#general', '#updates']; // keep it tiny

export default function ServerOverview({ params }) {
  const serverId = params.serverId;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Server: {serverId}</h2>
      <p className="text-gray-400">Under Construction — channels are placeholders.</p>

      <div className="space-y-2">
        {mockChannels.map((ch) => {
          const clean = ch.replace('#', '');
          return (
            <Link
              key={ch}
              href={`/dashboard/${serverId}/${clean}`}
              className="inline-block bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white py-2 px-4 rounded border border-gray-700"
            >
              {ch}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
