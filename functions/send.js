export async function onRequest(context) {
  const { request, env } = context;
  return await send(request, env);
}

async function send(request, env) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTION',
    'Content-Type': 'text/plain',
  };

  try {
    const body = await request.json();
    const isSimple = body.mode === 'simple';

    const url = isSimple
      ? `https://next--send-to-workflowy.netlify.app/send-to-shared`
      : 'https://send-to-workflowy.cjlm.workers.dev';

    await fetch(url, {
      method: 'POST',
      headers: isSimple ? {} : { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return new Response('Sent!', { headers });
  } catch (err) {
    console.log(err);
    return new Response('Failed!', { headers });
  }
}
