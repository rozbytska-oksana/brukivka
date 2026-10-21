import test from 'node:test';
import assert from 'node:assert/strict';
import {
  absoluteSiteUrl,
  canonicalPageUrl,
  serializeJsonLd,
  businessSchema,
} from '../app/utils/seo.ts';
import { businessContacts } from '../app/data/contacts.ts';

test('canonical and image URLs retain the deployment base while excluding tracking and fragments', () => {
  for (const base of ['https://brukivka.org/', 'https://example.test/brukivka/']) {
    assert.equal(canonicalPageUrl(base, '/'), base);
    assert.equal(canonicalPageUrl(base, '/?utm_source=test#kamin'), base);
    assert.equal(
      canonicalPageUrl(base, '/kataloh/bordiur?utm_source=test#photo'),
      `${base}kataloh/bordiur/`,
    );
    assert.equal(absoluteSiteUrl(base, '/images/example.jpg'), `${base}images/example.jpg`);
    assert.equal(businessSchema(base)['@id'], `${base}#business`);
    assert.equal(businessSchema(base).logo.url, `${base}brand/icon-512.png`);
  }
  assert.equal(canonicalPageUrl('', '/'), undefined);
});

test('JSON-LD cannot close the script element and preserves its original data', () => {
  const data = { name: '</script><script>alert("test")</script>', text: 'Камінь & граніт' };
  const json = serializeJsonLd(data);
  assert.doesNotMatch(json, /</);
  assert.deepEqual(JSON.parse(json), data);
});

test('local business schema retains confirmed facts without invented commercial claims', () => {
  const schema = businessSchema('https://brukivka.org/');
  assert.deepEqual(
    schema.telephone,
    businessContacts.phones.map((phone) => phone.number),
  );
  assert.deepEqual(schema.email, businessContacts.emails);
  assert.equal(schema.address.streetAddress, businessContacts.address.street);
  assert.equal(schema.address.addressLocality, 'Житомир');
  assert.equal(schema.foundingDate, '2001');
  for (const field of [
    'aggregateRating',
    'review',
    'priceRange',
    'geo',
    'openingHoursSpecification',
  ]) {
    assert.ok(!(field in schema), field);
  }
});
