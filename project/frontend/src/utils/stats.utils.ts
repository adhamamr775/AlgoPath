export function calculateAcceptanceRate(ac: number, total: number): string {
  if (total === 0) return "0.0%";
  return ((ac / total) * 100).toFixed(1) + "%";
}

export function generateChartData(topics: { name: string; count: number }[]) {
  return {
    labels: topics.map(t => t.name),
    data: topics.map(t => t.count)
  };
}
