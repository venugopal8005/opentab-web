export default function ChannelPage({ params }) {
  const { serverId, channelId } = params;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">#{channelId}</h2>
      <p className="text-gray-400">Under Construction — chat coming soon.</p>
      <p className="text-gray-500">Server: {serverId}</p>
    </div>
  );
}
