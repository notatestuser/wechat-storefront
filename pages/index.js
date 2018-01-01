import React from 'react';

import Layout from '../components/Layout';
import FlexBox from '../components/FlexBox';
import Heading from '../components/Heading';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';

export class Index extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (!isLoggedIn) redirect(context, '/login');
    return {};
  }

  render() {
    return (
      <Layout>
        <Heading>Welcome {this.props.user.username}!</Heading>
        <FlexBox justify="center">
          <div>Welcome to your storefront.</div>
        </FlexBox>
      </Layout>
    );
  }
}

export default withAuth(Index);
