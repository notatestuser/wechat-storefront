import ifetch from 'isomorphic-fetch';
import debug from 'debug';

const dbg = debug('wtc-walkthechat');

export default async (path, req) => {
  const opts = { credentials: 'same-origin' };
  let url;
  if (req) {
    url = `${req.protocol}://${req.get('host')}${path}`;
    opts.headers = { cookie: req.headers.cookie };
  } else {
    url = `${window.location.protocol}//${window.location.host}${path}`;
  }
  dbg('Requesting', path);
  try {
    const res = await ifetch(url, opts);
    const statusCode = res.status >= 200 && res.status < 300 ? res.status : false;
    const json = res.json();
    dbg('Got status', res.status);
    if (!statusCode) {
      throw new Error(`Status code ${res.status}, ${JSON.stringify(json)}`);
    }
    return json;
  } catch (err) {
    console.error('API error!', path, err);
    throw err;
  }
};
