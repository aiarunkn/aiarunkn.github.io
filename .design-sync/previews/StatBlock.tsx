import { StatBlock } from '@aiaru/site-ds';

export const Default = () => <StatBlock value="Solo" label="Build · sales · ops" />;

export const Group = () => (
  <div className="dstats">
    <StatBlock value="Solo" label="Build · sales · ops" />
    <StatBlock value="1st" label="Freight marketplace in KZ" />
    <StatBlock value="0→1" label="Bootstrapped, no funding" />
  </div>
);
