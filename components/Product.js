import React from 'react';
import striptags from 'striptags';
import styled from 'styled-components';
import { Card, Icon } from 'antd';
import { Link } from '../routes';

const { Meta } = Card;

const generateDescriptionHtml = (html) => ({ __html: striptags(html, ['h4', 'p', 'strong']) });

const StyledProduct = styled(Card)`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 300px;
`;

const ProductTitleLink = styled.a`
  color: black;
  line-height: 2.5;
  text-decoration: underline;
`;

const CoverImage = styled.img`
  max-height: 200px;
  object-fit: cover;
  object-position: center top;
`;

export default (product) => (
  <StyledProduct
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
      title={
        <Link route={`/product/${product.id}`} prefetch={true}>
          <ProductTitleLink>
            {product.title}
          </ProductTitleLink>
        </Link>}
      description={<div
        dangerouslySetInnerHTML={generateDescriptionHtml(product.description)}
      />}
    />
  </StyledProduct>);
