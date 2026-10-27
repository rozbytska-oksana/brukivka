import test from 'node:test';
import assert from 'node:assert/strict';
import { enquiryLinks, enquiryPhone } from '../app/data/contacts.ts';

test('enquiries use the selected messenger number and safely encode the full message', () => {
  const message = 'Вітаю! Бруківка & плитка?\nЖитомир + 20 м² #проєкт';
  const links = enquiryLinks(message);
  assert.equal(enquiryPhone.number, '+380632692696');
  const whatsapp = new URL(links.whatsapp);
  assert.equal(whatsapp.origin, 'https://wa.me');
  assert.equal(whatsapp.pathname, '/380632692696');
  assert.equal(whatsapp.searchParams.get('text'), message);
  const viber = new URL(links.viber);
  assert.equal(viber.protocol, 'viber:');
  assert.equal(viber.hostname, 'chat');
  assert.equal(viber.searchParams.get('number'), '+380632692696');
  assert.equal(viber.searchParams.has('text'), false);
  const email = new URL(links.email);
  assert.equal(email.pathname, 'info@brukivka.org');
  assert.equal(email.searchParams.get('body'), message);
  assert.equal(email.searchParams.get('subject'), 'Запит щодо гранітних виробів');
});
