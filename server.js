const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fetch = require('isomorphic-fetch');
const cors = require('cors');
const next = require('next');
const debug = require('debug')('wtc-server');
const routes = require('./routes');
const jwt = require('jsonwebtoken');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = routes.getRequestHandler(app);

const WALKTHECHAT_API = 'https://cms-api-v2.walkthechat.com';

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});

app.prepare()
  .then(() => {
    const server = express();
    server.use(cookieParser());
    server.use(bodyParser.json());

    // == App API ==

    server.post('/api/logout', (req, res) => {
      res.clearCookie('token');
      res.status(200).json({ ok: true });
    });

    server.post('/api/login', async (req, res) => {
      const body = JSON.stringify({ ...req.body });
      debug('Calling login API', body);
      try {
        const resp = await fetch(`${WALKTHECHAT_API}/admins/login`, {
          body,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await resp.json();
        if (resp.status === 200) {
          debug('Got login result', json);
          const token = jwt.decode(json.info.token);
          const { exp } = token;
          const expires = new Date(exp * 1000);
          debug('Token expires at', expires);
          res.cookie('token', json.info.token, { expires }).json({ ok: true });
        } else {
          debug('Login error', resp.status, resp.statusText);
          res.status(400).json({ ok: false, error: json.error });
        }
      } catch (err) {
        res.status(500).json({ error: err.message || err });
      }
    });

    // == WalkTheChat API ==

    const userResHeaderDecorator = (headers) => {
      headers['cache-control'] = 'no-cache, no-store, must-revalidate';
      return headers;
    };

    server.options('/api*', cors());
    server.use('/api*', cors(), proxy(WALKTHECHAT_API, {
      https: true,
      userResHeaderDecorator,
      proxyReqOptDecorator: (proxyReq, req) => {
        if (req.cookies.token) {
          proxyReq.headers['x-access-token'] = req.cookies.token;
        }
        if (req.query.project) {
          proxyReq.headers['x-id-project'] = req.query.project;
        }
        return proxyReq;
      },
    }));

    server.use(handler);

    server.listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port}`);
    });
  });
