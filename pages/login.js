import React from 'react';

import { Form, Icon, Input, Button, message } from 'antd';
import AutoForm from 'react-auto-form';
import styled from 'styled-components';
import pick from 'pedantic-pick';
import ifetch from 'isomorphic-fetch';

import Layout from '../components/Layout';
import FlexBox from '../components/FlexBox';
import Heading from '../components/Heading';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';

const FormItem = Form.Item;
const LoginForm = styled(AutoForm)` min-width: 350px; `;
const LoginButton = styled(Button)` width: 100%; `;
const ForgotLink = styled.a` float: right; `;

export class Login extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (isLoggedIn) redirect(context, '/');
    return {};
  }

  _onSubmit = async (ev, data) => {
    ev.preventDefault();
    try {
      const picked = pick(data, '!nes::username', '!nes::password');
      const resp = await ifetch('/api/login', {
        body: JSON.stringify(picked),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });
      const json = await resp.json();
      if (resp.status === 200) {
        message.success('Logged in successfully!');
        redirect(null, '/');
      } else message.error(json.error);
    } catch (err) {
      console.error('Login failed', err.message || err);
      message.error('Unable to login. Please check your credentials.');
    }
  }

  render() {
    return (
      <Layout title="Login">
        <Heading>
          Admin Login
        </Heading>
        <FlexBox>
          <LoginForm component={Form} onSubmit={this._onSubmit}>
            <FormItem>
              <Input type="email" name="username" placeholder="Email address" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} autofocus={true} />
            </FormItem>
            <FormItem>
              <Input type="password" name="password" placeholder="Password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </FormItem>
            <FormItem>
              <LoginButton type="primary" htmlType="submit">
                Log in
              </LoginButton>
              Or&nbsp;
              <a href="https://cms.walkthechat.com/signup" target="_blank" rel="noopener noreferrer">
                register now
              </a>
              <ForgotLink href="https://cms.walkthechat.com/password-recovery" target="_blank" rel="noopener noreferrer">
                Forgot password?
              </ForgotLink>
            </FormItem>
          </LoginForm>
        </FlexBox>
      </Layout>
    );
  }
}

export default withAuth(Login);
