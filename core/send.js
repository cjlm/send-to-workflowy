import { capture } from '../core/capture';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};
function handleOptions(request) {
  console.log('handling options');
  let headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    let respHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Headers': request.headers.get(
        'Access-Control-Request-Headers'
      ),
    };
    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}

addEventListener('fetch', (event) => {
  event.respondWith(
    send(event.request).catch((err) => new Response(err.stack, { status: 500 }))
  );
});

async function send(request) {
  if (request.method === 'OPTIONS') {
    response = handleOptions(request);
  } else {
    const body = await request.json();
    const { text = '', note = '', priority = 0, ...rest } = body;

    let { parentId, sessionId } = rest;

    if (!parentId || parentId.length === 0) {
      parentId = PARENTID;
    }

    if (!sessionId || sessionId.length === 0) {
      sessionId = SESSIONID;
    }

    let response;
    const result = await capture({ parentId, sessionId, text, note, priority });

    response = new Response(result.id, response);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
  }
  return response;
}
