const chromium = require('chrome-aws-lambda');

function isFullUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    // invalid url OR local path
    return false;
  }
}

async function addItem(url, { text, note, priority = 0 }) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (
      !request.url().includes('workflowy.com') ||
      request.url().includes('.css') ||
      request.url().endsWith('.ico')
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  let response = await page.goto(url);
  await page.waitForSelector('.pageContainer');

  const id = await page.evaluate(
    (text = '', note = '', priority = 0) => {
      let item = WF.createItem(WF.rootItem(), priority);
      WF.setItemName(item, text);
      WF.setItemNote(item, note);
      return item.data.item.item.item.item.id;
    },
    text,
    note,
    priority
  );

  await page.waitForSelector(`[projectid="${id}"]`);
  await page.waitForTimeout(500); // truly not sure why this is necessary
  await browser.close();
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 200,
      headers,
    };
  }

  const { url, text, note, priority } = JSON.parse(event.body);

  try {
    if (!isFullUrl(url)) {
      throw new Error(`Invalid \`url\`: ${url}`);
    }

    let output = await addItem(url, { text, note, priority });

    return {
      statusCode: 200,
      body: `Added!`,
      headers,
    };
  } catch (error) {
    console.log('Error', error);

    return {
      statusCode: 503,
      headers,
    };
  }
}

exports.handler = handler;
