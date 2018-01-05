import React from 'react';
import NoSSR from 'react-no-ssr';
import ifetch from 'isomorphic-fetch';

import Layout from '../components/Layout';
import Heading from '../components/Heading';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';
import apiRequest from '../utils/walkthechat-api';

export class Products extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (!isLoggedIn) redirect(context, '/login');
    const { req } = context;
    try {
      const json = await apiRequest('/api/timeline/project', req);
      console.log('json', json);
      const { timeline: { _id: projectId } } = json;
      return { projectId };
    } catch (err) {
      console.error('Error', err);
      return { error: true };
    }
  }

  render() {
    return (
      <Layout>
        {this.props.projectId}
      </Layout>
    );
  }
}

export default withAuth(Products);
