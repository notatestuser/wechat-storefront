import React from 'react';
import NoSSR from 'react-no-ssr';
import ifetch from 'isomorphic-fetch';

import Layout from '../components/Layout';
import Heading from '../components/Heading';
import redirect from '../utils/redirect';

export class LogOutHandler extends React.Component {
  async componentDidMount() {
    await ifetch('/api/logout', {
      credentials: 'same-origin',
    });
    redirect(null, '/');
  }
}

export class LogOut extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (!isLoggedIn) redirect(context, '/login');
    return {};
  }

  render() {
    return (
      <Layout>
        <NoSSR onSSR={<Heading>Logging out...</Heading>}>
          <LogOutHandler />
        </NoSSR>
      </Layout>
    );
  }
}

export default LogOut;
