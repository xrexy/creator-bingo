import { api } from "@/trpc/server";

export async function CreatorsCount() {
  const count = await api.metrics.getTotalCreators();

  return (
    <p className="text-sm text-gray-500">
      <span className="text-sky-400">{count}</span> creators registered
    </p>
  );
}

