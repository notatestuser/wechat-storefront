import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';

import {
  Icon,
  Layout,
  LocaleProvider,
  Menu,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { Link } from '../routes';
import FlexBox from '../components/FlexBox';

const {
  Content,
  Footer,
  Sider,
} = Layout;

const Logo = styled.div`
  border-radius: 6px;
  color: #fcfcfc;
  cursor: pointer;
  font-size: 2em;
  line-height: 2.5em;
  padding: 0 30px 0 22px;
`;

export default ({ title, children }) => [
  <Head key="Head">
    <title>
      Store CMS{title ? ` - ${title}` : ''}
    </title>
  </Head>,
  <LocaleProvider key="LocaleProvider" locale={enUS}>
    <Layout style={{ height: '100vh', flexDirection: 'row' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
      >
        <Logo>
          Store CMS
        </Logo>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1">
            <Icon type="home" />
            <span className="nav-text">
              Your Store
            </span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="appstore-o" />
            <span className="nav-text">
              Products
            </span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <Link route="/logout">
              <a className="nav-text">
                Log Out
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <FlexBox direction="column">
          <Content style={{ padding: '35px 50px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                padding: 24,
                minHeight: 280,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} Luke Plaster &lt;me@lukep.org&gt;
          </Footer>
        </FlexBox>
      </Layout>
    </Layout>
  </LocaleProvider>,
];
