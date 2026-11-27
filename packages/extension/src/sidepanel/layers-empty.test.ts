import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('Layers empty copy covers no tree and the original empty body, not text or child layers', () => {
  const source = fs.readFileSync(new URL('./sidepanel.ts', import.meta.url), 'utf8');
  const start = source.indexOf('function renderLayersTab(): string {');
  const end = source.indexOf("  const selectedId = info?.id || '';", start);
  assert.ok(start >= 0 && end > start);
  const code = source.slice(start, end).replace(': string', '') + 'return "populated"; } renderLayersTab();';
  const render = (domTree: unknown[], pageSealed = false) => vm.runInNewContext(code, {
    domTree, pageSealed, inspectWrapperOptedIn: false, renderSealedFrameNotice: () => 'sealed', icon: () => '',
  });
  const body = { tagName: 'body', hasText: false };
  for (const tree of [[], [body]]) assert.match(render(tree), /페이지 준비가 완료되면 레이어 트리가 표시됩니다\./);
  assert.equal(render([{ ...body, hasText: true }]), 'populated');
  assert.equal(render([body, { tagName: 'div', hasText: false }]), 'populated');
  assert.equal(render([body, { tagName: '::before', hasText: false }]), 'populated');
  assert.equal(render([{ tagName: 'div', hasText: false }]), 'populated');
  assert.equal(render([], true), 'sealed');
});
