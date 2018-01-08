/* eslint-env jest */
/* eslint global-require: "off", "prefer-destructuring": "off" */

jest.mock('../utils/redirect', () => jest.fn());

describe('Index Page', () => {
  let Index;
  let redirect;

  beforeEach(() => {
    jest.resetModules();
    Index = require('../pages/index').Index;
    redirect = require('../utils/redirect');
  });

  it('redirects to login if not logged in', async () => {
    await Index.getInitialProps(null, false);
    expect(redirect).toHaveBeenCalledWith(null, '/login');
  });

  it('does not redirect to login if not logged in', async () => {
    await Index.getInitialProps(null, true);
    expect(redirect).not.toHaveBeenCalled();
  });
});
