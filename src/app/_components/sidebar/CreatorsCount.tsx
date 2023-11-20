import { api } from "@/trpc/server";
import { unstable_noStore } from "next/cache";

export async function CreatorsCount() {
  unstable_noStore();
  const count = await api.metrics.getTotalCreators();

  return (
    <p className="text-sm text-neutral-500">
      <span className="text-sky-400">{count}</span> creators registered
    </p>
  );
}

