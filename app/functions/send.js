const { capture } = require('../../core/capture');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let {
    text = '',
    note = '',
    priority = 0,
    parentId,
    sessionId,
    mode,
    url,
  } = JSON.parse(event.body);

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
  };

  console.log(mode);

  try {
    if (mode === 'simple') {
      await fetch('/send-to-shared', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } else {
      await capture({ parentId, sessionId, text, note, priority });
    }
    return {
      headers,
      statusCode: 200,
      body: 'Sent!',
    };
  } catch (err) {
    return {
      headers,
      statusCode: 500,
      body: `Error ${err.status}:${err.message}`,
    };
  }
};
