export interface BigNumberProps {
  value: string;
  label: string;
}

/** A large faded numeral with a small uppercase label beneath it. */
export function BigNumber({ value, label }: BigNumberProps) {
  return (
    <div className="bignum">
      <span className="n">{value}</span>
      <span className="l">{label}</span>
    </div>
  );
}
