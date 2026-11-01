import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, normalizeUrl, parseBookmarks } from './bookmarkHelpers';

test('normalizes URLs with and without https:// to the same value', () => {
  assert.equal(normalizeUrl('https://www.example.com'), 'https://www.example.com');
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com');
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  assert.deepEqual(parseBookmarks(null), []);
  assert.deepEqual(parseBookmarks(''), []);
  assert.deepEqual(parseBookmarks('{not json'), []);
  assert.deepEqual(parseBookmarks('{"url":"https://legacy.example"}'), []);
  assert.deepEqual(parseBookmarks('["legacy string"]'), []);
  assert.deepEqual(parseBookmarks('[{"url":"https://ok.example","slug":"mona-7fk2"},null,{"url":42,"slug":"bad"}]'), [
    { url: 'https://ok.example', slug: 'mona-7fk2' },
  ]);
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
