export interface StatBlockProps {
  value: string;
  label: string;
}

/** A single left-bordered stat: bold value over a small uppercase label. Compose several inside a `.dstats` wrapper. */
export function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div className="stat-block">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
