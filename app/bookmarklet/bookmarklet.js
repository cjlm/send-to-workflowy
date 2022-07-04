post('!URL', {
  sessionId: '!SESSION_ID',
  parentId: '!PARENT_ID',
  sharedNode: '!SHARED_NODE',
  mode: '!MODE',
  text: `<a href=%22${document.location.href}%22>${document.title}</a>`,
  note: '',
});

function post(
  url,
  { sessionId, parentId, text, note, priority = 0, sharedNode, mode }
) {
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, note, sessionId, parentId, priority }),
  });
}
