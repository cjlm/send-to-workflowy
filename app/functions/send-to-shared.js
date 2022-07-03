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

  let response = await page.goto(url, { waitUntil: ['load', 'networkidle2'] });
  await page.waitForSelector('.pageContainer');

  await page.evaluate(
    (text = '', note = '', priority = 0) => {
      let item = WF.createItem(WF.rootItem(), priority);
      WF.setItemName(item, text);
      WF.setItemNote(item, note);
    },
    text,
    note,
    priority
  );

  await page.waitForTimeout(500);
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
      statusCode: 200,
      headers,
    };
  }
}

exports.handler = handler;
