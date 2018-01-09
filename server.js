const url = require('url');
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

const WALKTHECHAT_API = 'https://rest-cms-api-v2.walkthechat.com';

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
      res
        .clearCookie('token')
        .clearCookie('project')
        .status(200)
        .json({ ok: true });
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
          const resp2 = await fetch(`${WALKTHECHAT_API}/projects/me`, {
            headers: { 'x-access-token': json.info.token },
          });
          if (resp2.status !== 200) {
            console.error('Login error', resp.status, resp.statusText, resp);
          }
          const { projects: [project] } = await resp2.json();
          res
            .cookie('token', json.info.token, { expires })
            .cookie('project', project.id, { expires })
            .json({ ok: true });
        } else {
          console.error('Login error', resp.status, resp.statusText, resp);
          res.status(400).json({ ok: false, error: json.error });
        }
      } catch (err) {
        console.error('Login error', err.message, err);
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
      proxyReqPathResolver: req => {
        const { path } = url.parse(req.baseUrl);
        return path.replace(/^\/api/, '');
      },
      proxyReqOptDecorator: (proxyReq, req) => {
        debug('cookies', req.cookies);
        proxyReq.headers['x-language'] = 'en';
        if (req.cookies.token) {
          proxyReq.headers['x-access-token'] = req.cookies.token;
        }
        if (req.cookies.project) {
          proxyReq.headers['x-id-project'] = req.cookies.project;
        }
        debug('headers', proxyReq.headers);
        return proxyReq;
      },
    }));

    server.use(handler);

    server.listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port}`);
    });
  });
