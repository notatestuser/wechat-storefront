import ifetch from 'isomorphic-fetch';
import debug from 'debug';

const dbg = debug('wtc-walkthechat');

export default async (path, req) => {
  let url;
  if (req) {
    url = `${req.protocol}://${req.get('host')}${path}`;
  } else {
    url = `${window.location.protocol}//${window.location.host}${path}`;
  }
  dbg('Requesting', path);
  try {
    const res = await ifetch(url);
    const statusCode = res.status >= 200 && res.status < 300 ? res.status : false;
    dbg('Got status', res.status);
    if (!statusCode) {
      throw new Error(`Status code ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error('API error!', path, err);
    throw err;
  }
};
