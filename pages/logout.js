import React from 'react';
import NoSSR from 'react-no-ssr';
import ifetch from 'isomorphic-fetch';

import Layout from '../components/Layout';
import Heading from '../components/Heading';
import redirect from '../utils/redirect';

const Loading = () => <Heading>Logging out&hellip;</Heading>;
const Redirecting = () => <Heading>Redirecting&hellip;</Heading>;

export class LogOutHandler extends React.Component {
  async componentDidMount() {
    await ifetch('/api/logout', {
      credentials: 'same-origin',
      method: 'POST',
    });
    redirect(null, '/');
  }

  render() {
    return <Redirecting />;
  }
}

export class LogOut extends React.Component {
  render() {
    return (
      <Layout>
        <NoSSR onSSR={<Loading />}>
          <LogOutHandler />
        </NoSSR>
      </Layout>
    );
  }
}

export default LogOut;
