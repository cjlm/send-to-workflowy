import { capture } from '../../core/capture';

export async function onRequest(context) {
  const { request, env } = context;
  return await send(request, env);
}

async function send(request, env) {
  const body = await request.json();

  const { text = '', note = '', priority = 0, ...rest } = body;

  let { parentId, sessionId } = rest;

  if (!parentId || parentId.length === 0) {
    parentId = env.PARENTID;
  }

  if (!sessionId || sessionId.length === 0) {
    sessionId = env.SESSIONID;
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTION',
    'Content-Type': 'text/plain',
  };

  try {
    await capture({ parentId, sessionId, text, note, priority });
    return new Response('Sent!', { headers });
  } catch (err) {
    console.log(err);
    return new Response('Failed!', { headers });
  }
}
