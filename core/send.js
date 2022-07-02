import { capture } from '../core/capture';

addEventListener('fetch', (event) => {
  return event.respondWith(send(event.request));
});

async function send(request) {
  const body = await request.json();

  const { text = '', note = '', priority = 0, ...rest } = body;

  let { parentId, sessionId } = rest;

  if (!parentId || parentId.length === 0) {
    parentId = process.env.PARENTID;
  }

  if (!sessionId || sessionId.length === 0) {
    sessionId = process.env.SESSIONID;
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTION',
    'Content-Type': 'text/plain',
  };

  try {
    console.log('trying');
    await capture({ parentId, sessionId, text, note, priority });
    return new Response('Sent!', { headers });
  } catch (err) {
    console.log(err);
    return new Response('Failed!', { headers });
  }
}
