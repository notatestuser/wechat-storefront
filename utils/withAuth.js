import React from 'react';
import PropTypes from 'prop-types';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import is from 'is';

function parseCookies(context = {}, options = {}) {
  return cookie.parse(
    context.req && context.req.headers
      ? context.req.headers.cookie || ''
      : document.cookie,
    options
  );
}

export default ComposedComponent =>
  class WithAuth extends React.Component {
    static displayName = `WithAuth(${ComposedComponent.displayName})`;

    static propTypes = { user: PropTypes.object };
    static defaultProps = { user: null };

    static async getInitialProps(context) {
      const { token } = parseCookies(context);
      let composedInitialProps = {};
      let props;

      // logged in?
      if (!token || !is.string(token) || !token.length) {
        props = { user: null };
      } else {
        // expired?
        const decoded = jwt.decode(token);
        if (decoded.exp * 1000 <= Date.now()) {
          props = { user: null };
        } else {
          props = { user: jwt.decode(token) };
        }
      }

      // run getInitialProps in the child component
      if (ComposedComponent.getInitialProps) {
        const isLoggedIn = !!props.user;
        composedInitialProps = await ComposedComponent.getInitialProps(context, isLoggedIn);
      }

      // when redirecting the response is finished.
      // there's no point in continuing to render
      if (!process.browser && context.res && context.res.finished) {
        return {};
      }

      return { ...props, ...composedInitialProps };
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };
