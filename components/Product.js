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

const ProductTitle = styled.h4`
  margin-bottom: 12px;
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
      title={<ProductTitle>{product.title}</ProductTitle>}
      description={<div
        dangerouslySetInnerHTML={generateDescriptionHtml(product.description)}
      />}
    />
  </StyledProduct>);
