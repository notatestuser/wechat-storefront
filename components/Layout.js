import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import NProgress from 'nprogress';

import {
  Icon,
  Layout,
  LocaleProvider,
  Menu,
} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { Router, Link } from '../routes';
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

const NavAnchor = styled.a`
  &,
  &:hover,
  &:active,
  &:visited {
    color: white;
  }
`;

const getSelectedMenuKeys = (title) => ((t) => {
  switch (t) {
    case 'Home': return ['home'];
    case 'Products': return ['products'];
    case 'Logging Out': return ['logout'];
    default: return ['0'];
  }
})(title);

const handleMenuClick = (key) => {
  switch (key) {
    case 'home': Router.pushRoute('/'); break;
    case 'products': Router.pushRoute('/products'); break;
    case 'logout': Router.pushRoute('/logout'); break;
    default: break;
  }
};

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default ({ title, children }) => [
  <Head key="Head">
    <title>
      My Store{title ? ` - ${title}` : ''}
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
          <Icon type="wechat" />
          &nbsp;
          Store
        </Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedMenuKeys(title)}
          onSelect={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="home">
            <Icon type="home" />
            <span
              className="nav-text"
              onMouseOver={() => { Router.prefetchRoute('/'); }}
              onFocus={() => { Router.prefetchRoute('/'); }}
              role="button"
              tabIndex="-1"
            >
              <NavAnchor>Home</NavAnchor>
            </span>
          </Menu.Item>
          <Menu.Item key="products">
            <Icon type="appstore-o" />
            <span
              className="nav-text"
              onMouseOver={() => { Router.prefetchRoute('/products'); }}
              onFocus={() => { Router.prefetchRoute('/products'); }}
              role="button"
              tabIndex="-1"
            >
              <NavAnchor>Products</NavAnchor>
            </span>
          </Menu.Item>
          {title !== 'Login' ? (
            <Menu.Item key="logout">
              <Icon type="upload" />
              <Link route="/logout">
                <span
                  className="nav-text"
                  role="button"
                  tabIndex="-1"
                >
                  <NavAnchor>Log Out</NavAnchor>
                </span>
              </Link>
            </Menu.Item>) : null}
        </Menu>
      </Sider>
      <Layout>
        <FlexBox direction="column" wrap="nowrap">
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
            © {new Date().getFullYear()} Luke Plaster &nbsp;
            <a href="mailto:me@lukep.org">me@lukep.org</a>
          </Footer>
        </FlexBox>
      </Layout>
    </Layout>
  </LocaleProvider>,
];
