const { capture } = require('../../core/capture');

const fetch = require('node-fetch');

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

  try {
    if (mode === 'simple') {
      await fetch('https://send-to-workflowy.fly.dev/send', {
        method: 'POST',
        body: JSON.stringify({ text, note, url, priority }),
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
    const error = `Error ${err.status}:${err.message}`;
    console.log(error);
    return {
      headers,
      statusCode: 500,
      body: error,
    };
  }
};
