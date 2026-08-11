// Renders every exported component from the *built* dist/index.js with
// minimal required props, via react-dom/server, and reports PASS/FAIL.
// This is what design-sync's own render-check does per-component, run
// ahead of time so build/prop mistakes are caught locally first.

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as DS from '../dist/index.js';

const cases = [
  ['Nav', DS.Nav, { active: 'home' }],
  ['Footer', DS.Footer, { year: 2026 }],
  ['Eyebrow', DS.Eyebrow, { num: '01' }, 'Projects'],
  ['Portrait', DS.Portrait, { variant: 'home', src: '/images/portrait.jpg', alt: 'Aiaru' }],
  [
    'ProjectRow',
    DS.ProjectRow,
    { index: '01', title: 'Zhol', description: 'Freight marketplace.', tag: 'Logistics', href: 'https://getzhol.com' },
  ],
  ['StatBlock', DS.StatBlock, { value: 'Solo', label: 'Build · sales · ops' }],
  ['BigNumber', DS.BigNumber, { value: '14', label: 'days, idea → live' }],
];

let failed = 0;

for (const [name, Component, props, children] of cases) {
  try {
    if (typeof Component !== 'function') {
      throw new Error(`export "${name}" is not a component (got ${typeof Component})`);
    }
    const html = renderToStaticMarkup(createElement(Component, props, children));
    if (!html || html.trim().length === 0) {
      throw new Error('rendered to empty markup');
    }
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${name}  —  ${err.message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${cases.length} component(s) failed to render.`);
  process.exit(1);
}

console.log(`\nAll ${cases.length} components rendered successfully.`);
