import * as React from 'react';

import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <style jsx={true}>{`
            html, body {
              height: 100%;
            }
          `}
          </style>
          <link
            rel="stylesheet"
            href="/static/nprogress.css"
          />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/antd@3.1.0/dist/antd.min.css"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
