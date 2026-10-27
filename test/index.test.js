import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { writeFile, readFile, rm } from 'node:fs/promises';\nimport { spawnSync } from 'node:child_process';\nimport { resolve } from 'node:path';\n
test('parallel-pulse CLI returns valid JSON and exits 0', async (t) => {\n  const cliPath = resolve('src', 'index.js');\n  const result = spawnSync(process.execPath, [cliPath, '--workers=2', '--iterations=10'], { encoding: 'utf-8' });\n  assert.strictEqual(result.status, 0);
  const output = result.stdout.trim();
  let json;
  assert.doesNotThrow(() => { json = JSON.parse(output); });
  assert.strictEqual(json.workers, 2);
  assert.strictEqual(json.iterations, 10);
  assert.ok(typeof json.totalTimeMs === 'string' && Number(json.totalTimeMs) > 0);\n  assert.ok(typeof json.opsPerSec === 'number' && json.opsPerSec > 0);
});
