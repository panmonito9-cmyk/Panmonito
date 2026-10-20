import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler, renderConfirmation } from '../lib/contacto.js';

const env = { GMAIL_USER: 'negocio@gmail.com', GMAIL_APP_PASSWORD: 'abcd efgh ijkl mnop', CONTACT_EMAIL: 'recibe@gmail.com' };
const now = 1800000000000;
function fixture(options = {}) {
  const messages = [];
  let config;
  const handler = createContactHandler({
    env, now: () => now, rateLimits: new Map(),
    createTransport: (value) => {
      config = value;
      return { sendMail: async (mail) => {
        messages.push(mail);
        if (options.failAt === messages.length) throw new Error('Simulated SMTP failure');
        return { accepted: [mail.to] };
      }, close() {} };
    },
    ...options,
  });
  return { messages, config: () => config, call: async (changes = {}) => {
    const req = { method: 'POST', headers: { host: 'tienda.vercel.app', origin: 'https://tienda.vercel.app', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' },
      body: { nombre: 'Laura <&>', email: 'laura@example.com', telefono: '+57 300 123 4567', mensaje: 'Quisiera información.', website: '', startedAt: now - 5000 }, ...changes };
    const res = { statusCode: 200, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.statusCode=code; return this; }, json(body) { this.body=body; return this; } };
    await handler(req,res); return res;
  } };
}

test('delivers business notice first and escaped confirmation second, with correct Reply-To', async () => {
  const f = fixture(); const res = await f.call();
  assert.equal(res.statusCode, 200); assert.equal(res.body.confirmationSent, true);
  assert.equal(f.messages.length, 2);
  assert.equal(f.messages[0].to, env.CONTACT_EMAIL);
  assert.equal(f.messages[0].replyTo.address, 'laura@example.com');
  assert.match(f.messages[0].text, /Quisiera información/);
  assert.equal(f.messages[1].to, 'laura@example.com');
  assert.equal(f.messages[1].replyTo, env.CONTACT_EMAIL);
  assert.match(f.messages[1].html, /Laura &lt;&amp;&gt;/);
  assert.doesNotMatch(f.messages[1].html, /\{\{/);
  assert.doesNotMatch(f.messages[1].html, /Quisiera información/);
  assert.equal(f.config().auth.pass, 'abcdefghijklmnop');
  assert.equal(f.config().secure, true);
});

test('renders the actual editable HTML without unescaped personal data', () => {
  const html = renderConfirmation('<script>');
  assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script>/);
  assert.match(html, /Gracias por/);
});

test('rejects malformed, oversized, wrong-origin and non-POST requests without sending', async () => {
  const f = fixture();
  assert.equal((await f.call({ method: 'GET' })).statusCode,405);
  assert.equal((await f.call({ headers: { host: 'tienda.vercel.app', origin: 'https://otro.example', 'content-type': 'application/json' } })).statusCode,403);
  assert.equal((await f.call({ body: '{bad json' })).statusCode,400);
  assert.equal((await f.call({ body: { email: 'bad' } })).statusCode,400);
  assert.equal((await f.call({ body: 'x'.repeat(12001) })).statusCode,413);
  assert.equal(f.messages.length,0);
});

test('honeypot and missing credentials do not send email', async () => {
  const f = fixture();
  assert.equal((await f.call({ body: { website: 'spam' } })).statusCode,200);
  assert.equal(f.messages.length,0);
  const missing = fixture({ env: {} });
  assert.equal((await missing.call()).statusCode,503);
  assert.equal(missing.messages.length,0);
});

test('rate limiting rejects the sixth valid request per instance', async () => {
  const f = fixture();
  for (let i=0;i<5;i++) assert.equal((await f.call()).statusCode,200);
  assert.equal((await f.call()).statusCode,429);
  assert.equal(f.messages.length,10);
});

test('no confirmation is sent if the business notice fails', async () => {
  const f = fixture({ failAt: 1 });
  assert.equal((await f.call()).statusCode,502);
  assert.equal(f.messages.length,1);
});

test('a failed confirmation does not invite duplicate business inquiries', async () => {
  const f = fixture({ failAt: 2 }); const res = await f.call();
  assert.equal(res.statusCode,200);
  assert.equal(res.body.ok,true); assert.equal(res.body.confirmationSent,false);
});


test('rejects recipient-list injection and too-fast submissions', async () => {
  const f = fixture();
  const valid = { nombre: 'Laura', mensaje: 'Hola', startedAt: now - 5000 };
  assert.equal((await f.call({ body: { ...valid, email: 'one,two@example.com' } })).statusCode,400);
  assert.equal((await f.call({ body: { ...valid, email: 'laura@example.com', startedAt: now } })).statusCode,400);
  assert.equal(f.messages.length,0);
});
