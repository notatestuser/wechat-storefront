import React from 'react';

import { Alert } from 'antd';

import Layout from '../components/Layout';
import FlexBox from '../components/FlexBox';
import Heading from '../components/Heading';
import HomeButton from '../components/HomeButton';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';

export class Index extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (!isLoggedIn) redirect(context, '/login');
    return {};
  }

  render() {
    return [
      <Layout title="Home">
        <Heading>
          Welcome {this.props.user.username}!
        </Heading>
        <Alert message="You were successfully logged in." type="success" />
        <FlexBox>
          <HomeButton route="/products">
            Products
          </HomeButton>
          <HomeButton route="/logout">
            Log Out
          </HomeButton>
        </FlexBox>
      </Layout>,
      <style jsx={true}>{`
        .ant-alert { margin-bottom: 26px; }
      `}
      </style>,
    ];
  }
}

export default withAuth(Index);
