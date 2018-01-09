import React from 'react';
import { Alert } from 'antd';

import Layout from '../components/Layout';
import FlexBox from '../components/FlexBox';
import Heading from '../components/Heading';
import Product from '../components/Product';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';
import apiRequest from '../utils/walkthechat-api';

export class Products extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (!isLoggedIn) redirect(context, '/login');
    const { req } = context;
    try {
      const path = '/api/products/?sort=sort%20DESC&limit=100&page=1';
      const { products } = await apiRequest(path, req);
      return { products };
    } catch (err) {
      console.error('Error', err);
      return { error: true };
    }
  }

  render() {
    const { products, error } = this.props;
    return (
      <Layout title="Products">
        <Heading>
          Products
        </Heading>
        {error ? <Alert message="An error occurred." type="error" /> : null}
        <FlexBox>
          {products ? products.map(product => <Product key={product.id} {...product} />) : null}
        </FlexBox>
      </Layout>
    );
  }
}

export default withAuth(Products);
