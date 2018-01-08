import React from 'react';
import striptags from 'striptags';
import styled from 'styled-components';
import { Alert, Button, Tabs, List, Select } from 'antd';
import { Router } from '../routes';

import Layout from '../components/Layout';
import FlexBox from '../components/FlexBox';
import withAuth from '../utils/withAuth';
import redirect from '../utils/redirect';
import apiRequest from '../utils/walkthechat-api';

const { TabPane } = Tabs;
const { Option } = Select;

const generateDescriptionHtml = html => ({ __html: striptags(html, ['h4', 'p', 'strong']) });

const generatePhotosHtml = html => ({ __html: striptags(html, ['img'], '\n').split('\n').filter(s => s.startsWith('<img')).join('') });

const generateProductDescription = (products, language) =>
  <div dangerouslySetInnerHTML={generateDescriptionHtml(products[language].description)} />;

const generateProductPhotos = products =>
  <div dangerouslySetInnerHTML={generatePhotosHtml(products.en.description)} />;

const ProductTitle = styled.h1`
  margin: 0;
  line-height: 2;
`;

const ProductImage = styled.img`
  float: right;
  object-fit: scale-down;
  object-position: top;
`;

const BackToListButton = (
  <Button
    onClick={() => { Router.pushRoute('/products'); }}
    onMouseOver={() => { Router.prefetchRoute('/products'); }}
    onFocus={() => { Router.prefetchRoute('/products'); }}
  >
    Back to Products
  </Button>);

export class ProductView extends React.Component {
  static async getInitialProps(context, isLoggedIn: boolean) {
    if (!isLoggedIn) redirect(context, '/login');
    const { req, query: { id } } = context;
    try {
      const path = `/api/products/${id}`;
      const { products } = await apiRequest(path, req);
      return { products };
    } catch (err) {
      console.error('Error', err);
      return { error: true };
    }
  }

  state = { language: 'en' }

  render() {
    const { products, error } = this.props;
    const { language } = this.state;
    return (
      <Layout title="Product View">
        {error ? <Alert message="An error occurred." type="error" /> : null}
        <FlexBox>
          <FlexBox direction="column" flex="1" padding="0 8px 0 0">
            <div style={{ marginBottom: 16 }}>
              Display language &nbsp;
              <Select
                defaultValue={language}
                onChange={(lang) => { this.setState({ language: lang }); }}
                dropdownMatchSelectWidth={false}
              >
                <Option value="en">English</Option>
                <Option value="cn">Chinese</Option>
              </Select>
            </div>
            <ProductTitle>
              {products[language].title}
            </ProductTitle>
            <Tabs tabBarExtraContent={BackToListButton}>
              <TabPane tab="Description" key="1">
                {generateProductDescription(products, language)}
              </TabPane>
              <TabPane tab="Pictures" key="2">
                {generateProductPhotos(products)}
              </TabPane>
              <TabPane tab="Settings" key="3">
                <List
                  itemLayout="horizontal"
                  dataSource={[{
                    title: 'In stock',
                    value: products.en.outOfStock ? 'No' : 'Yes',
                  }, {
                    title: 'Price',
                    value: products.en.price,
                  }, {
                    title: 'Min Price',
                    value: products.en.min_price,
                  }, {
                    title: 'Max Price',
                    value: products.en.max_price,
                  }]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.value}
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </FlexBox>
          <FlexBox flex="0">
            <ProductImage src={products[language].thumbnail} alt="product" align="right" />
          </FlexBox>
        </FlexBox>
      </Layout>
    );
  }
}

export default withAuth(ProductView);
