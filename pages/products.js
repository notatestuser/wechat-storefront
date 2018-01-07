import React from 'react';
import striptags from 'striptags';
import styled from 'styled-components';
import { Alert, Card, Icon } from 'antd';
import { Link } from '../routes';

import Layout from '../components/Layout';
import FlexBox from '../components/FlexBox';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';
import apiRequest from '../utils/walkthechat-api';

const { Meta } = Card;

const generateDescriptionHtml = (html) => ({ __html: striptags(html, ['h4', 'p', 'strong']) });

const Product = styled(Card)`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 300px;
`;

const ProductTitle = styled.h4`
  margin-bottom: 12px;
`;

const CoverImage = styled.img`
  max-height: 200px;
  object-fit: cover;
  object-position: center top;
`;

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
      <Layout>
        {error ? <Alert message="An error occurred." type="error" /> : null}
        <FlexBox justify="space-between">
          {products ? products.map(product => (
            <Product
              key={product.id}
              bodyStyle={{ flex: 1 }}
              cover={<CoverImage alt="example" src={product.thumbnail} />}
              actions={[
                <Link route={`/product/${product.id}`} prefetch={true}>
                  <a><Icon type="info-circle" /></a>
                </Link>,
                <Icon type="wechat" />,
                <Icon type="ellipsis" />,
              ]}
            >
              <Meta
                title={<ProductTitle>{product.title}</ProductTitle>}
                description={<div dangerouslySetInnerHTML={generateDescriptionHtml(product.description)} />}
              />
            </Product>)
          ) : null}
        </FlexBox>
      </Layout>
    );
  }
}

export default withAuth(Products);
